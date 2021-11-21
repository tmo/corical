from pathlib import Path

import numpy as np
from lxml import etree


def load_model_facts(tree):
    output = {}
    for cpt in tree.xpath("/smile/nodes/cpt"):
        id_ = cpt.attrib["id"]
        states = [i.attrib["id"] for i in cpt.xpath("state")]
        parents_els = cpt.xpath("parents")
        if parents_els:
            parents = parents_els[0].text.split()
        else:
            parents = []
        probabilities = list(map(float, cpt.xpath("probabilities")[0].text.split()))
        output[id_] = {
            "states": states,
            "parents": parents,
            "probabilities": probabilities,
        }
    return output


def generate_prob_mx_for_node(nodes, node_name):
    node = nodes[node_name]

    # get parent number of states
    parent_dims = [len(nodes[parent_name]["states"]) for parent_name in node["parents"]]
    dims = parent_dims + [len(node["states"])]

    return np.array(node["probabilities"]).reshape(*dims)


def generate_prob_mx(nodes):
    # go through nodes, and create correctly shaped numpy tensors for the CPT
    output = {}
    for node_name in nodes.keys():
        output[node_name] = generate_prob_mx_for_node(nodes, node_name)
    return output


def unit_vec_for_state(states, state):
    out = np.zeros(len(states))
    out[states.index(state)] = 1.0
    return out


class Model:
    def __init__(self, filename):
        with (Path(__file__).parent / filename).open() as f:
            self.tree = etree.parse(f)
        self.nodes = load_model_facts(self.tree)
        self.probability_matrix = generate_prob_mx(self.nodes)

    def set_fact(self, values, node, state):
        values[node] = unit_vec_for_state(self.nodes[node]["states"], state)

    def set_fact_dist(self, values, node, state_to_prob):
        states = self.nodes[node]["states"]
        state_dist = np.zeros(len(states))
        for state, prob in state_to_prob.items():
            state_dist += prob * unit_vec_for_state(states, state)
        assert np.sum(state_dist) == 1.0
        values[node] = state_dist

    def infer(self, values, node):
        """
        Infer probability distribution of the node
        """
        if node in values:
            return values[node]
        parent_names = self.nodes[node]["parents"]
        if not parent_names:
            raise ValueError(f"Node {node} has no parents and haven't set_fact")
        cur = self.probability_matrix[node]
        # we multiply them right to left
        for parent in reversed(parent_names):
            parent_vec = self.infer(values, parent)
            cur = parent_vec @ cur
        return cur
