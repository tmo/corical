// top of page
export const TITLE = "CoRiCal: Covid Risk Calculator";
export const BY_LINE = "By, credits, etc";

// form elements
export const STEP1_TITLE = "Step 1: Patient information";
export const STEP1_HELPER = "Instructional text for Step 1.";

export const FIELD_REQUIRED = "This field is required.";

export const AGE_LABEL = "Age";
export const AGE_TOO_SMALL = "Must be at least 16 years old.";
export const AGE_TOO_BIG = "Please enter an age under 100.";

export const SEX_LABEL = "Sex";
export const SEX_OPTIONS = [
  {
    value: "female",
    label: "Female",
  },
  {
    value: "male",
    label: "Male",
  },
  {
    value: "other",
    label: "Unspecified",
  },
];

export const VACCINE_LABEL = "Vaccine";
export const VACCINE_OPTIONS = [
  {
    value: "az0",
    label: "None",
  },
  {
    value: "az1",
    label: "First shot of AstraZeneca",
  },
  {
    value: "az2",
    label: "Two shots of AstraZeneca",
  },
];

export const SCENARIOS_LABEL = "Community transmission scenario";
export const SCENARIOS = [
  {
    value: "None_0",
    label: "No community transmission",
    description: "Description for No community transmission",
  },
  {
    value: "ATAGI_Low_0_029_percent",
    label: "ATAGI low",
    description: "Description for ATAGI low",
  },
  {
    value: "ATAGI_Med_0_275_percent",
    label: "ATAGI medium",
    description: "Description for ATAGI medium",
  },
  {
    value: "ATAGI_High_3_544_percent",
    label: "ATAGI high",
    description: "Description for ATAGI high",
  },
  {
    value: "One_percent",
    label: "1%",
    description: "Description for 1%",
  },
  {
    value: "Two_percent",
    label: "2%",
    description: "Description for 2%",
  },
  {
    value: "NSW_1000_cases",
    label: "NSW 1000 cases",
    description: "Description for NSW 1000 cases",
  },
  {
    value: "VIC_1000_cases",
    label: "VIC 1000 cases",
    description: "Description for VIC 1000 cases",
  },
  {
    value: "QLD_1000_cases",
    label: "QLD 1000 cases",
    description: "Description for QLD 1000 cases",
  },
];

export const SUBMIT_LABEL = "Calculate risk";

// output
export const STEP2_TITLE = "Step 2: Risk output";
export const STEP2_HELPER = "Computed risk outputs below.";
export const STEP2_SUBMIT_FORM_FIRST = "Please submit the form for output.";

export const DESCRIPTION_LABEL = "Description";
export const RISK_LABEL = "Risk";
export const COMMENT_LABEL = "Comment";

export const RISK_PER_MILLION = "in a million";
export const LESS_THAN_TENTH_MILLION = "< 0.1 in a million";
export const ZERO_RISK = "No risk";

export const TOS_HEADING = "Important information";
export const TOS_1 = "I have read and agree to the";
export const TOS_2 = "Terms and Conditions";
export const TOS_3 = "of use for the Covid-19 Risk Calculator (CoRiCal).";

export const TOS_TITLE = "Terms and Conditions";
export const TOS_TEXT = "TODO";
