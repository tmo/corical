import numpy as np


def get_link(sex, age_ix):
    if sex == "female" and age_ix == 1:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-female-10-19-years-of-age/"
    if sex == "female" and age_ix == 2:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-female-20-29-years-old/"
    if sex == "female" and age_ix == 3:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-female-30-39-years-old/"
    if sex == "female" and age_ix == 4:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-female-40-49-years-old/"
    if sex == "female" and age_ix == 5:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-female-50-59-years-old/"
    if sex == "female" and age_ix == 6:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-female-60-69-years-old/"
    if sex == "female" and age_ix == 7:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-female-70-and-over/"
    if sex == "male" and age_ix == 1:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-male-10-19-years-old/"
    if sex == "male" and age_ix == 2:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-male-20-29-years-old/"
    if sex == "male" and age_ix == 3:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-male-30-39-years-old/"
    if sex == "male" and age_ix == 4:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-male-40-49-years-old/"
    if sex == "male" and age_ix == 5:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-male-50-59-years-old/"
    if sex == "male" and age_ix == 6:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-male-60-69-years-old/"
    if sex == "male" and age_ix == 7:
        return "https://www.immunisationcoalition.org.au/resources/corical/corical-male-70-and-over/"


def get_age_bracket(age):
    age_brackets = [
        [0, 9, "0–9 year-old"],
        [10, 19, "10–19 year-old"],
        [20, 29, "20–29 year-old"],
        [30, 39, "30–39 year-old"],
        [40, 49, "40–49 year-old"],
        [50, 59, "50–59 year-old"],
        [60, 69, "60–69 year-old"],
        [70, 120, "70+ year-old"],
    ]
    for ix, (lower, upper, text) in enumerate(age_brackets):
        if lower <= age <= upper:
            age_vec = np.zeros(len(age_brackets))
            age_vec[ix] = 1.0
            return text, age_vec, ix
    else:
        raise Exception("Invalid age")


def get_age_bracket_pz(age):
    age_brackets = [
        [0, 11, "Age_0_11", "0–11 year-old"],
        [12, 19, "Age_12_19", "12–19 year-old"],
        [20, 29, "Age_20_29", "20–29 year-old"],
        [30, 39, "Age_30_39", "30–39 year-old"],
        [40, 49, "Age_40_49", "40–49 year-old"],
        [50, 59, "Age_50_59", "50–59 year-old"],
        [60, 69, "Age_60_69", "60–69 year-old"],
        [70, 120, "Age_70plus", "70+ year-old"],
    ]
    for ix, (lower, upper, label, text) in enumerate(age_brackets):
        if lower <= age <= upper:
            return text, label, ix
    else:
        raise Exception("Invalid age")
