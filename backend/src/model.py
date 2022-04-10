"""
Calculate network probabilites using the SMILE API. 

This requires a smile license to be placed in the smile directory.
"""

import pysmile
import smile.pysmile_license

# make class
class SmileModel:
    """
    Provides interaction for the Bayesian network
    """
    def __init__(self, model_file, evidence):
        """        
        params:
            model_file - network xdsl file
            evidence - dictionary of model nodes and the values to be set 
        """
        self.net = pysmile.Network()
        self.net.read_file(model_file)

        self.set_evidence(evidence)
        
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
            self.net.set_evidence(node, evidence[node])
        self.net.update_beliefs()

    def get_binary_outcomes(self, nodes):
        """
        Return values for the first probability of the specified nodes as a
        dictionary of node names and probabilities.
        Generally used for binary valued nodes, where the first option is Yes.

        Params:
            nodes - list of node names 
        """
        outcomes = {}
        positive_outcomes = {}
        for node in nodes:
            beliefs = self.net.get_node_value(node)
            outcomes[node] = beliefs
            # Same as before, assuming yes is 1st option. Should probably check
            positive_outcomes[node] = beliefs[0]
        # self.outcomes = outcomes
        return positive_outcomes


# baseline_evidence = {}
evidence = {
    "n3_Sex": "Female",
    "n1_Pfizer_dose": "Two_2_4mths",
    "n2_Age_group": "Age_40_49",
    "n4_Community_transmission": "Five_percent"
}
network = SmileModel("Pf_March_GeNie_01-03-22.xdsl", evidence)

wanted_outcomes = [
    "n10_Risk_of_infection_under_current_transmission_and_vaccination_status",
    "n14_Die_from_COVID19",
    "n5_Vaccine_associated_myocarditis",
    "n12_Die_from_Pfizer_myocarditis",
    "n6_Myocarditis_background",
    "n13_Die_from_background_myocarditis"
]
print(network.get_outcomes(wanted_outcomes))

