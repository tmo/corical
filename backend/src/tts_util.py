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

# Note that captalisation matters, should check model spelling each time
def get_age_bracket(age):
    age_brackets = [
        [0, 11, "age_0_11", "0–11 year-old"],
        [12, 19, "age_12_19", "12–19 year-old"],
        [20, 29, "age_20_29", "20–29 year-old"],
        [30, 39, "Age_30_39", "30–39 year-old"],
        [40, 49, "age_40_49", "40–49 year-old"],
        [50, 59, "age_50_59", "50–59 year-old"],
        [60, 69, "age_60_69", "60–69 year-old"],
        [70, 79, "age_70_79", "70–79 year-old"],
        [80, 120, "age_80plus", "80+ year-old"],
    ]
    for ix, (lower, upper, label, text) in enumerate(age_brackets):
        if lower <= age <= upper:
            return text, label, ix
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
        [70, 79, "Age_70_79", "70–79 year-old"],
        [80, 120, "Age_80plus", "80+ year-old"],
    ]
    for ix, (lower, upper, label, text) in enumerate(age_brackets):
        if lower <= age <= upper:
            return text, label, ix
    else:
        raise Exception("Invalid age")
