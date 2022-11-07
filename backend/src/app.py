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
from proto import corical_pb2, corical_pb2_grpc
from risks import generate_relatable_risks
from tts import compute_probs, scenario_to_vec
from tts_util import get_age_bracket, get_age_bracket_pz, get_age_bracket_children, get_link, get_comparison_doses
from model import SmileModel

utc = pytz.UTC

logging.basicConfig(format="%(asctime)s: %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

server = grpc.server(futures.ThreadPoolExecutor(32))
server.add_insecure_port(f"[::]:21000")


PZ_children_model_file = "pfizer_children_02-09.xdsl"
combined_model_file = "combined_22-09-22.xdsl"

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
        if request.ct == "None_0":
            transmission_label = "no"
        elif request.ct == "Ten_percent":
            transmission_label = "a huge number of cases "
        elif request.ct == "Five_percent":
            transmission_label = "a large number of cases "
        elif request.ct == "Two_percent":
            transmission_label = "a lot of cases "
        elif request.ct == "One_percent":
            transmission_label = "a few cases"
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
            "get_myocarditis_vax": "n10_Myo_Vax",
            "get_myocarditis_bg": "n11_Myo_Background",
            "risk_of_infection": "n9_Risk_Infection",
        }

        infected_outcomes = {
            "get_myocarditis_given_infected": "n12_Myo_Covid",
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
                "n4_Transmission": request.ct
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

        scenario_description = f"Here are your results. These are for a {age_text} {sex_label} when there is {transmission_label} in your community. They are based on the number and timing of shots of vaccines the child has had."
        out = corical_pb2.ComputeRes(
            messages=messages,
            scenario_description=scenario_description,
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"What is my child's chance of getting COVID-19?",
                    subtitle=f"The COVID-19 vaccines aim to stop you from getting very sick. They can also protect you from getting COVID-19.",
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
                corical_pb2.BarGraph(
                    title=f"What is my child's chance of having inflammation of their heart muscle (myocarditis)?",
                    subtitle=f"The Pfizer vaccine can cause inflammation of the heart muscle. This is called myocarditis. Children can have this problem even if they haven't had the vaccine. Getting COVID-19 can also cause myocarditis in some people. ",
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
                                label=f"Chance of getting myocarditis over 2 weeks if the child has had 0 shots of the vaccine and no COVID-19",
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
                    subtitle=f"Most children do not get very sick from COVID-19, but some do need to go to hospital. Many of these children have other medical problems that raise their chance of getting very sick.",
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
                    subtitle=f"COVID-19 can cause severe health problems in some children. A small number of children can get inflammation of their organs. This can affect the heart, brain, kidneys, blood vessels, skin, digestive system or eyes. This is called Multisystem Inflammatory Syndrome in Children, and some children can die from it. ",
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



corical_pb2_grpc.add_CoricalServicer_to_server(Corical(), server)
server.start()
signal.pause()
