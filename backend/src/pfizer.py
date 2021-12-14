import xdsl

pfizer = xdsl.Model("CoRiCAL_2.0_V1_09122021_JS.xdsl")

# n1_Pfizer_dose
# n2_Age_group
# n3_Sex
# n4_Community_transmission
# n5_Vaccine_associated_myocarditis
# n6_Myocarditis_background
# n7_Vaccine_effectiveness_against_infection
# n8_Vaccine_effectiveness_against_death
# n9_Risk_of_infection_by_aget_and_sex
# n10_Risk_of_infection_under_current_transmission_and_vaccination_status
# n11_Myocarditis_from_COVID19
# n12_Die_from_Pfizer_myocarditis
# n13_Die_from_background_myocarditis
# n14_Die_from_COVID19
# n15_Die_from_COVID19_myocarditis

def compute_probs(n1_pfizer_dose, n2_age, n4_ct, sex_vec):
    values = {
        "n3_Sex": sex_vec,
    }

    # always hardcode delta
    pfizer.set_fact(values, "n1_Pfizer_dose", n1_pfizer_dose)
    pfizer.set_fact(values, "n2_Age_group", n2_age)
    pfizer.set_fact(values, "n4_Community_transmission", n4_ct)

    values_infected = dict(values)

    get_covid = pfizer.infer(values, "n10_Risk_of_infection_under_current_transmission_and_vaccination_status")[0]
    get_myocarditis_vax = pfizer.infer(values, "n5_Vaccine_associated_myocarditis")[0]
    die_myocarditis_vax = pfizer.infer(values, "n12_Die_from_Pfizer_myocarditis")[0]
    get_myocarditis_covid = pfizer.infer(values, "n11_Myocarditis_from_COVID19")[0]
    die_myocarditis_covid = pfizer.infer(values, "n15_Die_from_COVID19_myocarditis")[0]
    get_myocarditis_bg = pfizer.infer(values, "n6_Myocarditis_background")[0]
    die_myocarditis_bg = pfizer.infer(values, "n13_Die_from_background_myocarditis")[0]

    # if infected
    pfizer.set_fact(values_infected, "n10_Risk_of_infection_under_current_transmission_and_vaccination_status", "Yes")
    die_covid_if_got_it = pfizer.infer(values_infected, "n14_Die_from_COVID19")[0]

    return (
        get_covid,
        get_myocarditis_vax,
        die_myocarditis_vax,
        get_myocarditis_covid,
        die_myocarditis_covid,
        get_myocarditis_bg,
        die_myocarditis_bg,
        die_covid_if_got_it,
    )
