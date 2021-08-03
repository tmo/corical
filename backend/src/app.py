from concurrent import futures
import logging
import signal

import grpc

from proto import corical_pb2, corical_pb2_grpc

logging.basicConfig(format="%(asctime)s: %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

server = grpc.server(futures.ThreadPoolExecutor(8))
server.add_insecure_port(f"[::]:21000")


class Corical(corical_pb2_grpc.CoricalServicer):
    def Compute(self, request, context):
        logger.info(request)

        if request.sex == corical_pb2.SEX_FEMALE:
            sex_label = "female"
        elif request.sex == corical_pb2.SEX_MALE:
            sex_label = "male"
        else:
            context.abort(grpc.StatusCode.FAILED_PRECONDITION, "Invalid sex")

        if not request.dose1:  # TODO or request.dose1weeks < 2:
            assert request.vaccine == corical_pb2.VACCINE_UNSPECIFIED
            assert not request.dose2
            vaccine_label = "not been vaccinated against COVID-19"
        elif request.dose1:
            if request.vaccine == corical_pb2.VACCINE_PFIZER:
                vaccine_name = "Pfizer"
            if request.vaccine == corical_pb2.VACCINE_ASTRAZENECA:
                vaccine_name = "AstraZeneca"
            if not request.dose2:
                vaccine_label = f"had one immune effective dose of the {vaccine_name} vaccine"
            else:
                vaccine_label = f"had two immune effective doses of the {vaccine_name} vaccine"

        explanation = f"For a {request.age}-year-old {sex_label} who has {vaccine_label}, the risks of the following events are shown."

        return corical_pb2.ComputeRes(
            messages=[
                corical_pb2.Message(
                    heading="Test message",
                    text="This is a test message",
                    type=corical_pb2.MESSAGE_TYPE_INFO,
                )
            ],
            output_groups=[
                corical_pb2.OutputGroup(
                    heading="COVID-19 and outcomes of COVID-19",
                    explanation=explanation,
                    risks=[
                        corical_pb2.Risk(name="Risk of getting COVID-19 AND dying from COVID-19", risk=0.01),
                        corical_pb2.Risk(name="Risk of getting COVID-19 AND needing ICU due to COVID-19", risk=0.02),
                        corical_pb2.Risk(
                            name="Risk of getting COVID-19 AND developing long COVID",
                            risk=0.03,
                            comment="Long covid is defined as ...",
                        ),
                        corical_pb2.Risk(name="Risk of dying IF get COVID-19", risk=0.04),
                        corical_pb2.Risk(name="Risk of needing ICU IF get COVID-19", risk=0.05),
                        corical_pb2.Risk(name="Risk of long COVID IF get COVID-19", risk=0.06),
                    ],
                ),
                corical_pb2.OutputGroup(
                    heading="Major adverse effects of vaccines",
                    explanation=explanation,
                    risks=[
                        corical_pb2.Risk(name="Risk of getting anaphylaxis", risk=0.07),
                        corical_pb2.Risk(name="Risk of getting TTS", risk=0.08, comment="TTS is..."),
                        corical_pb2.Risk(
                            name="Risk of getting VAM",
                            risk=0.09,
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
