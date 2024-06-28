import xdsl

lc = xdsl.Model("LC_BN_30042024.xdsl")

# n1_Infection
# n2_Dose
# n3_Vaxstat
# n4_Age
# n5_Sex
# n6_ComorbidityNo
# n7_Drug
# n8_NoOfPrevInfect
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
        "n5_Sex": n5_Sex,
    }

    # always hardcode delta
    lc.set_fact(values, "n2_Dose", n2_Dose)
    lc.set_fact(values, "n4_Age", n4_Age)
    lc.set_fact(values, "n6_ComorbidityNo", n6_ComorbidityNo)
    
    # To Do
    # check model node n8 if "None"
    lc.set_fact(values, "n8_NoOfPrevInfect", n8_InfectionNo)

    lc.set_fact(values, "n7_Drug", "None")

    # check n1 logic
    lc.set_fact(values, "n1_Infection", "Yes")

    get_hospitalisation = lc.infer(values, "n11_Hospitalisation")[0]
    get_icu = lc.infer(values, "n12_ICU")[0]
    get_symptom = lc.infer(values, "n14_LC_1_symptom")[0]
    get_pulmonary = lc.infer(values, "n28_LC_pulmonary")[0]
    get_cardiovascular = lc.infer(values, "n15_LC_cardiovascular")[0]
    get_neurologic = lc.infer(values, "n30_LC_neurologic")[0]
    get_metabolic = lc.infer(values, "n26_LC_metabolic")[0]
    get_gastrointestinal =lc.infer(values, "n20_LC_GI")[0]
    
    # other scenarios
    values_infected = dict(values)
    if n8_InfectionNo == "None":
        n8_InfectionNo_plus = "None"
    elif n8_InfectionNo == "One":
        n8_InfectionNo_plus = "One"
    else:
        n8_InfectionNo_plus = "Two_plus"

    # lc.set_fact(values_infected, "n7_Drug", "Molnupiravir")
    # lc.set_fact(values_infected, "n7_Drug", "Metformin_within7days")
    # lc.set_fact(values_infected, "n7_Drug", "Metformin_within3days")
    # lc.set_fact(values_infected, "n7_Drug", "Nirmatrelvir_paxlovid")
    values_infected["n7_Drug"] = [0.0, 0.25, 0.25, 0.25, 0.25]
    lc.set_fact(values, "n1_Infection", "Yes")
    get_hospitalisation_drug = lc.infer(values_infected, "n11_Hospitalisation")[0]
    get_icu_drug = lc.infer(values_infected, "n12_ICU")[0]
    get_symptom_drug = lc.infer(values_infected, "n14_LC_1_symptom")[0]
    get_pulmonary_drug = lc.infer(values_infected, "n28_LC_pulmonary")[0]
    get_cardiovascular_drug = lc.infer(values_infected, "n15_LC_cardiovascular")[0]
    get_neurologic_drug = lc.infer(values_infected, "n30_LC_neurologic")[0]
    get_metabolic_drug = lc.infer(values_infected, "n26_LC_metabolic")[0]
    get_gastrointestinal_drug =lc.infer(values_infected, "n20_LC_GI")[0]

    values_infected = dict(values)
    lc.set_fact(values_infected, "n8_NoOfPrevInfect", n8_InfectionNo_plus)
    lc.set_fact(values, "n1_Infection", "Yes")
    getget_hospitalisation_infection = lc.infer(values_infected, "n11_Hospitalisation")[0]
    get_icu_infection = lc.infer(values_infected, "n12_ICU")[0]
    get_symptom_infection = lc.infer(values_infected, "n14_LC_1_symptom")[0]
    get_pulmonary_infection = lc.infer(values_infected, "n28_LC_pulmonary")[0]
    get_cardiovascular_infection = lc.infer(values_infected, "n15_LC_cardiovascular")[0]
    get_neurologic_infection = lc.infer(values_infected, "n30_LC_neurologic")[0]
    get_metabolic_infection = lc.infer(values_infected, "n26_LC_metabolic")[0]
    get_gastrointestinal_infection =lc.infer(values_infected, "n20_LC_GI")[0]
    
    return (
        get_hospitalisation,
        get_hospitalisation_drug,
        getget_hospitalisation_infection,
        get_icu,
        get_icu_drug,
        get_icu_infection,
        get_symptom,
        get_symptom_drug,
        get_symptom_infection,
        get_pulmonary,
        get_pulmonary_drug,
        get_pulmonary_infection,
        get_cardiovascular,
        get_cardiovascular_drug,
        get_cardiovascular_infection,
        get_neurologic,
        get_neurologic_drug,
        get_neurologic_infection,
        get_metabolic,
        get_metabolic_drug,
        get_metabolic_infection,
        get_gastrointestinal,
        get_gastrointestinal_drug,
        get_gastrointestinal_infection,
    )
