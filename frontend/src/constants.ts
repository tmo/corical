// top of page
export const TITLE = "[TITLE]: CoRiCal: Covid Risk Calculator"
export const BY_LINE = "[BY_LINE]: By, credits, etc"

// form elements
export const STEP1_TITLE = "[STEP1_TITLE]: Step 1: Patient information"
export const STEP1_HELPER = "[STEP1_HELPER]: Instructional text for Step 1."

export const FIELD_REQUIRED = "[FIELD_REQUIRED]: This field is required.";

export const VARIANT_LABEL = "[VARIANT_LABEL]: SARS-CoV-2 Variant"
export const VARIANTS = [
  {
    value: "alpha",
    label: "[VARIANTS_alpha]: Before Delta variant",
  },
  {
    value: "delta",
    label: "[VARIANTS_delta]: After Delta variant",
  },
];

export const AGE_LABEL = "[AGE_LABEL]: Age"
export const AGE_TOO_SMALL = "[AGE_TOO_SMALL]: Must be at least 16 years old."
export const AGE_TOO_BIG = "[AGE_TOO_BIG]: Please enter an age under 100."

export const SEX_LABEL = "[SEX_LABEL]: Sex"
export const SEX_OPTIONS = [
  {
    value: "female",
    label: "[SO_female]: Female",
  },
  {
    value: "male",
    label: "[SO_male]: Male",
  },
  {
    value: "other",
    label: "[SO_other]: Unspecified",
  },
];

export const VACCINE_LABEL = "[VACCINE_LABEL]: Vaccine"
export const VACCINE_OPTIONS = [
  {
    value: "az1",
    label: "[VO_az1]: First shot of AstraZeneca",
  },
  {
    value: "az2",
    label: "[VO_az2]: Two shots of AstraZeneca",
  },
  {
    value: "az0",
    label: "[VO_az0]: None",
  },
];

export const SCENARIOS_LABEL = "[SCENARIOS_LABEL]: Community transmission scenario"
export const SCENARIOS = [
  {
    value: "None_0",
    label: "[SCL_None_0]: No community transmission",
    description: "[SCD_None_0]: Description for No community transmission",
  },
  {
    value: "ATAGI_Low_0_029_percent",
    label: "[SCL_ATAGI_Low_0_029_percent]: ATAGI low",
    description: "[SCD_ATAGI_Low_0_029_percent]: Description for ATAGI low",
  },
  {
    value: "ATAGI_Med_0_275_percent",
    label: "[SCL_ATAGI_Med_0_275_percent]: ATAGI medium",
    description: "[SCD_ATAGI_Med_0_275_percent]: Description for ATAGI medium",
  },
  {
    value: "ATAGI_High_3_544_percent",
    label: "[SCL_ATAGI_High_3_544_percent]: ATAGI high",
    description: "[SCD_ATAGI_High_3_544_percent]: Description for ATAGI high",
  },
  {
    value: "One_percent",
    label: "[SCL_One_percent]: 1%",
    description: "[SCD_One_percent]: Description for 1%",
  },
  {
    value: "Two_percent",
    label: "[SCL_Two_percent]: 2%",
    description: "[SCD_Two_percent]: Description for 2%",
  },
  {
    value: "NSW_1000_cases",
    label: "[SCL_NSW_1000_cases]: NSW 1000 cases",
    description: "[SCD_NSW_1000_cases]: Description for NSW 1000 cases",
  },
  {
    value: "VIC_1000_cases",
    label: "[SCL_VIC_1000_cases]: VIC 1000 cases",
    description: "[SCD_VIC_1000_cases]: Description for VIC 1000 cases",
  },
  {
    value: "QLD_1000_cases",
    label: "[SCL_QLD_1000_cases]: QLD 1000 cases",
    description: "[SCD_QLD_1000_cases]: Description for QLD 1000 cases",
  },
];

export const SUBMIT_LABEL = "[SUBMIT_LABEL]: Calculate risk"


// output
export const STEP2_TITLE = "[STEP2_TITLE]: Step 2: Risk output"
export const STEP2_HELPER = "[STEP2_HELPER]: Computed risk outputs below."
export const STEP2_SUBMIT_FORM_FIRST = "[STEP2_SUBMIT_FORM_FIRST]: Please submit the form for output."

export const DESCRIPTION_LABEL = "[DESCRIPTION_LABEL]: Description"
export const RISK_LABEL = "[RISK_LABEL]: Risk"
export const COMMENT_LABEL = "[COMMENT_LABEL]: Comment"

export const RISK_PER_MILLION = "[RISK_PER_MILLION]: in a million"
  export const LESS_THAN_TENTH_MILLION = "[LESS_THAN_TENTH_MILLION]: < 0.1 in a million"
export const ZERO_RISK = "[ZERO_RISK]: No risk"
