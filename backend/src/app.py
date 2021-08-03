import logging
import signal
from concurrent import futures

import grpc

from proto import corical_pb2_grpc, corical_pb2

logging.basicConfig(format="%(asctime)s: %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

server = grpc.server(futures.ThreadPoolExecutor(8))
server.add_insecure_port(f"[::]:21000")

class Corical(corical_pb2_grpc.CoricalServicer):
    def Compute(self, request, context):
        logger.info(request)
        return corical_pb2.ComputeRes(success=True)

corical_pb2_grpc.add_CoricalServicer_to_server(Corical(), server)
server.start()
signal.pause()
