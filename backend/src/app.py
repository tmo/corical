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
from tts_util import get_age_bracket, get_age_bracket_pz, get_link

utc = pytz.UTC

logging.basicConfig(format="%(asctime)s: %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

server = grpc.server(futures.ThreadPoolExecutor(32))
server.add_insecure_port(f"[::]:21000")


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


class Corical(corical_pb2_grpc.CoricalServicer):
    def ComputeTTS(self, request, context):
        start = perf_counter_ns()
        time = Timestamp_from_datetime(now())

        logger.info(request)

        messages = []

        # messages.append(
        #     corical_pb2.Message(
        #         heading="Model Version",
        #         text="Last updated on 31/01/2022. Estimates based on an assumed distribution of 10% Delta and 90% Omicron.",
        #         severity="info",
        #     )
        # )

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
            "None": ("not vaccinated", "no"),
            "OneAZ_under_3_weeks": ("received one dose (1-3 months ago)", "first dose of the AstraZeneca vaccine"),
            "TwoAZ_under_2_months": ("received two doses (2 months ago)", "second dose of the AstraZeneca vaccine."),
            "TwoAZ_2to4_months": ("received two doses (2-4 months post-vaccination)", "second dose of the AstraZeneca vaccine."),
            "TwoAZ_4to6_months": ("received two doses (4-6 months post-vaccination)", "second dose of the AstraZeneca vaccine."),
            "TwoAZ_OnePfz_under_2_months": ("received two doses of AstraZeneca and one dose of Pfizer (2 months ago)", "Pfizer booster vaccine."),
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
            transmission_label = "extremely high"
        elif request.transmission == "Five_percent":
            transmission_label = "very high"
        elif request.transmission == "ATAGI_High":
            transmission_label = "high"
        elif request.transmission == "ATAGI_Med":
            transmission_label = "medium"
        elif request.transmission == "ATAGI_Low":
            transmission_label = "low"
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
        # hardcoded as 100% omicron
        variant_vec = np.array([0.0, 1.0, 0.0])

        # for tables
        if request.vaccine == "None":
            explanation = f"Results shown for a {age_label} {sex_label} who has not been vaccinated, and under {transmission_label} community transmission, the risks of the following events are shown."
        else:
            explanation = f"Results shown for a {age_label} {sex_label} who has  {vaccine_labels[request.vaccine][0]}, and under {transmission_label} community transmission, the risks of the following events are shown."

        blood_clot_brief = (
            "An atypical blood clot refers to a blood clot like thrombosis with thrombocytopenia syndrome (TTS)."
        )
        # for graphs
        subtitle = f"Results shown for a {age_label} {sex_label} under a {transmission_label} transmission scenario."
        # Pfizer booster subtitle
        pz_booster_subtitle = f"Results shown for a {age_label} {sex_label} under a {transmission_label} transmission scenario, having received two doses of AstraZeneca and one dose of Pfizer."

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
            ) = compute_probs(cdose, age_value, sex_vec, variant_vec, ct_vec)
            cmp.append(cur)
            if cdose == request.vaccine:
                logging.info("Saving current case")
                current_case = cur



        bar_graphs_list = [
            corical_pb2.BarGraph(
                title=f"What is my chance of getting COVID-19 if there is {transmission_label} transmission in the community?",
                subtitle=subtitle + " Chance of getting COVID-19 is over a period of 2 months.",
                risks=generate_bar_graph_risks(
                    [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of getting COVID-19 if {d['label']}",
                            risk=d["symptomatic_infection"],
                            is_other_shot=d["is_other_shot"],
                        )
                        for d in cmp
                    ]
                ),
            ),
            corical_pb2.BarGraph(
                title="If I am diagnosed with COVID-19, what are my chances of dying?",
                subtitle=subtitle,
                risks=generate_bar_graph_risks(
                    [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of dying from COVID-19 if {d['label']}",
                            risk=d["die_from_covid_given_infected"],
                            is_other_shot=d["is_other_shot"],
                        )
                        for d in cmp
                    ]
                ),
            ),
            corical_pb2.BarGraph(
                title="What is my chance of getting an atypical blood clot from the AstraZeneca doses?",
                subtitle=subtitle + " " + blood_clot_brief,
                risks=generate_bar_graph_risks(
                    [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of developing atypical blood clot if I get COVID-19",
                            risk=cmp[0]["get_clots_covid_given_infected"],
                            is_other_shot=True,
                        ),
                    ]
                    + [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of developing atypical blood clot due to the {d['shot_ordinal']}",
                            risk=d["get_tts"],
                            is_other_shot=d["is_other_shot"],
                        )
                        for d in cmp
                        if (d["get_tts"] > 0.0 or d['label'] == cmp[0]['label']) and d['shot_ordinal'] != "no"
                    ]
                ),
            ),
            corical_pb2.BarGraph(
                    title="What is my chance of dying from an atypical blood clot from the AstraZeneca doses?",
                    subtitle=subtitle + " " + blood_clot_brief,
                    risks=generate_bar_graph_risks(
                        [
                        corical_pb2.BarGraphRisk(
                            label=f"Chance of dying from atypical blood clot if I get COVID-19",
                            risk=cmp[0]["die_from_clots_covid_given_infected"],
                            is_other_shot=True,
                        ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from atypical blood clot due to the {d['shot_ordinal']}",
                                risk=d["die_from_tts"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                            if (d["die_from_tts"] > 0.0 or d['label'] == cmp[0]['label']) and d['shot_ordinal'] != "no"
                        ]
                    ),
                ),
            ]
        if request.vaccine == "TwoAZ_OnePfz_under_2_months":
            bar_graphs_list.append(
                corical_pb2.BarGraph(
                    title="What is my chance of getting myocarditis after receiving Pfizer booster?",
                    subtitle=pz_booster_subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            # corical_pb2.BarGraphRisk(
                            #     label=f"Chance of getting myocarditis if I am diagnosed with COVID-19",
                            #     risk=cmp[0]["get_myocarditis_given_covid"],
                            # ),
                            corical_pb2.BarGraphRisk(
                                label=f"Background chance of myocarditis over a period of 2 months",
                                risk=cmp[0]["get_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting virus-associated myocarditis if I get COVID-19",
                                risk=cmp[0]["get_myocarditis_given_covid"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting vaccine-associated myocarditis from the Pfizer booster dose",
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
                    title="What is my chance of dying from myocarditis after receiving Pfizer booster?",
                    subtitle=pz_booster_subtitle,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Background chance of dying from myocarditis over a period of 2 months",
                                risk=cmp[0]["die_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from virus-associated myocarditis if I get COVID-19",
                                risk=cmp[0]["die_myocarditis_given_covid"],
                                is_other_shot=True,
                            ),
                        ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from vaccine-associated myocarditis from the Pfizer booster dose",
                                risk=d["die_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                            if d["die_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label']
                        ]
                    ),
                ),
            )
        
        out = corical_pb2.ComputeRes(
            messages=messages,
            scenario_description="This is the scenario description",
            printable=printable,
            bar_graphs= bar_graphs_list,
            output_groups=[
                corical_pb2.OutputGroup(
                    heading="COVID-19 and outcomes of COVID-19",
                    explanation=explanation,
                    risks=[
                        corical_pb2.Risk(
                            name="Risk of getting symptomatic COVID-19 under current transmission and vaccination status",
                            risk=current_case["symptomatic_infection"],
                            comment="",
                        ),
                        corical_pb2.Risk(
                            name="Risk of dying from COVID-19",
                            risk=current_case["die_from_covid"],
                            comment="",
                        ),
                        corical_pb2.Risk(
                            name="Risk of dying from COVID-19 if you get infected",
                            risk=current_case["die_from_covid_given_infected"],
                            comment="",
                        ),
                    ],
                ),
                corical_pb2.OutputGroup(
                    heading="Death from atypical blood clots",
                    explanation=blood_clot_brief + " " + explanation,
                    risks=(
                        [
                            corical_pb2.Risk(
                                name="Risk of dying from thrombosis with thrombocytopenia syndrome (TTS) from the AstraZeneca vaccine",
                                risk=current_case["die_from_tts"],
                                comment="",
                            )
                        ]
                        if current_case["die_from_tts"] > 0.0
                        else []
                    )
                    + [
                        corical_pb2.Risk(
                            name="Risk of dying from COVID-19 related blood clot if you are infected",
                            risk=current_case["die_from_clots_covid_given_infected"],
                            comment="",
                        ),
                        corical_pb2.Risk(
                            name="Background risk of dying from an atypical blood clot",
                            risk=current_case["die_from_clots"],
                            comment="",
                        ),
                    ],
                ),
            ],
            success=True,
            msg=str(request),
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

        age_text, age_label, age_ix = get_age_bracket_pz(request.age)
        if request.ct == "None_0":
            transmission_label = "no"
        elif request.ct == "Ten_percent":
            transmission_label = "extremely high"
        elif request.ct == "Five_percent":
            transmission_label = "very high"
        elif request.ct == "ATAGI_High":
            transmission_label = "high"
        elif request.ct == "ATAGI_Med":
            transmission_label = "medium"
        elif request.ct == "ATAGI_Low":
            transmission_label = "low"
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

        # for graphs
        graph_description = f"Results shown for a {age_text} {sex_label} under a {transmission_label} transmission scenario, based on number of doses of Pfizer vaccine received."

        dose_labels = {
            "None": ("not vaccinated", "no"),
            "One_at_3wks": ("received one dose (3 weeks ago)", "first"),
            "Two_under_2mths": ("received two doses (2 months ago)", "second"),
            "Two_2_4mths": ("received two doses (2-4 months post-vaccination)", "second"),
            "Two_4_6mths": ("received two doses (4-6 months post-vaccination)", "second"),
            "Three": ("received three doses", "third"),
        }

        if request.dose == "None":
            comparison_doses = ["One_at_3wks", "Two_under_2mths"]
        elif request.dose == "One_at_3wks":
            comparison_doses = ["None", "Two_under_2mths"]
        elif request.dose == "Two_under_2mths":
            comparison_doses = ["One_at_3wks", "Three"]
        elif request.dose == "Two_2_4mths":
            comparison_doses = ["One_at_3wks", "Three"]
        elif request.dose == "Two_4_6mths":
            comparison_doses = ["One_at_3wks", "Three"]
        elif request.dose == "Three":
            comparison_doses = ["One_at_3wks", "Two_under_2mths", "None"]

        # variant
        # hardcoded as 100% omicron
        variant_vec = np.array([0.0, 1.0, 0.0])
        # (
        #     get_covid,
        #     get_myocarditis_vax,
        #     die_myocarditis_vax,
        #     get_myocarditis_given_covid,
        #     die_myocarditis_given_covid,
        #     get_myocarditis_bg,
        #     die_myocarditis_bg,
        #     die_covid_if_got_it,
        # ) = compute_pfizer_probs(request.dose, age_label, request.ct, sex_vec)

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
            ) = compute_pfizer_probs(cdose, age_label, request.ct, sex_vec, variant_vec)
            cmp.append(cur)

        out = corical_pb2.ComputeRes(
            messages=messages,
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"What is my chance of getting COVID-19 if there is {transmission_label} transmission in the community?",
                    subtitle=graph_description + " Chance of getting COVID-19 is over a period of 2 months.",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting COVID-19 if {d['label']}",
                                risk=d["get_covid"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="If I am diagnosed with COVID-19, what are my chances of dying?",
                    subtitle=graph_description,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from COVID-19 if {d['label']}",
                                risk=d["die_covid_if_got_it"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of getting myocarditis?",
                    subtitle=graph_description,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Background chance of myocarditis over a period of 2 months",
                                risk=cmp[0]["get_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        # + [
                        #     corical_pb2.BarGraphRisk(
                        #         label=f"Chance of getting virus-associated myocarditis if I get COVID-19",
                        #         risk=cmp[0]["get_myocarditis_given_covid"],
                        #         is_other_shot=True,
                        #     ),
                        # ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of getting vaccine-associated myocarditis from the {d['shot_ordinal']} dose",
                                risk=d["get_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                            if d["get_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label'] and d['shot_ordinal'] != "no"
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of dying from myocarditis?",
                    subtitle=graph_description,
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label=f"Background chance of dying from myocarditis over a period of 2 months",
                                risk=cmp[0]["die_myocarditis_bg"],
                                is_other_shot=True,
                            ),
                        ]
                        # + [
                        #     corical_pb2.BarGraphRisk(
                        #         label=f"Chance of dying from virus-associated myocarditis if I get COVID-19",
                        #         risk=cmp[0]["die_myocarditis_given_covid"],
                        #         is_other_shot=True,
                        #     ),
                        # ]
                        + [
                            corical_pb2.BarGraphRisk(
                                label=f"Chance of dying from vaccine-associated myocarditis from the {d['shot_ordinal']} dose",
                                risk=d["die_myocarditis_vax"],
                                is_other_shot=d["is_other_shot"],
                            )
                            for d in cmp
                            if d["die_myocarditis_vax"] > 0.0 or d['label'] == cmp[0]['label'] and d['shot_ordinal'] != "no"
                        ]
                    ),
                ),
            ],
            output_groups=[
                # corical_pb2.OutputGroup(
                #     heading="Raw outputs",
                #     explanation=explanation,
                #     risks=[
                #         corical_pb2.Risk(
                #             name="n18_Die_from_Pfizer_myocarditis",
                #             risk=n18_Die_from_Pfizer_myocarditis,
                #         ),
                #         corical_pb2.Risk(
                #             name="n19_Die_from_background_myocarditis",
                #             risk=n19_Die_from_background_myocarditis,
                #         ),
                #         corical_pb2.Risk(
                #             name="n20_Die_from_COVID19",
                #             risk=n20_Die_from_COVID19,
                #         ),
                #         corical_pb2.Risk(
                #             name="n21_Die_from_COVID19_myocarditis",
                #             risk=n21_Die_from_COVID19_myocarditis,
                #         ),
                #     ],
                # ),
            ],
            success=True,
            msg=str(request),
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


corical_pb2_grpc.add_CoricalServicer_to_server(Corical(), server)
server.start()
signal.pause()
