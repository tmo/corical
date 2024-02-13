import logging
import signal
from base64 import b64encode
from concurrent import futures
from datetime import datetime
from time import perf_counter_ns

import grpc
import numpy as np
import pytz
from google.protobuf.timestamp_pb2 import Timestamp

from pfizer import compute_probs as compute_pfizer_probs
from long_covid import compute_long_covid_probs
from proto import corical_pb2, corical_pb2_grpc
from risks import generate_relatable_risks
from tts import compute_probs, scenario_to_vec
from tts_util import get_age_bracket, get_age_bracket_pz, get_age_bracket_children, get_age_bracket_lc, get_link, get_comparison_doses, get_age_bracket_cap
from model import SmileModel

utc = pytz.UTC

logging.basicConfig(format="%(asctime)s: %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

server = grpc.server(futures.ThreadPoolExecutor(32))
server.add_insecure_port(f"[::]:21000")


PZ_children_model_file = "pfizer_children_27_02_23.xdsl"
combined_model_file = "combined_22-09-22.xdsl"
long_covid_model_file = "LC_BN_050224.xdsl"

def now():
    return datetime.now(utc)


def Timestamp_from_datetime(dt: datetime):
    pb_ts = Timestamp()
    pb_ts.FromDatetime(dt)
    return pb_ts


def generate_bar_graph_risks(input_risks):
    return sorted(input_risks, key=lambda br: br.risk) + [
        corical_pb2.BarGraphRisk(
            label=r["event"],
            risk=r["risk"],
            is_relatable=True,
        )
        for r in generate_relatable_risks([risk.risk for risk in input_risks])
    ]

def calculate_clots(outcomes):
    die_from_clots = (outcomes["die_from_csvt"] + outcomes["die_from_pvt"] 
                    - outcomes["die_from_csvt"] * outcomes["die_from_pvt"])
    die_from_clots_covid_given_infected = (
        outcomes["die_from_csvt_covid_given_infected"]
        + outcomes["die_from_pvt_covid_given_infected"]
        - outcomes["die_from_csvt_covid_given_infected"] * outcomes["die_from_pvt_covid_given_infected"]
    )
    get_clots_covid_given_infected = (
        outcomes["get_csvt_covid_given_infected"]
        + outcomes["get_pvt_covid_given_infected"]
        - outcomes["get_csvt_covid_given_infected"] * outcomes["get_pvt_covid_given_infected"]
    )
    return {
        "die_from_clots": die_from_clots, 
        "get_clots_covid_given_infected": get_clots_covid_given_infected, 
        "die_from_clots_covid_given_infected": die_from_clots_covid_given_infected,
    }



class Corical(corical_pb2_grpc.CoricalServicer):
    def ComputePfizerChildren(self, request, context):
        start = perf_counter_ns()
        time = Timestamp_from_datetime(now())

        logger.info(request)

        messages = []

        # sex
        if request.sex == "female":
            sex_label = "female"
            sex_vec = np.array([0.0, 1.0])
        elif request.sex == "male":
            sex_label = "male"
            sex_vec = np.array([1.0, 0.0])
        elif request.sex == "other":
            sex_label = "person of unspecified sex"
            sex_vec = np.array([0.5, 0.5])
            messages.append(
                corical_pb2.Message(
                    heading="Sex disclaimer",
                    text="We do not have data on the chosen sex, so the results reflect a population with 50% females and 50% males",
                    severity="info",
                )
            )
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid sex")

        age_text, age_label, age_ix = get_age_bracket_children(request.age)
        # transmission is ignored for the children's vaccine

        dose_labels = {
            "None": ("not had any vaccines", "no"),
            "Two_Pfizer": ("hadhad two shots of ( ago) shots second the Pfizer ", "Pfizer"),
        }

        # The only case there is evidence of is two doses, so this is set here
        # it is easiest to set this here in case there is more evidence later
        request.dose = "Two_Pfizer"
        
        if request.dose == "None":
            comparison_doses = ["Two_Pfizer"]
        elif request.dose == "Two_Pfizer":
            comparison_doses = ["None"]
        else:
            comparison_doses = []

        network = SmileModel(PZ_children_model_file)
        baseline_outcomes = {
            "get_myocarditis_vax": "n10_Vax_Myocarditis",
            "get_myocarditis_bg": "n11_Myocarditis_Background",
            "risk_of_infection": "n9_Risk_Infection",
        }

        infected_outcomes = {
            "get_myocarditis_given_infected": "n12_Myocarditis_Covid",
            # unclear if these should be given infected or not
            "hospitalisation_given_infected": "n13_Hospital",
            "MSIC_given_infected": "n15_MSI_Covid",
            "severse_MSIC_given_infected": "n16_MSI_severe",
        }

        cmp = []

        for i, cdose in enumerate([request.dose] + comparison_doses):
            label, shot_ordinal = dose_labels[cdose]
            cur = {
                "label": label,
                "is_other_shot": i != 0,
                "shot_ordinal": shot_ordinal,
            }
            evidence = {
                "n3_Sex": sex_vec,
                "n1_Vax": cdose,
                "n2_Age": age_label,
                # "n4_Transmission": [0, 0.25, 0.25, 0.25, 0.25] #request.ct
            }

            network.set_evidence(evidence)
            cur.update(network.get_binary_outcomes(baseline_outcomes))
            network.set_evidence({"n9_Risk_Infection":"Yes"})
            cur.update(network.get_binary_outcomes(infected_outcomes))
            network.get_network().clear_evidence("n9_Risk_Infection")
            
            cmp.append(cur)
        
        # since there was not enough evidence for severe outcomes given one
        #   dose of the vaccine, 0.5 was used as a filter
        #   before display this needs to be filtered out and a message
        #   written instead
        remove_severe_nodes = False
        if (cmp[0]["hospitalisation_given_infected"] == 0.5 or 
            cmp[0]["MSIC_given_infected"] == 0.5):
            remove_severe_nodes = True

        scenario_description = f"Here are your results. These are for a {age_text} {sex_label}. They are based on getting the Pfizer vaccine."
        out = corical_pb2.ComputeRes(
            messages=messages,
            scenario_description=scenario_description,
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"What is my child's chance of having inflammation of their heart muscle (myocarditis)?",
                    subtitle=f"The Pfizer vaccine can cause inflammation of the heart muscle. This is called myocarditis. Children can get myocarditis from other causes even if they haven't had the vaccine. COVID-19 infection can also cause myocarditis in some children. ",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting myocarditis after the child has 2 shots of the vaccine ",
                                risk=d["get_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            ) for d in cmp
                            if d["get_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label'] and (d['shot_ordinal'] != "no")
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting myocarditis over 3 months if the child has had 0 shots of the vaccine and no COVID-19",
                                risk=cmp[0]["get_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting myocarditis after the child gets COVID-19",
                                risk=cmp[0]["get_myocarditis_given_infected"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"What is the chance of my child going to hospital due to COVID-19?",
                    subtitle=f"Whilst most children do not get very sick from COVID-19, some do need to go to hospital. Many of these children have other health problems.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of going to hospital if the child has 2 shots of the vaccine and gets COVID-19 ",
                                risk=d["hospitalisation_given_infected"],
                                is_other_shot=d["is_other_shot"],
                            ) for d in cmp
                            if d['hospitalisation_given_infected'] > 0.0 and d['shot_ordinal']  !=  "no"
                        ] 
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of going to hospital if the child has 0 shots of the vaccine and gets COVID-19",
                                risk=d["hospitalisation_given_infected"],
                                is_other_shot=d["is_other_shot"],
                            ) for d in cmp
                            if d['hospitalisation_given_infected'] > 0.0 and d['shot_ordinal']  == "no"
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"What is the chance of my child having Multisystem Inflammatory Syndrome due to COVID-19?",
                    subtitle=f"COVID-19 can cause serious health problems in some children. A small number of children can get inflammation of their organs, such as the heart, brain, kidneys, blood vessels, skin, digestive system or eyes. This is called Multisystem Inflammatory Syndrome in Children.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of Multisystem Inflammatory Syndrome if the child has 2 shots of the vaccine and gets COVID-19",
                                risk=d["MSIC_given_infected"],
                                is_other_shot=d["is_other_shot"],
                            ) for d in cmp
                            if d["MSIC_given_infected"] > 0.0 and d['shot_ordinal']  != "no"
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of Multisystem Inflammatory Syndrome if the child has 0 shots of the vaccine and gets COVID-19",
                                risk=d["MSIC_given_infected"],
                                is_other_shot=d["is_other_shot"],
                            ) for d in cmp
                            if d["MSIC_given_infected"] > 0.0 and d['shot_ordinal']  == "no"
                        ]
                    ) if not remove_severe_nodes else
                        generate_bar_graph_risks(
                            [
                                corical_pb2.BarGraphRisk(
                                    label=f"Chance of going to the hospital from COVID-19 if infected",
                                    risk=0.0,
                                    is_other_shot=True,
                                    bar_text="Not enough evidence available.",
                                    hover_text="There is not enough evidence to provide information on this."
                                ),
                                corical_pb2.BarGraphRisk(
                                    label=f"Chance of Multisystem Inflammatory Syndrome in Children from COVID-19 if infected",
                                    risk=0.0,
                                    is_other_shot=True,
                                    bar_text="Not enough evidence available.",
                                    hover_text="There is not enough evidence to provide information on this."
                                ),
                            ]
                        ),
                ),
                corical_pb2.BarGraph(
                    title=f"What is my child's chance of getting COVID-19?",
                    subtitle=f"The COVID-19 vaccines aim to stop children from getting very sick from COVID-19. The vaccines can also protect children from getting COVID-19.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting COVID-19 if the child has had two shots of the vaccine ",
                                risk=cmp[0]["risk_of_infection"],
                                is_other_shot=cmp[0]["is_other_shot"],
                            )
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting COVID-19 if the child has had 0 shot of the vaccine",
                                risk=d["risk_of_infection"],
                                is_other_shot=True,
                            ) for d in cmp
                            if d["risk_of_infection"] > 0.0 and (d['shot_ordinal'] == "no")
                        ]
                    ),
                ),
                ],
            output_groups=[],
            success=True,
            msg=str(request),
            vaccine_type = "Children",
        )
        duration = (perf_counter_ns() - start) / 1e6  # ms
        binlog = corical_pb2.BinLog(
            time=time,
            pfizer_req=request,
            res=out,
            duration_ms=duration,
        )

        binlog_out = b64encode(binlog.SerializeToString()).decode("utf8")

        logger.info(f"binlog: {binlog_out}")

        return out
    
    def ComputeCombined(self, request, context):
        start = perf_counter_ns()
        time = Timestamp_from_datetime(now())

        logger.info(request)

        messages = []

        # sex
        if request.sex == "female":
            sex_label = "female"
            sex_vec = np.array([0.0, 1.0])
        elif request.sex == "male":
            sex_label = "male"
            sex_vec = np.array([1.0, 0.0])
        elif request.sex == "other":
            sex_label = "person of unspecified sex"
            sex_vec = np.array([0.5, 0.5])
            messages.append(
                corical_pb2.Message(
                    heading="Sex disclaimer",
                    text="We do not have data on the chosen sex, so the results reflect a population with 50% females and 50% males",
                    severity="info",
                )
            )
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid sex")

        age_text, age_label, age_ix = get_age_bracket_pz(request.age)
        if request.ct == "None":
            transmission_label = "no"
        elif request.ct == "Ten_percent":
            transmission_label = "a huge number of cases "
        elif request.ct == "Five_percent":
            transmission_label = "a large number of cases "
        elif request.ct == "Two_percent":
            transmission_label = "a lot of cases "
        elif request.ct == "ATAGI_Med":
            transmission_label = "few cases"
        elif request.ct == "ATAGI_Low":
            transmission_label = "not many cases"
        else:
            transmission_label = request.ct

        if request.ct == "None":
            messages.append(
                corical_pb2.Message(
                    heading="Note",
                    text="You have selected a scenario with no community transmission. This is only a temporary situation and will change when state or national borders open.",
                    severity="warning",
                )
            )

        dose_labels = {
            # "None": ("not had any vaccines", "no"),
            # "One_at_3wks": ("had one shot (3 weeks ago)", "first"),
            # "Two_under_2mths": ("had two shots (2 months ago)", "second"),
            # "Two_2_4mths": ("had two shots (2-4 months after the vaccine)", "second"),
            # "Two_4_6mths": ("had two shots (4-6 months after the vaccine)", "second"),
            # "Three": ("had three shots", "third"),
            

            "None" : ("not had any vaccines", "no"),
            "OneAZ_3weeks_ago" : ("had one shot of Astrazeneca  (three weeks ago)", "first"),
            "TwoAZ_under_2_months" : ("had two shots of Astrazeneca (2 months ago)", "second"),
            "TwoAZ_2to4_months" : ("had two shots of Astrazeneca (2-4 months ago)", "second"),
            "TwoAZ_4to6_months" : ("had two shots of Astrazeneca (4-6 months ago)", "second"),
            "TwoAZ_6_months" : ("had two shots of Astrazeneca (more than 6 months ago)", "second"),
            "TwoAZ_1Pf_under_2_months" : ("had two shots of Astrazeneca and one shot of Pfizer (2 months ago)", "third"),
            "TwoAZ_1MD_under_2_months" : ("had two shots of Astrazeneca and one shot of Moderna (2 months ago)", "third"),
            "TwoAZ_1Pf_4to6_months" : ("had two shots of Astrazeneca and one shot of Pfizer (4-6 months ago)", "third"),
            "TwoAZ_1MD_4to6_months" : ("had two shots of Astrazeneca and one shot of Moderna (4-6 months ago)", "third"),
            "TwoAZ_1Pf_6_months" : ("had two shots of Astrazeneca and one shot of Pfizer (more than 6 months ago)", "third"),
            "TwoAZ_1MD_6_months" : ("had two shots of Astrazeneca and one shot of Moderna (more than 6 months ago)", "third"),
            "OnePf_3weeks_ago" : ("had one shot of Pfizer (three weeks ago)", "first"),
            "TwoPf_under_2_months" : ("had two shots of Pfizer (2 months ago)", "second"),
            "TwoPf_2to4_months" : ("had two shots of Pfizer (2-4 months ago)", "second"),
            "TwoPf_4to6_months" : ("had two shots of Pfizer (4-6 months ago)", "second"),
            "TwoPf_6_months" : ("had two shots of Pfizer (more than 6 months ago)", "second"),
            "ThreePf_under_2_months" : ("had three shots of Pfizer (2 months ago)", "third"),
            "TwoPf_1MD_under_2_months" : ("had two shots of Pfizer and one shot of Moderna (2 months ago)", "third"),
            "ThreePf_4to6_months" : ("had three shots of Pfizer (4-6 months ago)", "third"),
            "TwoPf_1MD_4to6_months" : ("had two shots of Pfizer and one shot of Moderna (4-6 months ago)", "third"),
            "ThreePf_6_months" : ("had three shots of Pfizer (more than 6 months ago)", "third"),
            "TwoPf_1MD_6_months" : ("had two shots of Pfizer and one shot of Moderna (more than 6 months ago)", "third"),
            "OneMD_3weeks_ago" : ("had one shot of Moderna (three weeks ago)", "first"),
            "TwoMD_under_2_months" : ("had two shots of Moderna (2 months ago)", "second"),
            "TwoMD_2to4_months" : ("had two shots of Moderna (2-4 months ago)", "second"),
            "TwoMD_4to6_months" : ("had two shots of Moderna (4-6 months ago)", "second"),
            "TwoMD_6_months" : ("had two shots of Moderna (more than 6 months ago)", "second"),
            "TwoMD_1Pf_under_2_months" : ("had two shots of Moderna and one shot of Pfizer (2 months ago)", "third"),
            "ThreeMD_under_2_months" : ("had three shots of Moderna (2 months ago)", "third"),
            "TwoMD_1Pf_4to6_months" : ("had two shots of Moderna and one shot of Pfizer (4-6 months ago)", "third"),
            "ThreeMD_4to6months" : ("had three shots of Moderna ( ago)", "third"),
            "TwoMD_1Pf_6_months" : ("had two shots of Moderna and one shot of Pfizer (more than 6 months ago)", "third"),
            "ThreeMD_6_months" : ("had three shots of Moderna(more than 6 months ago)", "third"),
            "Four_doses_any" : ("had four shots", "fourth"),
        }

        # for graphs
        subtitle = f"These results are for a {age_text} {sex_label}."
        myo_subtitle = f"You may have heard that the Pfizer vaccine can give you inflammation of your heart muscle. This is also called myocarditis. There are many other causes of myocarditis, so people can develop this problem even if they haven’t had the vaccine. Myocarditis is also very common in people who have had COVID-19 (infection).  "

        # # for tables
        # if request.dose == "None":
        #     explanation = f"Results shown for a {age_text} {sex_label} who has not been vaccinated, and under {transmission_label} community transmission, the risks of the folnot many casesing events are shown."
        # else:
        #     explanation = f"Results shown for a {age_text} {sex_label} who has {dose_labels[request.dose][0]}, and under {transmission_label} community transmission, the risks of the folnot many casesing events are shown."


        # if request.dose == "None":
        #     comparison_doses = ["One_at_3wks", "Two_under_2mths"]
        # elif request.dose == "One_at_3wks":
        #     comparison_doses = ["None", "Two_under_2mths"]
        # elif request.dose == "Two_under_2mths":
        #     comparison_doses = ["One_at_3wks", "Three"]
        # elif request.dose == "Two_2_4mths":
        #     comparison_doses = ["One_at_3wks", "Three"]
        # elif request.dose == "Two_4_6mths":
        #     comparison_doses = ["One_at_3wks", "Three"]
        # elif request.dose == "Three":
        #     comparison_doses = ["One_at_3wks", "Two_under_2mths", "None"]

        # construct dose from question answers
        if request.dose_number == "Two":
            dose = request.dose_number+request.dose_2+"_"+request.dose_time
        elif request.dose_number == "Three":
            dose = "Two"+request.dose_2+"_1"+request.dose_3+"_"+request.dose_time
            if request.dose_2 == request.dose_3:
                dose = "Three"+request.dose_2+"_"+request.dose_time
        else:
            dose = request.dose_number
        
        comparison_doses = get_comparison_doses(request, None)

        # variant
        # hardcoded as 100% omicron
        variant_vec = None

        network = SmileModel(combined_model_file)
        baseline_outcomes = {
            "get_covid": "n14_Infection_at_current_transmission",
            "get_myocarditis_bg": "n10_BackMyo",
            "die_myocarditis_bg": "n22_Die_from_myocarditis__background",
            "get_myocarditis_vax": "n7_VacMyo",
            "die_myocarditis_vax": "n19_Die_from_vaccine_associatedmyocarditis",
        }

        infected_outcomes = {
            "die_from_covid_given_infected": "n23_Die_from_Covid",
            "get_myocarditis_given_covid": "n17_COV_Myo",
            "die_myocarditis_given_covid": "n26_Die_from_COV_Myo" ,
        }

        cmp = []

        for i, cdose in enumerate([dose] + comparison_doses):
            label, shot_ordinal = dose_labels[cdose]
            cur = {
                "label": label,
                "is_other_shot": i != 0,
                "shot_ordinal": shot_ordinal,
            }
            evidence = {
                "n5_Sex": sex_vec,
                "n1_Dose": cdose,
                "n2_Age": age_label,
                "n4_Transmission": request.ct
            }

            network.set_evidence(evidence)
            cur.update(network.get_binary_outcomes(baseline_outcomes))
            network.set_evidence({"n14_Infection_at_current_transmission":"Yes"})
            cur.update(network.get_binary_outcomes(infected_outcomes))
            network.get_network().clear_evidence("n14_Infection_at_current_transmission")
            
            cmp.append(cur)
        
        vaccine_type  = ""

        logger.info(comparison_doses)
        logger.info(cmp)

        scenario_description = f"Here are your results. These are for a {age_text} {sex_label} when there are {transmission_label} in your community. They are based on the number and timing of shots of {vaccine_type} vaccines you have had."
        out = corical_pb2.ComputeRes(
            messages=messages,
            scenario_description=scenario_description,
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"What is my chance of getting COVID-19?",
                    subtitle=f"This is your chance of getting COVID-19 over a 2-month period. These results are for a {age_text} {sex_label} when there are {transmission_label} in your community.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting COVID-19 if you have {d['label']}",
                                risk=d["get_covid"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="If I get COVID-19, what are my chances of dying?",
                    subtitle=subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from COVID-19 if you have {d['label']}",
                                risk=d["die_from_covid_given_infected"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of having inflammation of my heart muscle (myocarditis)?",
                    subtitle=myo_subtitle + " " + subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having myocarditis over 2 months even if you haven't had a vaccine or COVID-19 infection (background rate)",
                                risk=cmp[0]["get_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having myocarditis from a COVID-19 infection",
                                risk=cmp[0]["get_myocarditis_given_covid"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Your chance of myocarditis after the {cmp[0]['shot_ordinal']} shot of Pfizer vaccine will increase by:",
                                risk=cmp[0]["get_myocarditis_vax"],
                                is_other_shot=cmp[0]["is_other_shot"],
                            )
                            # for d in cmp  # reduce number of comparison doses in myo case
                            # if d["get_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label'] and d['shot_ordinal'] != "no"
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of dying from inflammation of my heart muscle (myocarditis)?",
                    subtitle=myo_subtitle + " " + subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from myocarditis in 2 months even if you haven’t had any vaccine and haven’t had COVID-19 (infection)",
                                risk=cmp[0]["die_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from myocarditis after COVID-19 (infection) ",
                                risk=cmp[0]["die_myocarditis_given_covid"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Your chance of dying from myocarditis after the {d['shot_ordinal']} shot of Pfizer vaccine will increase by:",
                                risk=d["die_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp[0:1]
                            # if d["die_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label'] and d['shot_ordinal'] != "no"
                        ]
                    ),
                ),
            ],
            output_groups=[],
            success=True,
            msg=str(request),
            vaccine_type = "PZ",
        )
        duration = (perf_counter_ns() - start) / 1e6  # ms
        binlog = corical_pb2.BinLog(
            time=time,
            combined_req=request,
            res=out,
            duration_ms=duration,
        )

        binlog_out = b64encode(binlog.SerializeToString()).decode("utf8")

        logger.info(f"binlog: {binlog_out}")

        return out
    
    def ComputeTTS(self, request, context):
        start = perf_counter_ns()
        time = Timestamp_from_datetime(now())

        logger.info(request)

        messages = []

        # sex
        if request.sex == "female":
            sex_label = "female"
            sex_vec = np.array([0.0, 1.0])
        elif request.sex == "male":
            sex_label = "male"
            sex_vec = np.array([1.0, 0.0])
        elif request.sex == "other":
            sex_label = "person of unspecified sex"
            sex_vec = np.array([0.5, 0.5])
            messages.append(
                corical_pb2.Message(
                    heading="Sex disclaimer",
                    text="We do not have data on the chosen sex, so the results reflect a population with 50% females and 50% males",
                    severity="info",
                )
            )
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid sex")

        # az shots
        vaccine_labels = {
            "None": ("not had any vaccines", "no"),
            "OneAZ_under_3_weeks": ("had one shot of AstraZeneca vaccine (1-3 weeks ago)", "first shot of the AstraZeneca vaccine"),
            "TwoAZ_under_2_months": ("had two shots of AstraZeneca vaccine (2 months ago)", "second shot of the AstraZeneca vaccine"),
            "TwoAZ_2to4_months": ("had two shots of AstraZeneca vaccine (2-4 months after the vaccine)", "second shot of the AstraZeneca vaccine"),
            "TwoAZ_4to6_months": ("had two shots of AstraZeneca vaccine (4-6 months after the vaccine)", "second shot of the AstraZeneca vaccine"),
            "TwoAZ_OnePfz_under_2_months": ("had two shots of AstraZeneca vaccine followed by a Pfizer vaccine (2 months ago)", "Pfizer booster vaccine"),
        }

        if request.vaccine == "None":
            comparison_doses = ["OneAZ_under_3_weeks", "TwoAZ_under_2_months"]
        elif request.vaccine == "OneAZ_under_3_weeks":
            comparison_doses = ["None", "TwoAZ_under_2_months"]
        elif request.vaccine == "TwoAZ_under_2_months":
            comparison_doses = ["OneAZ_under_3_weeks", "TwoAZ_OnePfz_under_2_months"]
        elif request.vaccine == "TwoAZ_2to4_months":
            comparison_doses = ["OneAZ_under_3_weeks", "TwoAZ_OnePfz_under_2_months"]
        elif request.vaccine == "TwoAZ_4to6_months":
            comparison_doses = ["OneAZ_under_3_weeks", "TwoAZ_OnePfz_under_2_months"]
        elif request.vaccine == "TwoAZ_OnePfz_under_2_months":
            comparison_doses = ["OneAZ_under_3_weeks", "None"]


        # age
        age_label, age_value, age_ix = get_age_bracket(request.age)

        link = get_link(request.sex, age_ix)

        # if link:
        #     printable = corical_pb2.PrintableButton(
        #         url=link, text=f"Get printable graphs for a {age_label} {sex_label}"
        #     )
        # else:
        #     printable = None
        printable = None

        # community transmission
        ct_vec = scenario_to_vec(request.transmission)
        if request.transmission == "None":
            transmission_label = "no"
        elif request.transmission == "Ten_percent":
            transmission_label = "a huge number of cases"
        elif request.transmission == "Five_percent":
            transmission_label = "a large number of cases"
        elif request.transmission == "Two_percent":
            transmission_label = "a lot of cases"
        elif request.transmission == "ATAGI_Med":
            transmission_label = "few cases"
        elif request.transmission == "ATAGI_Low":
            transmission_label = "not many cases"
        else:
            transmission_label = request.transmission


        if request.transmission == "None":
            messages.append(
                corical_pb2.Message(
                    heading="Note",
                    text="You have selected a scenario with no community transmission. This is only a temporary situation and will change when state or national borders open.",
                    severity="warning",
                )
            )

        # variant
        variant_vec = None

        # for tables
        if request.vaccine == "None":
            explanation = f"Results shown for a {age_label} {sex_label} who has not been vaccinated, when there are {transmission_label} community transmission, the risks of the folnot many casesing events are shown."
        else:
            explanation = f"Results shown for a {age_label} {sex_label} who has  {vaccine_labels[request.vaccine][0]}, and under {transmission_label} community transmission, the risks of the folnot many casesing events are shown."

        blood_clot_brief = (
            "You may have heard that the AstraZeneca vaccine can give you a type of rare blood clotting. This is also called thrombosis with thrombocytopenia syndrome (TTS). "
        )
        # for graphs
        subtitle = f"These results are for a {age_label} {sex_label}."
        # Pfizer booster subtitle
        pz_booster_subtitle = f"You may have heard that the Pfizer vaccine can cause inflammation of your heart muscle. This is also called myocarditis."

        # for output groups

        # logger.info(f"{doses=}")
        logger.info(f"{age_value=}")
        logger.info(f"{sex_vec=}")
        logger.info(f"{variant_vec=}")
        logger.info(f"{ct_vec=}")

        cmp = []
        current_case = None
        for i, cdose in enumerate([request.vaccine] + comparison_doses):
            label, shot_ordinal = vaccine_labels[cdose]
            cur = {
                "label": label,
                "is_other_shot": i != 0,
                "shot_ordinal": shot_ordinal,
            }
            (
                cur["symptomatic_infection"],
                cur["get_tts"],
                cur["die_from_covid_given_infected"],
                cur["die_from_tts"],
                cur["die_from_clots"],
                cur["die_from_covid"],
                cur["get_clots_covid_given_infected"],
                cur["die_from_clots_covid_given_infected"],
                cur["get_myocarditis_vax"],
                cur["die_myocarditis_vax"],
                cur["get_myocarditis_given_covid"],
                cur["die_myocarditis_given_covid"],
                cur["get_myocarditis_bg"],
                cur["die_myocarditis_bg"],
            ) = compute_probs(cdose, age_value, sex_vec, ct_vec, variant_vec)
            cmp.append(cur)
            if cdose == request.vaccine:
                logging.info("Saving current case")
                current_case = cur

        bar_graphs_list = [
            corical_pb2.BarGraph(
                title=f"What is my chance of getting COVID-19?",
                subtitle=f"This is your chance of getting COVID-19 over a 2-month period. These results are for a {age_label} {sex_label} when there are {transmission_label} in your community.",
                risks=generate_bar_graph_risks(
                    [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of getting COVID-19 if you have {d['label']}",
                            risk=d["symptomatic_infection"],
                            is_other_shot=d["is_other_shot"],
                        )
                        for d in cmp
                    ]
                ),
            ),
            corical_pb2.BarGraph(
                title="If I get COVID-19, what are my chances of dying?",
                subtitle=subtitle,
                risks=generate_bar_graph_risks(
                    [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of dying from COVID-19 if you have {d['label']}",
                            risk=d["die_from_covid_given_infected"],
                            is_other_shot=d["is_other_shot"],
                        )
                        for d in cmp
                    ]
                ),
            ),
            corical_pb2.BarGraph(
                title="What is my chance of getting rare blood clots (TTS) from the AstraZeneca shots?",
                subtitle=blood_clot_brief + " " + subtitle ,
                risks=generate_bar_graph_risks(
                    [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of getting rare blood clots if I get COVID-19 (infection)",
                            risk=cmp[0]["get_clots_covid_given_infected"],
                            is_other_shot=True,
                        ),
                    ]
                    + [
                        corical_pb2.BarGraphRisk(
                            label=f"Your chance of rare blood clots after the {d['shot_ordinal']} will increase by: ",
                            risk=d["get_tts"],
                            is_other_shot=d["is_other_shot"],
                        )
                        for d in cmp
                        if (d["get_tts"] > 0.0 or d['label'] == cmp[0]['label']) and d['shot_ordinal'] != "no" and d['shot_ordinal'] != "Pfizer booster vaccine"
                    ]
                    + [
                        corical_pb2.BarGraphRisk(
                            label=f"Your chance of rare blood clots after the {d['shot_ordinal']} will increase by: ",
                            risk=0,
                            is_other_shot=d["is_other_shot"],
                            bar_text="0  No evidence of increased chance of TTS after Pfizer vaccine",
                        )
                        for d in cmp
                        if (d['label'] == cmp[0]['label']) and (d['shot_ordinal'] == "Pfizer booster vaccine")
                    ]
                ),
            ),
            corical_pb2.BarGraph(
                    title="What is my chance of dying from rare blood clots (TTS) from the AstraZeneca shots?",
                    subtitle=blood_clot_brief + " " + subtitle ,
                    risks=generate_bar_graph_risks(
                        [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of dying from rare blood clots if I get COVID-19 (infection)",
                            risk=cmp[0]["die_from_clots_covid_given_infected"],
                            is_other_shot=True,
                        ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Your chance of dying from rare blood clots after the {d['shot_ordinal']} will increase by:",
                                risk=d["die_from_tts"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                            if (d["die_from_tts"] > 0.0 or d['label'] == cmp[0]['label']) and d['shot_ordinal'] != "no" and d['shot_ordinal'] != "Pfizer booster vaccine"
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Your chance of dying from rare blood clots after the {d['shot_ordinal']} will increase by:",
                                risk=0,
                                is_other_shot=d["is_other_shot"],
                                bar_text = "0  No evidence of increased chance of TTS after Pfizer vaccine",
                            )
                            for d in cmp
                            if (d['label'] == cmp[0]['label'])  and (d['shot_ordinal'] == "Pfizer booster vaccine")
                        ]
                    ),
                ),
            ]
        if request.vaccine == "TwoAZ_OnePfz_under_2_months":
            bar_graphs_list.append(
                corical_pb2.BarGraph(
                    title="What is my chance of having inflammation of my heart muscle (myocarditis) after receiving the Pfizer vaccine for my third dose?",
                    subtitle=pz_booster_subtitle + " " + subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            # corical_pb2.BarGraphRisk(
                            #     label=f"Chance of getting myocarditis if I am diagnosed with COVID-19",
                            #     risk=cmp[0]["get_myocarditis_given_covid"],
                            # ),
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having myocarditis in 2 months even if you haven’t had any vaccine and haven’t had COVID-19 (infection)",
                                risk=cmp[0]["get_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having myocarditis if I get COVID-19 (infection)",
                                risk=cmp[0]["get_myocarditis_given_covid"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Your chance of myocarditis after the {d['shot_ordinal']} will increase by:",
                                risk=d["get_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                            if d["get_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label']
                        ]
                    ),
                ),
            )
            bar_graphs_list.append(
                corical_pb2.BarGraph(
                    title="What is my chance of dying from inflammation of my heart muscle (myocarditis) after receiving the Pfizer vaccine for my third dose?",
                    subtitle=pz_booster_subtitle + " " + subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from myocarditis in 2 months even if you haven’t had any vaccine and haven’t had COVID-19 (infection)",
                                risk=cmp[0]["die_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from myocarditis if I get COVID-19 (infection)",
                                risk=cmp[0]["die_myocarditis_given_covid"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Your chance of dying from myocarditis after the {d['shot_ordinal']} will increase by:",
                                risk=d["die_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                            if d["die_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label']
                        ]
                    ),
                ),
            )
        
        scenario_description = f"Here are your results. These are for a {age_label} {sex_label} when there are {transmission_label} in your community. They are based on the number and timing of shots of AstraZeneca/Pfizer vaccines you have had."
        out = corical_pb2.ComputeRes(
            messages=messages,
            scenario_description=scenario_description,
            printable=printable,
            bar_graphs= bar_graphs_list,
            output_groups=[],
            success=True,
            msg=str(request),
            vaccine_type = "AZ",
        )
        duration = (perf_counter_ns() - start) / 1e6  # ms

        binlog = corical_pb2.BinLog(
            time=time,
            tts_req=request,
            res=out,
            duration_ms=duration,
        )

        binlog_out = b64encode(binlog.SerializeToString()).decode("utf8")

        logger.info(f"binlog: {binlog_out}")

        return out

    def ComputePfizer(self, request, context):
        start = perf_counter_ns()
        time = Timestamp_from_datetime(now())

        logger.info(request)

        messages = []

        # sex
        if request.sex == "female":
            sex_label = "female"
            sex_vec = np.array([0.0, 1.0])
        elif request.sex == "male":
            sex_label = "male"
            sex_vec = np.array([1.0, 0.0])
        elif request.sex == "other":
            sex_label = "person of unspecified sex"
            sex_vec = np.array([0.5, 0.5])
            messages.append(
                corical_pb2.Message(
                    heading="Sex disclaimer",
                    text="We do not have data on the chosen sex, so the results reflect a population with 50% females and 50% males",
                    severity="info",
                )
            )
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid sex")

        age_text, age_label, age_ix = get_age_bracket_cap(request.age)
        if request.ct == "None_0":
            transmission_label = "no"
        elif request.ct == "Ten_percent":
            transmission_label = "a huge number of cases "
        elif request.ct == "Five_percent":
            transmission_label = "a large number of cases "
        elif request.ct == "Two_percent":
            transmission_label = "a lot of cases "
        elif request.ct == "ATAGI_Med":
            transmission_label = "few cases"
        elif request.ct == "ATAGI_Low":
            transmission_label = "not many cases"
        else:
            transmission_label = request.ct

        if request.ct == "None_0":
            messages.append(
                corical_pb2.Message(
                    heading="Note",
                    text="You have selected a scenario with no community transmission. This is only a temporary situation and will change when state or national borders open.",
                    severity="warning",
                )
            )

        dose_labels = {
            "None": ("not had any vaccines", "no"),
            "One": ("had one shot ", "first"),
            "Two_under_3mths": ("had two shots (3 months ago)", "second"),
            "Two_3_6mths": ("had two shots (3-6 months after the vaccine)", "second"),
            "Two_6_8mths": ("had two shots (6-8 months after the vaccine)", "second"),
            "Three_under_3mths": ("had three shots (3 months ago)", "third"),
        }

        # for graphs
        subtitle = f"These results are for a {age_text} {sex_label}."
        myo_subtitle = f"You may have heard that the Pfizer vaccine can give you inflammation of your heart muscle. This is also called myocarditis. There are many other causes of myocarditis, so people can develop this problem even if they haven’t had the vaccine. Myocarditis is also very common in people who have had COVID-19 (infection).  "
        
        # for tables
        if request.dose == "None":
            explanation = f"Results shown for a {age_text} {sex_label} who has not been vaccinated, and under {transmission_label} community transmission, the risks of the folnot many casesing events are shown."
        else:
            explanation = f"Results shown for a {age_text} {sex_label} who has {dose_labels[request.dose][0]}, and under {transmission_label} community transmission, the risks of the folnot many casesing events are shown."


        if request.dose == "None":
            comparison_doses = ["One", "Two_under_3mths"]
        elif request.dose == "One":
            comparison_doses = ["None", "Two_under_3mths"]
        elif request.dose == "Two_under_3mths":
            comparison_doses = ["One", "Three_under_3mths"]
        elif request.dose == "Two_3_6mths":
            comparison_doses = ["One", "Three_under_3mths"]
        elif request.dose == "Two_6_8mths":
            comparison_doses = ["One", "Three_under_3mths"]
        elif request.dose == "Three_under_3mths":
            comparison_doses = ["One", "Two_under_3mths", "None"]

        # variant
        # hardcoded as 100% omicron
        variant_vec = None

        cmp = []

        for i, cdose in enumerate([request.dose] + comparison_doses):
            label, shot_ordinal = dose_labels[cdose]
            cur = {
                "label": label,
                "is_other_shot": i != 0,
                "shot_ordinal": shot_ordinal,
            }
            (
                cur["get_covid"],
                cur["get_myocarditis_vax"],
                cur["die_myocarditis_vax"],
                cur["get_myocarditis_given_covid"],
                cur["die_myocarditis_given_covid"],
                cur["get_myocarditis_bg"],
                cur["die_myocarditis_bg"],
                cur["die_covid_if_got_it"],
                cur["die_from_covid"],
            ) = compute_pfizer_probs(cdose, age_label, request.ct, sex_vec, variant_vec)
            cmp.append(cur)

        scenario_description = f"Here are your results. These are for a {age_text} {sex_label} when there are {transmission_label} in your community. They are based on the number and timing of shots of Pfizer vaccines you have had."
        out = corical_pb2.ComputeRes(
            messages=messages,
            scenario_description=scenario_description,
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"What is my chance of getting COVID-19?",
                    subtitle=f"This is your chance of getting COVID-19 over a 2-month period. These results are for a {age_text} {sex_label} when there are {transmission_label} in your community.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting COVID-19 if you have {d['label']}",
                                risk=d["get_covid"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="If I get COVID-19, what are my chances of dying?",
                    subtitle=subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from COVID-19 if you have {d['label']}",
                                risk=d["die_covid_if_got_it"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of having inflammation of my heart muscle (myocarditis)?",
                    subtitle=myo_subtitle + " " + subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having myocarditis in 2 months even if you haven’t had any vaccine and haven’t had COVID-19 (infection)",
                                risk=cmp[0]["get_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having myocarditis after COVID-19 (infection) ",
                                risk=cmp[0]["get_myocarditis_given_covid"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Your chance of myocarditis after the {d['shot_ordinal']} shot of Pfizer vaccine",
                                risk=d["get_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp[:-(len(cmp)-2)]  # reduce number of comparison doses in myo case
                            if d["get_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label'] and d['shot_ordinal'] != "no"
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of dying from inflammation of my heart muscle (myocarditis)?",
                    subtitle=myo_subtitle + " " + subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from myocarditis in 2 months even if you haven’t had any vaccine and haven’t had COVID-19 (infection)",
                                risk=cmp[0]["die_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from myocarditis after COVID-19 (infection) ",
                                risk=cmp[0]["die_myocarditis_given_covid"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Your chance of dying from myocarditis after the {d['shot_ordinal']} shot of Pfizer vaccine",
                                risk=d["die_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp[:-(len(cmp)-2)] 
                            if d["die_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label'] and d['shot_ordinal'] != "no"
                        ]
                    ),
                ),
            ],
            output_groups=[],
            success=True,
            msg=str(request),
            vaccine_type = "PZ",
        )
        duration = (perf_counter_ns() - start) / 1e6  # ms
        binlog = corical_pb2.BinLog(
            time=time,
            pfizer_req=request,
            res=out,
            duration_ms=duration,
        )

        binlog_out = b64encode(binlog.SerializeToString()).decode("utf8")

        logger.info(f"binlog: {binlog_out}")

        return out

    def ComputeLongCovid(self, request, context):
        start = perf_counter_ns()
        time = Timestamp_from_datetime(now())

        logger.info(request)

        messages = []

        # sex
        if request.sex == "female":
            sex_label = "Female"
            sex_vec = np.array([0.0, 1.0])
        elif request.sex == "male":
            sex_label = "Male"
            sex_vec = np.array([1.0, 0.0])
        elif request.sex == "other":
            sex_label = "person of unspecified sex"
            sex_vec = np.array([0.5, 0.5])
            messages.append(
                corical_pb2.Message(
                    heading="Sex disclaimer",
                    text="We do not have data on the chosen sex, so the results reflect a population with 50% females and 50% males",
                    severity="info",
                )
            )
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid sex")

        age_text, age_label, age_ix = get_age_bracket_lc(request.age)

        comor_no = request.comor
        comor_no_label = comor_no.replace("_", " ").lower() 

        infection_no = "First"
        infection_no_label = "none"
        infection_no_plus = "two"
        if request.infection == "1":
            infection_no = "Second"
            infection_no_label = "one"
            infection_no_plus = "three"
        elif request.infection == "2 or more":
            infection_no = "Third_plus"
            infection_no_plus = "three"
            infection_no_label = "2 or more"

        dose_labels = {
            "None": ("not had any vaccines", "no"),
            "First_3weeks_ago": ("3 weeks ago", "first"),
            "Second_2wks_5mnths": ("2 week to 5 months ago", "second"),
            "Second_6_11mnths": ("6 to 11 months ago", "second"),
            "Second_12plus_mnths": ("12 or more months ago", "second"),
            "Third_2wks_5mths": ("2 weeks to 5 months ago", "third"),
            "Third_6_11mnths": ("6 to 11 months ago", "third"),
            "Third_12plus_mnths": ("12 or more months ago", "third"),
            "Fourth_2_4wks": ("2 weeks to 4 weeks ago", "fourth"),
            "Fourth_5_9wks": ("5 to 9 weeks ago", "fourth"),
            "Fourth_10_14wks": ("10 to 14 weeks ago", "fourth"),
            "Fourth_15_19wks": ("15 to 19 weeks ago", "fourth"),
            "Fourth_20plus_wks": ("20 or more weeks ago", "fourth"),
        }

        # for graphs
        subtitle = f"These results are for a {age_text} {sex_label}."
        myo_subtitle = f"You may have heard that the Pfizer vaccine can give you inflammation of your heart muscle. This is also called myocarditis. There are many other causes of myocarditis, so people can develop this problem even if they haven’t had the vaccine. Myocarditis is also very common in people who have had COVID-19 (infection).  "
        
        # for tables
        if request.dose == "None":
            explanation = f"Results shown for a {age_text} {sex_label} who has not been vaccinated"
        else:
            explanation = f"Results shown for a {age_text} {sex_label} are shown."

        # comparison_doses = []
        # shots = "none"
        # the comparied cases, check n2_Dose names
        if request.dose == "None":
            comparison_doses = ["First_3weeks_ago"]
            shots = "none"
        elif request.dose == "First_3weeks_ago":
            comparison_doses = ["Second_2wks_5mnths"] 
            shots = "one" 
        elif request.dose == "Second_2wks_5mnths": 
            comparison_doses = ["Third_2wks_5mths"]
            shots = "two"
        elif request.dose == "Second_6_11mnths": 
            comparison_doses = ["Third_12plus_mnths"]
            # comparison_doses = ["Third_2wks_5mths"]
            shots = "two" 
        elif request.dose == "Second_12plus_mnths":
            # comparison_doses = ["Third_12plus_mnths"]
            comparison_doses = ["Third_6_11mnths"]
            shots = "two"    
        elif request.dose == "Third_2wks_5mths": 
            comparison_doses = ["Fourth_2_4wks"] 
            shots = "three"
        elif request.dose == "Third_6_11mnths": 
            comparison_doses = ["Fourth_15_19wks"] 
            shots = "three"  
        elif request.dose == "Third_12plus_mnths":
            comparison_doses = ["Fourth_20plus_wks"]
            shots = "three"  
        elif request.dose == "Fourth_2_4wks":
            comparison_doses = ["Fourth_5_9wks"] 
            shots = "four"
        elif request.dose == "Fourth_5_9wks":
            comparison_doses = ["Fourth_10_14wks"] 
            shots = "four"
        elif request.dose == "Fourth_10_14wks":
            comparison_doses = ["Fourth_15_19wks"] 
            shots = "four"
        elif request.dose == "Fourth_15_19wks":
            comparison_doses = ["Fourth_20plus_wks"]
            shots = "four"
        elif request.dose == "Fourth_20plus_wks":
            comparison_doses = ["None"]
            shots = "four"

        cmp = []

        for i, cdose in enumerate([request.dose] + comparison_doses):
            label, shot_ordinal = dose_labels[cdose]
            cur = {
                "label": label,
                "is_other_shot": i != 0,
                "shot_ordinal": shot_ordinal,
            }
            (
                cur["get_hospitalisation"],
                cur["get_hospitalisation_drug"],
                cur["get_hospitalisation_infection"],
                cur["get_icu"],
                cur["get_icu_drug"],
                cur["get_icu_infection"],
                cur["get_symptom"],
                cur["get_symptom_drug"],
                cur["get_symptom_infection"],
                cur["get_pulmonary"],
                cur["get_pulmonary_drug"],
                cur["get_pulmonary_infection"],
                cur["get_cardiovascular"],
                cur["get_cardiovascular_drug"],
                cur["get_cardiovascular_infection"],
                cur["get_neurologic"],
                cur["get_neurologic_drug"],
                cur["get_neurologic_infection"],
                cur["get_metabolic"],
                cur["get_metabolic_drug"],
                cur["get_metabolic_infection"],
                cur["get_gastrointestinal"],
                cur["get_gastrointestinal_drug"],
                cur["get_gastrointestinal_infection"],

            ) = compute_long_covid_probs(cdose, age_label, sex_label, comor_no, infection_no)
            cmp.append(cur)

        scenario_description = f"Here are your results. These are for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots. They are based on the number and timing of COVID-19 vaccine shots you have had."
        out = corical_pb2.ComputeRes(
            messages=messages,
            scenario_description=scenario_description,
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"If I get COVID-19, what is my chance of being hospitalised?",
                    subtitle=f"This is your chance of being hospitalised due to acute COVID-19 if infected with SARS-CoV-2 These are results for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of being hospitalised from COVID-19 if you had {d['shot_ordinal']} shot {d['label']}",
                                risk=d["get_hospitalisation"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of being hospitalised from COVID-19 if you received drug treatment during the acute infection",
                                risk=cmp[0]["get_hospitalisation_drug"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of being hospitalised from COVID-19 if you had {infection_no_plus} previous SARS-CoV-2 infection/s",
                                risk=cmp[0]["get_hospitalisation_infection"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"If I get COVID-19, what is my chance of being admitted to ICU?",
                    subtitle=f"This is your chance of being admitted to ICU due to acute COVID-19 if infected with SARS-CoV-2. These are results for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of being admitted to ICU from COVID-19 if you had {d['shot_ordinal']} shot {d['label']}",
                                risk=d["get_icu"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of being admitted to ICU from COVID-19 if you received drug treatment during the acute infection",
                                risk=cmp[0]["get_icu_drug"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of being admitted to ICU from COVID-19 if you had {infection_no_plus} previous SARS-CoV-2 infection/s",
                                risk=cmp[0]["get_icu_infection"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                 corical_pb2.BarGraph(
                    title=f"If I get COVID-19, what is my chance of having at least 1 long COVID symptom six months later?",
                    subtitle=f"Symptoms may be continued, recurring or new and not attributable to any other diagnosis. These are results for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having at least 1 long COVID symptom 6 months after infection if you had {d['shot_ordinal']} shot {d['label']}",
                                risk=d["get_symptom"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having at least 1 long COVID symptom 6 months after infection if you received drug treatment during the acute infection",
                                risk=cmp[0]["get_symptom_drug"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having at least 1 long COVID symptom 6 months after infection if you had {infection_no_plus} previous SARS-CoV-2 infection/s",
                                risk=cmp[0]["get_symptom_infection"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"If I get COVID-19, what is my chance of having pulmonary long COVID symptoms six months later?",
                    subtitle=f"Symptoms may include cough, hypoxemia, and/or shortness of breath. These are results for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having pulmonary long COVID symptoms 6 months after infection if you had {d['shot_ordinal']} shot {d['label']}",
                                risk=d["get_pulmonary"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having pulmonary long COVID symptoms 6 months after infection if you received drug treatment during the acute infection",
                                risk=cmp[0]["get_pulmonary_drug"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having pulmonary long COVID symptoms 6 months after infection if you had {infection_no_plus} previous SARS-CoV-2 infection/s",
                                risk=cmp[0]["get_pulmonary_infection"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"If I get COVID-19, what is my chance of having cardiovascular long COVID symptoms six months later?",
                    subtitle=f"Symptoms may include acute coronary disease, arrhythmias, bradycardia, chest pain, heart failure, myocarditis, and/or tachycardia. These are results for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having cardiovascular long COVID symptoms 6 months after infection if you had {d['shot_ordinal']} shot {d['label']}",
                                risk=d["get_cardiovascular"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having cardiovascular long COVID symptoms 6 months after infection if you received drug treatment during the acute infection",
                                risk=cmp[0]["get_cardiovascular_drug"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having cardiovascular long COVID symptoms 6 months after infection if you had {infection_no_plus} previous SARS-CoV-2 infection/s",
                                risk=cmp[0]["get_cardiovascular_infection"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"If I get COVID-19, what is my chance of having neurological long COVID symptoms six months later?",
                    subtitle=f"Symptoms may include headache, memory problems, smell problems, and/or stroke. These are results for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having neurological long COVID symptoms 6 months after infection if you had {d['shot_ordinal']} shot {d['label']}",
                                risk=d["get_neurologic"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having neurological long COVID symptoms 6 months after infection if you received drug treatment during the acute infection",
                                risk=cmp[0]["get_neurologic_drug"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having neurological long COVID symptoms 6 months after infection if you had {infection_no_plus} previous SARS-CoV-2 infection/s",
                                risk=cmp[0]["get_neurologic_infection"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"If I get COVID-19, what is my chance of having metabolic long COVID symptoms six months later?",
                    subtitle=f"Symptoms may include diabetes, hyperlipidemia, and/or insulin use. These are results for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having metabolic long COVID symptoms 6 months after infection if you had {d['shot_ordinal']} shot {d['label']}",
                                risk=d["get_metabolic"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having metabolic long COVID symptoms 6 months after infection if you received drug treatment during the acute infection",
                                risk=cmp[0]["get_metabolic_drug"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having metabolic long COVID symptoms 6 months after infection if you had {infection_no_plus} previous SARS-CoV-2 infection/s",
                                risk=cmp[0]["get_metabolic_infection"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title=f"If I get COVID-19, what is my chance of having gastrointestinal COVID symptoms six months later?",
                    subtitle=f"Symptoms may include constipation, diarrhoea, and/or GERD. These are results for a {age_text} {sex_label} with {comor_no_label} pre-existing comorbidity/ies and {infection_no_label} previous SARS-CoV-2 infection/s, and {shots} COVID-19 shots.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having gastrointestinal long COVID symptoms 6 months after infection if you had {d['shot_ordinal']} shot {d['label']}",
                                risk=d["get_gastrointestinal"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having gastrointestinal long COVID symptoms 6 months after infection  if you received drug treatment during the acute infection",
                                risk=cmp[0]["get_gastrointestinal_drug"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of having gastrointestinal long COVID symptoms 6 months after infection if you had {infection_no_plus} previous SARS-CoV-2 infection/s",
                                risk=cmp[0]["get_gastrointestinal_infection"],
                                is_other_shot=True,
                            ),
                        ]
                    ),
                ),
            ],
            
            output_groups=[],
            success=True,
            msg=str(request),
            vaccine_type = "PZ",
        )
        duration = (perf_counter_ns() - start) / 1e6  # ms
        binlog = corical_pb2.BinLog(
            time=time,
            longcovid_req=request,
            res=out,
            duration_ms=duration,
        )

        binlog_out = b64encode(binlog.SerializeToString()).decode("utf8")

        logger.info(f"binlog: {binlog_out}")

        return out

corical_pb2_grpc.add_CoricalServicer_to_server(Corical(), server)
server.start()
signal.pause()
