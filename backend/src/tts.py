import xdsl

tts = xdsl.Model("V2 TTS 6 months 10Sep.xdsl")


def scenario_to_vec(scenario_name):
    return tts.unit_vec_for_state("Community_transmission", scenario_name)


def compute_probs(az_vec, age_vec, sex_vec, variant_vec, ct_vec):
    values = {
        "AZ": az_vec,
        "Age": age_vec,
        "Sex": sex_vec,
        "Variant": variant_vec,
        "Community_transmission": ct_vec,
    }
    values_infected = dict(values)

    get_tts = tts.infer(values, "TTS_AZ")[0]
    die_from_tts = tts.infer(values, "Die_from_TTS_AZ")[0]
    die_from_csvt = tts.infer(values, "Die_from_CSVT")[0]
    die_from_pvt = tts.infer(values, "Die_from_PVT")[0]
    symptomatic_infection = tts.infer(values, "Infection_at_current_transmission")[0]
    die_from_covid = tts.infer(values, "Die_from_Covid")[0]

    # copy values and set infection to Yes
    tts.set_fact(values_infected, "Infection_at_current_transmission", "Yes")
    die_from_covid_given_infected = tts.infer(values_infected, "Die_from_Covid")[0]
    get_csvt_covid_given_infected = tts.infer(values_infected, "CSVT_Covid")[0]
    get_pvt_covid_given_infected = tts.infer(values_infected, "PVT_Covid")[0]
    die_from_csvt_covid_given_infected = tts.infer(values_infected, "Die_from_CSVT_Covid")[0]
    die_from_pvt_covid_given_infected = tts.infer(values_infected, "Die_from_PVT_Covid")[0]

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
