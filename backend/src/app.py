import logging
import signal
from concurrent import futures

import grpc
import numpy as np

from model import compute_probs, get_age_bracket, scenario_to_vec
from proto import corical_pb2, corical_pb2_grpc
from risks import generate_relatable_risks

logging.basicConfig(format="%(asctime)s: %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

server = grpc.server(futures.ThreadPoolExecutor(8))
server.add_insecure_port(f"[::]:21000")


class Corical(corical_pb2_grpc.CoricalServicer):
    def Compute(self, request, context):
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
        if request.vaccine == "az0":
            vaccine_label = f"had no immune effective doses of the AstraZeneca vaccine"
            az_vec = np.array([1.0, 0.0, 0.0])
        elif request.vaccine == "az1":
            vaccine_label = f"had one immune effective dose of the AstraZeneca vaccine"
            az_vec = np.array([0.0, 1.0, 0.0])
        elif request.vaccine == "az2":
            vaccine_label = f"had two immune effective doses of the AstraZeneca vaccine"
            az_vec = np.array([0.0, 0.0, 1.0])
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid vaccine")

        # age
        age_label, age_vec = get_age_bracket(request.age)

        # community transmission
        ct_vec = scenario_to_vec(request.transmission)
        if request.transmission == "None_0":
            transmission_label = "no"
        elif request.transmission == "ATAGI_High_3_544_percent":
            transmission_label = "high"
        elif request.transmission == "ATAGI_Med_0_275_percent":
            transmission_label = "medium"
        elif request.transmission == "ATAGI_Low_0_029_percent":
            transmission_label = "low"
        else:
            transmission_label = request.transmission

        if request.transmission == "None_0":
            messages.append(
                corical_pb2.Message(
                    heading="Note",
                    text="You have selected a scenario with no community transmission. This is only a temporary situation and will change when state or national borders open.",
                    severity="warning",
                )
            )

        # variant
        # hardcoded as 90% Delta
        variant_vec = np.array([0.1, 0.9])

        explanation = f"For a {age_label} {sex_label} who has {vaccine_label}, and under {transmission_label} community transmission, the risks of the following events are shown."

        logger.info(f"{az_vec=}")
        logger.info(f"{age_vec=}")
        logger.info(f"{sex_vec=}")
        logger.info(f"{variant_vec=}")
        logger.info(f"{ct_vec=}")
        (
            symptomatic_infection,
            get_tts,
            die_from_covid_given_infected,
            die_from_tts,
            die_from_clots,
            die_from_covid,
            get_clots_covid,
            die_from_clots_covid,
        ) = compute_probs(az_vec, age_vec, sex_vec, variant_vec, ct_vec)
        logger.info(f"{symptomatic_infection=}, {1-symptomatic_infection=}")

        def generate_bar_graph_risks(input_risks):
            return input_risks + [
                corical_pb2.BarGraphRisk(
                    label=r["event"],
                    risk=r["risk"],
                    is_relatable=True,
                )
                for r in generate_relatable_risks([risk.risk for risk in input_risks])
            ]

        return corical_pb2.ComputeRes(
            messages=messages,
            scenario_description="This is the scenario description",
            bar_graphs=[
                corical_pb2.BarGraph(
                    title=f"What is my chance of getting COVID-19 if there are {transmission_label} transmissions in the community?",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="Chance of getting COVID-19",
                                risk=symptomatic_infection,
                            )
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of dying if I get COVID-19?",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="Chance of death",
                                risk=die_from_covid_given_infected,
                            )
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of getting an atypical blood clot?",
                    subtitle="An atypical blood clot is...",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="Due to COVID-19",
                                risk=get_clots_covid,
                            ),
                            corical_pb2.BarGraphRisk(
                                label="Due to the AstraZeneca vaccine",
                                risk=get_tts,
                            ),
                        ]
                    ),
                ),
                corical_pb2.BarGraph(
                    title="What is my chance of dying from an atypical blood clot?",
                    subtitle="An atypical blood clot is...",
                    risks=generate_bar_graph_risks(
                        [
                            corical_pb2.BarGraphRisk(
                                label="Due to COVID-19",
                                risk=die_from_clots_covid,
                            ),
                            corical_pb2.BarGraphRisk(
                                label="Due to the AstraZeneca vaccine",
                                risk=die_from_tts,
                            ),
                        ]
                    ),
                ),
            ],
            output_groups=[
                corical_pb2.OutputGroup(
                    heading="COVID-19 and outcomes of COVID-19",
                    explanation=explanation,
                    risks=[
                        corical_pb2.Risk(
                            name="Risk of getting symptomatic COVID-19 under current transmission and vaccination status",
                            risk=symptomatic_infection,
                            comment="",
                        ),
                        corical_pb2.Risk(
                            name="Risk of dying from COVID-19",
                            risk=die_from_covid,
                            comment="",
                        ),
                        corical_pb2.Risk(
                            name="Risk of dying from COVID-19 related blood clot",
                            risk=die_from_clots_covid,
                            comment="",
                        ),
                    ],
                ),
                corical_pb2.OutputGroup(
                    heading="Major adverse effects of vaccines",
                    explanation=explanation,
                    risks=[
                        corical_pb2.Risk(
                            name="Risk of dying from TTS from AZ",
                            risk=die_from_tts,
                            comment="",
                        ),
                    ],
                ),
                corical_pb2.OutputGroup(
                    heading="Other related things",
                    explanation=explanation,
                    risks=[
                        corical_pb2.Risk(
                            name="Risk of dying from blood clot",
                            risk=die_from_clots,
                            comment="",
                        ),
                    ],
                ),
            ],
            success=True,
            msg=str(request),
        )


corical_pb2_grpc.add_CoricalServicer_to_server(Corical(), server)
server.start()
signal.pause()
