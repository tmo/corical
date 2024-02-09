import xdsl

lc = xdsl.Model("LC_BN_050224.xdsl")

# n1_Infection
# n2_Dose
# n3_Vaxstat
# n4_Age
# n5_Sex
# n6_ComorbidityNo
# n7_Drug
# n8_InfectionNo
# n9_Vax_vs_hospICU
# n10_Vax_vs_death
# n11_Hospitalisation
# n12_ICU
# n13_Death
# n14_LC_1_symptom
# n15_LC_cardiovascular
# n16_LC_chest_pain
# n17_LC_arrythmias
# n18_LC_coagulation
# n19_LC_fatigue
# n20_LC_GI
# n21_LC_kidney
# n22_LC_mental_health
# n23_LC_sleep_disorders
# n24_LC_anxiety
# n25_LC_depression
# n26_LC_metabolic
# n27_LC_musculoskeletal
# n28_LC_pulmonary
# n29_LC_breathlessness
# n30_LC_neurologic
# n31_LC_memory_problems
# n32_LC_smell_problems


def compute_long_covid_probs(n2_Dose, n4_Age, n5_Sex, n6_ComorbidityNo, n8_InfectionNo):
    values = {
    }

    if n8_InfectionNo != "None":
        infection = "Yes"
    else: 
        infection = "No"

    # always hardcode delta
    lc.set_fact(values, "n2_Dose", n2_Dose)
    lc.set_fact(values, "n4_Age", n4_Age)
    lc.set_fact(values, "n5_Sex", n5_Sex)
    lc.set_fact(values, "n6_ComorbidityNo", n6_ComorbidityNo)
    lc.set_fact(values, "n8_InfectionNo", n8_InfectionNo)
    lc.set_fact(values, "n7_Drug", "None")
    lc.set_fact(values, "n1_Infection", infection)

    values_infected = dict(values)

    get_hospitalisation = lc.infer(values, "n11_Hospitalisation")[0]
    get_icu = lc.infer(values, "n12_ICU")[0]
    get_symptom = lc.infer(values, "n14_LC_1_symptom")[0]
    get_pulmonary = lc.infer(values, "n28_LC_pulmonary")[0]
    get_coagulation = lc.infer(values, "n18_LC_coagulation")[0]
    get_neurologic = lc.infer(values, "n30_LC_neurologic")[0]
    get_metabolic = lc.infer(values, "n26_LC_metabolic")[0]
    
    # if infected
    lc.set_fact(values_infected, "n1_Infection", "Yes")
    # die_covid_if_got_it = lc.infer(values_infected, "n14_Die_from_COVID19")[0]
    # get_myocarditis_given_covid = lc.infer(values_infected, "n11_Myocarditis_from_COVID19")[0]
    # die_myocarditis_given_covid = lc.infer(values_infected, "n15_Die_from_COVID19_myocarditis")[0]

    # return ()
    return (
        get_hospitalisation,
        get_icu,
        get_symptom,
        get_pulmonary,
        get_coagulation,
        get_neurologic,
        get_metabolic,
    )
