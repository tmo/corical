risks = [
    {
        "event": "0%",
        "risk": 0,
    },
    {
        "event": "Chance of winning the Oz Lotto Grand prize in a given draw",
        "risk": 1 / 134490400,
    },
    {
        "event": "Chance of being struck by lightning in a year",
        "risk": 1 / 500000,
    },
    {
        "event": "Chance of being in a fatal car accident in a year in Australia",
        "risk": 1 / 18519,
    },
    {
        "event": "Chance of bowling a perfect game",
        "risk": 1 / 11500,
    },
    {
        "event": "Chance of being bitten by a snake in a year Australia",
        "risk": 1 / 8453,
    },
    {
        "event": "Chance of being diagnosed with melanoma in a year in Australia",
        "risk": 1 / 2041,
    },
    {
        "event": "Chance of cracking a double-yolked egg",
        "risk": 1 / 1000,
    },
    {
        "event": "Chance of having a natural pregnancy result in twins",
        "risk": 1 / 250,
    },
    {
        "event": "Chance of being sent a jury summons in a year in Australia",
        "risk": 1 / 169,
    },
    {
        "event": "Chance of being left-handed",
        "risk": 1 / 10,
    },
    {
        "event": "Chance of being audited by the ATO in a year in Australia",
        "risk": 1 / 7,
    },
    {
        "event": "Chance of getting food poisoning per year in Australia",
        "risk": 1 / 6.19,
    },
    {
        "event": "Chance of having your wisdom teeth removed in a year in Australia",
        "risk": 1 / 5,
    },
    {
        "event": "Chance of a baby born in Australia today living to 100",
        "risk": 1 / 3,
    },
    {
        "event": "100%",
        "risk": 1,
    },
]


def generate_relatable_risks(risk_vals):
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