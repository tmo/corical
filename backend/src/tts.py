import xdsl

tts = xdsl.Model("AZ_March_GeNie_01-03-22.xdsl")

def scenario_to_vec(scenario_name):
    return tts.unit_vec_for_state("n4_Transmission", scenario_name)


def compute_probs(az_dose, age_label, sex_vec, ct_vec, variant_vec=None):
    values = {
        "n5_Sex": sex_vec,
        "n4_Transmission": ct_vec,
    }

    tts.set_fact(values, "n2_Age", age_label)
    tts.set_fact(values, "n1_Dose", az_dose)

    values_infected = dict(values)

    get_tts = tts.infer(values, "n6_TTS")[0]
    die_from_tts = tts.infer(values, "n18_Die_from_TTS_AZ")[0]
    die_from_csvt = tts.infer(values, "n20_Die_from_CSVT")[0]
    die_from_pvt = tts.infer(values, "n21_Die_from_PVT")[0]
    symptomatic_infection = tts.infer(values, "n14_Infection_at_current_transmission")[0]
    n23_Die_from_Covid = tts.infer(values, "n23_Die_from_Covid")[0]

    # copy values and set infection to Yes
    tts.set_fact(values_infected, "n14_Infection_at_current_transmission", "Yes")
    n23_Die_from_Covid_given_infected = tts.infer(values_infected, "n23_Die_from_Covid")[0]
    get_csvt_covid_given_infected = tts.infer(values_infected, "n15_CSVT_Covid")[0]
    get_pvt_covid_given_infected = tts.infer(values_infected, "n16_PVT_Covid")[0]
    die_from_csvt_covid_given_infected = tts.infer(values_infected, "n24_Die_from_CSVT_Covid")[0]
    die_from_pvt_covid_given_infected = tts.infer(values_infected, "n25_Die_from_PVT_Covid")[0]

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

    get_myocarditis_vax = tts.infer(values, "n7_VacMyo")[0]
    die_myocarditis_vax = tts.infer(values, "n19_Die_from_vaccine_associatedmyocarditis")[0]
    get_myocarditis_given_covid = tts.infer(values_infected, "n17_COV_Myo")[0]
    die_myocarditis_given_covid = tts.infer(values_infected, "n26_Die_from_COV_Myo")[0]
    get_myocarditis_bg = tts.infer(values, "n10_BackMyo")[0]
    die_myocarditis_bg = tts.infer(values, "n22_Die_from_myocarditis__background")[0]

    return (
        symptomatic_infection,
        get_tts,
        n23_Die_from_Covid_given_infected,
        die_from_tts,
        die_from_clots,
        n23_Die_from_Covid,
        get_clots_covid_given_infected,
        die_from_clots_covid_given_infected,
        get_myocarditis_vax,
        die_myocarditis_vax,
        get_myocarditis_given_covid,
        die_myocarditis_given_covid,
        get_myocarditis_bg,
        die_myocarditis_bg,
    )
