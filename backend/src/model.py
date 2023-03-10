"""
Calculate network probabilites using the SMILE API. 

This requires a smile license to be placed in the smile directory.
"""
from pathlib import Path
import numpy as np
import logging

import pysmile
import smile.pysmile_license

logging.basicConfig(format="%(asctime)s: %(name)s: %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

# make class
class SmileModel:
    """
    Provides interaction for the Bayesian network
    """
    def __init__(self, model_file):
        """        
        params:
            model_file - network xdsl file
        """
        self.net = pysmile.Network()
        file_path = str(Path(__file__).parent / model_file)
        self.net.read_file(file_path)

        
    def get_network(self):
        """
        Return pysmile.Network object
        """
        return self.net

    def set_evidence(self, evidence):
        """
        Params:
            evidence - dictionary of model nodes and the values to be set 
        """
        for node in evidence:
            try:
                if isinstance(evidence[node], (list, np.ndarray)):
                    self.net.set_virtual_evidence(node, list(evidence[node]))
                else:
                    self.net.set_evidence(node, evidence[node])
            except pysmile.SMILEException as e:
                logger.error("Error in setting evidence {} to node {}".format(
                            evidence[node], node
                ))
                logger.error(e)
        self.net.update_beliefs()

    def get_binary_outcomes(self, nodes):
        """
        Return values for the first probability of the specified nodes as a
        dictionary of node names and probabilities.
        Generally used for binary valued nodes, where the first option is Yes.

        Params:
            nodes - list of node names 
        """
        # outcomes = {}
        positive_outcomes = {}
        for node_title in nodes:
            beliefs = self.net.get_node_value(nodes[node_title])
            # outcomes[node_title] = beliefs
            # Same as before, assuming yes is 1st option. Should probably check
            positive_outcomes[node_title] = beliefs[0]
        # self.outcomes = outcomes
        return positive_outcomes


