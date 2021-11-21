import numpy as np
from lxml import etree

## model loading helpers


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


## load the actual model

with open("V2 TTS 6 months 10Sep.xdsl") as f:
    tree = etree.parse(f)

nodes = load_model_facts(tree)
probability_matrix = generate_prob_mx(nodes)

## actual computation


def compute_probs(az_vec, age_vec, sex_vec, variant_vec, ct_vec):
    # Die from TTS

    tts_vec = az_vec @ (age_vec @ probability_matrix["TTS_AZ"])
    die_from_tts_vec = tts_vec @ probability_matrix["Die_from_TTS_AZ"]

    # Die from CSVT

    csvt_vec = age_vec @ probability_matrix["CSVT"]
    die_from_csvt_vec = csvt_vec @ probability_matrix["Die_from_CSVT"]

    # Die from PVT

    pvt_vec = age_vec @ probability_matrix["PVT"]
    die_from_pvt_vec = pvt_vec @ probability_matrix["Die_from_PVT"]

    # vacc_eff: Vaccine effectiveness against death if infected

    # Vac_effectiveness_Death
    vacc_eff_vec = variant_vec @ (az_vec @ probability_matrix["Vac_effectiveness_Death"])

    # inf_risk: Risk of symptomatic infection under current transmission and vaccination status

    # Infection_at_10percent
    inf10p_vec = variant_vec @ (age_vec @ probability_matrix["Infection_at_10percent"])

    # Vac_effectiveness_infection
    eff_inf_vec = variant_vec @ (az_vec @ probability_matrix["Vac_effectiveness_infection"])

    # Infection_at_current_transmission
    inf_risk_vec = inf10p_vec @ (eff_inf_vec @ (ct_vec @ probability_matrix["Infection_at_current_transmission"]))

    # Die from COVID

    covid_vec = inf_risk_vec @ (vacc_eff_vec @ (sex_vec @ (age_vec @ probability_matrix["Die_from_Covid"])))

    # Die from COVID conditional on getting it
    full_inf_risk_vec = np.array([1.0, 0.0])
    covid_given_inf_vec = full_inf_risk_vec @ (
        vacc_eff_vec @ (sex_vec @ (age_vec @ probability_matrix["Die_from_Covid"]))
    )
    # Die from Covid related CSVT conditional on getting it

    csvt_covid_vec_given_infected = full_inf_risk_vec @ (sex_vec @ probability_matrix["CSVT_Covid"])
    die_csvt_covid_vec_given_infected = csvt_covid_vec_given_infected @ probability_matrix["Die_from_CSVT_Covid"]
    # Die from Covid related PVT conditional on getting it
    # Die_from_PVT_Covid_given_infected
    pvt_covid_vec_given_infected = full_inf_risk_vec @ (sex_vec @ probability_matrix["PVT_Covid"])
    die_pvt_covid_vec_given_infected = pvt_covid_vec_given_infected @ probability_matrix["Die_from_PVT_Covid"]

    symptomatic_infection = inf_risk_vec[0]

    get_tts = tts_vec[0]
    die_from_tts = die_from_tts_vec[0]
    die_from_csvt = die_from_csvt_vec[0]
    die_from_pvt = die_from_pvt_vec[0]
    die_from_covid = covid_vec[0]
    get_csvt_covid_given_infected = csvt_covid_vec_given_infected[0]
    get_pvt_covid_given_infected = pvt_covid_vec_given_infected[0]
    die_from_csvt_covid_given_infected = die_csvt_covid_vec_given_infected[0]
    die_from_pvt_covid_given_infected = die_pvt_covid_vec_given_infected[0]

    die_from_covid_given_infected = covid_given_inf_vec[0]

    # after discussion on sep 12, assume csvt & pvt are indep and combine into one
    die_from_clots = die_from_csvt + die_from_pvt - die_from_csvt * die_from_pvt
    die_from_clots_covid_given_infected = (
        die_from_csvt_covid_given_infected
        + die_from_pvt_covid_given_infected
        - die_from_csvt_covid_given_infected * die_from_pvt_covid_given_infected
    )
    get_clots_covid_given_infected = (
        get_csvt_covid_given_infected
        + get_pvt_covid_given_infected
        - get_csvt_covid_given_infected * get_pvt_covid_given_infected
    )

    return (
        symptomatic_infection,
        get_tts,
        die_from_covid_given_infected,
        die_from_tts,
        die_from_clots,
        die_from_covid,
        get_clots_covid_given_infected,
        die_from_clots_covid_given_infected,
    )
