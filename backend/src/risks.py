risks = [
    {
        "event": "0%",
        "risk": 0,
    },
    {
        "event": "Chance of winning the best prize in the lotto in Australia",
        "risk": 1 / 134_000_000,
    },
    {
        "event": "Chance of giving birth to four identical babies if you are pregnant",
        "risk": 1 / 15_000_000,
    },
    {
        "event": "Chance of dying in a shark attack in a year in Australia",
        "risk": 1 / 8_000_000,
    },
    {
        "event": "Chance of dying from a lightning strike in a year in Australia",
        "risk": 1 / 4_000_000,
    },
    {
        "event": "Chance of dying by drowning in the bath some time in your life",
        "risk": 1 / 685_000,
    },
    {
        "event": "Chance of dying after being assaulted in a year in Australia",
        "risk": 1 / 105_000,
    },
    {
        "event": "Chance of dying from a skydive",
        "risk": 1 / 100_000,
    },
    {
        "event": "Chance of dying in a car crash in a year in Australia",
        "risk": 1 / 18_000,
    },
    {
        "event": "Chance of dying by choking on food in Australia some time in your life",
        "risk": 1 / 5000,
    },
    {
        "event": "Chance of dying from a base jump",
        "risk": 1 / 2500,
    },
    {
        "event": "Chance of being born with extra fingers and toes in Australia",
        "risk": 1 / 1000,
    },
    {
        "event": "Chance of getting cancer in the next year in Australia",
        "risk": 1 / 200,
    },
    {
        "event": "Chance of going to hospital after a fall in a year in Australia",
        "risk": 1 / 100,
    },
    {
        "event": "Chance of getting a speeding ticket in a year in Australia",
        "risk": 1 / 12,
    },
    {
        "event": "Chance of getting food poisoning in a year in Australia",
        "risk": 1 / 6,
    },
    {
        "event": "Chance of getting shingles some time in your life",
        "risk": 1 / 3,
    },
#     {
#         "event": "100%",
#         "risk": 1,
#     },
 ]


def generate_relatable_risks_orig(risk_vals):
    """
    Generate risks given a list of risks
    """
    risks_min = min(risk_vals)
    risks_max = max(risk_vals)

    # we choose three values:
    # one less than risks_min
    # one larger than risks_max
    # one in between, or if nothing in between, then one more larger

    ix_less = 0
    ix_more = 0

    for i, rel_risk in enumerate(risks):
        if rel_risk["risk"] < risks_min:
            ix_less = i
        if rel_risk["risk"] > risks_max:
            ix_more = i
            break

    # if we didn't find a bigger risk
    if ix_more == 0:
        ix_more = len(risks) - 1

    if ix_more - ix_less > 1:
        ix_third = ix_more - (ix_more - ix_less) // 2
    else:
        ix_third = ix_more + 1
        if ix_third >= len(risks):
            ix_third = ix_less - 1

    return [risks[i] for i in sorted([ix_less, ix_more, ix_third]) if i not in [0, len(risks) - 1]]


def generate_relatable_risks(risk_vals):
    risks_max = max(risk_vals)

    ix_more = len(risks) - 1

    for i, rel_risk in enumerate(risks):
        if rel_risk["risk"] > risks_max:
            ix_more = i
            break

    return [risks[ix_more]]
