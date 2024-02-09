// top of page
export const TITLE = "CoRiCal: COVID-19 Risk Calculator";
export const BY_LINE = "By, credits, etc";

// form elements
export const STEP1_TITLE = "About you";
export const STEP1_HELPER =
  "Enter your age, sex, and if you've had a vaccine to check your risks.";

export const FIELD_REQUIRED = "This field is required.";

export const AGE_LABEL = "Age";
export const AGE_TOO_SMALL = "Must be at least 18 years old.";
export const AGE_TOO_BIG = "Please enter an age under 100.";
export const CHILDREN_AGE_TOO_SMALL = "Must be at least 5 years old.";
export const CHILDREN_AGE_TOO_BIG = "Please enter an age under 18, or use the adult calculator.";

export const STATE_LABEL = "State";
export const STATE_DEFAULT = "NSW";
export const STATE_OPTIONS = [
  {
    value: "NSW",
    label: "NSW",
  },
  {
    value: "VIC",
    label: "VIC",
  },
  {
    value: "QLD",
    label: "QLD",
  },
  {
    value: "WA",
    label: "WA",
  },
  {
    value: "SA",
    label: "SA",
  },
  {
    value: "TAS",
    label: "TAS",
  },
  {
    value: "ACT",
    label: "ACT",
  },
  {
    value: "NT",
    label: "NT",
  },
];

export const STATE_NUMBERS = {
  "NSW": {
    "Ten_percent": "13550",
    "Five_percent": "6775",
    "Two_percent": "2710",
    "One_percent": "1355",
  },
  "QLD": {
    "Ten_percent": "8827",
    "Five_percent": "4413",
    "Two_percent": "1765",
    "One_percent": "883",
  },
  "SA": {
    "Ten_percent": "3026",
    "Five_percent": "1513",
    "Two_percent": "605",
    "One_percent": "303",
  },
  "TAS": {
    "Ten_percent": "952",
    "Five_percent": "476",
    "Two_percent": "190",
    "One_percent": "95",
  },
  "VIC": {
    "Ten_percent": "10989",
    "Five_percent": "5494",
    "Two_percent": "2198",
    "One_percent": "1099",
  },
  "WA": {
    "Ten_percent": "4622",
    "Five_percent": "2311",
    "Two_percent": "924",
    "One_percent": "462",
  },
  "NT": {
    "Ten_percent": "417",
    "Five_percent": "209",
    "Two_percent": "83",
    "One_percent": "42",
  },
  "ACT": {
    "Ten_percent": "760",
    "Five_percent": "380",
    "Two_percent": "152",
    "One_percent": "76",
  },
};

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
export const VACCINE_SECOND_VAL = "Two";
export const VACCINE_OPTIONS = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "OneAZ_under_3_weeks",
    label: "One shot of AstraZeneca (3 weeks ago)",
  },
  {
    value: VACCINE_SECOND_VAL,
    label: "Two shots of AstraZeneca",
  },
  {
    value: "TwoAZ_OnePfz_under_2_months",
    label: "Two shots of AstraZeneca, then one shot of Pfizer (2 months ago)",
  },
];

export const VACCINE_LABEL_TIME = 
  "Time since second dose"
export const VACCINE_OPTIONS_TIME = [
  {
    value: "TwoAZ_under_2_months",
    label: "Less than 2 months",
  },
  {
    value: "TwoAZ_2to4_months",
    label: "Between 2 and 4 months",
  },
  {
    value: "TwoAZ_4to6_months",
    label: "Between 4 and 6 months",
  },
]

export const PZ_VACCINE_LABEL_SEP = "Vaccine";
export const PZ_VACCINE_SECOND_VAL_SEP = "Two";
// export const DOSE_OVERDUE_DISCLAIMER_SEP = "We don't currently have estimates for people whose second or third shot is overdue";
export const PZ_VACCINE_OPTIONS_SEP = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "One",
    label: "One shot of Pfizer",
  },
  {
    value: PZ_VACCINE_SECOND_VAL_SEP,
    label: "Two shots of Pfizer",
  },
  {
    value: "Three_under_3mths",
    label: "Three shots of Pfizer (Less than 3 months ago)",
  },
];

export const PZ_VACCINE2_LABEL_SEP =
  "Time since second dose";
export const PZ_VACCINE2_OPTIONS_SEP = [
  {
    value: "Two_under_3mths",
    label: "Less than 3 months",
  },
  {
    value: "Two_3_6mths",
    label: "Between 3 and 6 months",
  },
  {
    value: "Two_6_8mths",
    label: "Between 6 and 8 months",
  },
  // {
  //   value: "Two_last_dose_more_than_6_months_ago",
  //   label: "More than 6 months",
  // },
];

export const LC_COMOR_LABEL = "Number of pre-existing comorbidities";
export const LC_COMOR_HELPER = "Comorbidities may include, but are not limited to chronic lung disease, cancer, cardiovascular disease, cerebrovascular disease, dementia, diabetes mellitus, hypertension, hyperlipidemia, depression, anxiety, chronic kidney disease, hepatitis C, and peripheral artery disease. We don’t currently have estimates for specific types of comorbidities.";

export const LC_COMOR_OPTIONS = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "One_to_three",
    label: "One to three",
  },
  {
    value: "Four_plus",
    label: "Four or more",
  },
];

export const LC_INFECTION_LABEL = "Number of previous SARS-CoV-2 infections";
export const LC_INFECTION_OPTIONS = [
  {
    value: "First",
    label: "None",
  },
  {
    value: "Second",
    label: "One",
  },
  {
    value: "Third_plus",
    label: "Two or more",
  },
];
export const LC_VACCINE_LABEL = "Vaccine";
export const LC_VACCINE_SECOND_VAL = "Two";
export const LC_VACCINE_THIRD_VAL = "Three";
export const LC_VACCINE_FOURTH_VAL = "Four";

export const LC_VACCINE_OPTIONS = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "One",
    label: "One shot (3 weeks ago)",
  },
  {
    value: LC_VACCINE_SECOND_VAL,
    label: "Two shots",
  },
  {
    value: LC_VACCINE_THIRD_VAL,
    label: "Three shots",
  },  
  {
    value: LC_VACCINE_FOURTH_VAL,
    label: "Four shots",
  },

];

export const LC_VACCINE2_LABEL =
  "Time since last shot";

export const LC_VACCINE2_OPTIONS = [
  {
    value: "Second_2weeks_5mnths",
    label: "Last shot 2 weeks to 5 months ago",
  },
  {
    value: "Second_6_11mnths",
    label: "Last shot 6 to 11 months ago",
  },
  {
    value: "Second_12plus_mnths",
    label: "Last shot 12 or more months ago",
  },

];

export const LC_VACCINE3_OPTIONS = [
  {
    value: "Third_2wks_5mths",
    label: "Last shot 2 weeks to 5 months ago",
  },
  {
    value: "Third_6_11mnths",
    label: "Last shot 6 to 11 months ago",
  },
  {
    value: "Third_12plus_mnths",
    label: "Last shot 12 or more months ago",
  },

];

export const LC_VACCINE4_OPTIONS = [
  {
    value: "Fourth_2_4wks",
    label: "Last shot 2 to 4 weeks ago",
  },
  {
    value: "Fourth_5_9wks",
    label: "Last shot 5 to 9 weeks ago",
  },
  {
    value: "Fourth_10_14wks",
    label: "Last shot 10 to 14 weeks ago",
  },
  {
    value: "Fourth_15_19wks",
    label: "Last shot 15 to 19 weeks ago",
  },
  {
    value: "Fourth_20plus_wks",
    label: "Last shot 20 or more weeks ago",
  },
];

export const PZ_SCENARIOS_LABEL_SEP = "How many cases are there in your community?";
export const PZ_SCENARIOS_DEFAULT_SEP = "Five_percent";
export const PZ_SCENARIOS_SEP = [
  {
    value: "Ten_percent",
    label: "A huge number of cases",
    description: "10% chance of getting COVID-19 over 2 months – about the same as 13,600 cases per day in NSW",
  },
  {
    value: "Five_percent",
    label: "A large number of cases",
    description: "5% chance of getting COVID-19 over 2 months – about the same as 6,800 cases per day in NSW",
  },
  // {
  //   value: "ATAGI_High",
  //   label: "A lot of cases ",
  //   description: "2% chance of getting COVID-19 over 2 months – about the same as 2,500 cases per day in NSW",
  // },
  {
    value: "Two_percent",
    label: "A lot of cases",
    description: "2% chance of getting COVID-19 over 2 months – about the same as 2,500 cases per day in NSW",
  },
  {
    value: "ATAGI_Med",
    label: "A few cases ",
    description: "0.15% chance of getting COVID-19 over 2 months – about the same as 200 cases per day in NSW",
  },
  {
    value: "ATAGI_Low",
    label: "Not many cases ",
    description: "0.02% chance of getting COVID-19 over 2 months – about the same as 20 cases per day in NSW",
  },
  // {
  //   value: "None_0",
  //   label: "No community transmission",
  //   description: "No COVID-19 circulating in the community",
  // },
];

export const SUBMIT_LABEL_SEP = "Calculate risk";

export const PZ_VACCINE_LABEL = "How many COVID-19 vaccine shots have you had?";
export const PZ_VACCINE_SECOND_VAL = "Two";
export const PZ_VACCINE_THIRD_VAL = "Three";
export const DOSE_OVERDUE_DISCLAIMER = "We don't currently have estimates for people whose second or third shot is overdue";
export const PZ_VACCINE_OPTIONS = [
  {
    value: "None",
    label: "None",
  },
  // {
  //   value: "One_at_3wks",
  //   label: "One shot of Pfizer (3 weeks ago)",
  // },
  {
    value: PZ_VACCINE_SECOND_VAL,
    label: "2",
  },
  {
    value: PZ_VACCINE_THIRD_VAL,
    label: "3",
  },
  {
    value: "Four_doses_any",
    label: "4",
  },
];


export const PZ_VACCINE_TYPE=
  "Which vaccine did you have for your first 2 shots?";
export const PZ_VACCINE_TYPE_SUBTITLE=
  "If you had 2 different vaccine types, select the type of the second shot?";
export const PZ_VACCINE_TYPE_OPTIONS = [
  {
    value: "AZ",
    label: "Astra Zeneca",
  },
  {
    value: "Pf",
    label: "Pfizer",
  },
  {
    value: "MD",
    label: "Moderna",
  },
];

export const PZ_VACCINE3_TYPE=
  "Which vaccine did you have for your third shot?";
export const PZ_VACCINE3_TYPE_OPTIONS = [
  {
    value: "Pf",
    label: "Pfizer",
  },
  {
    value: "MD",
    label: "Moderna",
  },
];


export const PZ_VACCINE_TIME_LABEL =
  "How long ago was your last shot of COVID-19 vaccine? ";
export const PZ_VACCINE2_TIME_OPTIONS = [
  {
    value: "under_2_months",
    label: "Less than 2 months",
  },
  {
    value: "2to4_months",
    label: "Between 2 and 4 months",
  },
  {
    value: "4to6_months",
    label: "Between 4 and 6 months",
  },
  {
    value: "6_months",
    label: "More than 6 months",
  },
];
export const PZ_VACCINE3_TIME_OPTIONS = [
  {
    value: "under_2_months",
    label: "Less than 2 months",
  },
  {
    value: "4to6_months",
    label: "Between 4 and 6 months",
  },
  {
    value: "6_months",
    label: "More than 6 months",
  },
];

export const CHILDREN_VACCINE_OPTIONS = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "Two_Pfizer",
    label: "Two shots of Pfizer for children",
  },
  // {
  //   value: "Two_Moderna",
  //   label: "Two shots of Moderna for children",
  // },
];

export const CHILDREN_SCENARIOS_LABEL = `How many reported cases are there in 
            your area? If you’re not sure, the calculator will assume there is 
            a large number of COVID-19 cases in your area.`;
export const CHILDREN_SCENARIOS_DEFAULT = "Five_percent";
export const CHILDREN_SCENARIOS = [
  {
    value: "Ten_percent",
    label: "A huge number of cases",
    description: "10% chance of getting COVID-19 over 2 months – about the same as {case_number} cases per day in {state}",
  },
  {
    value: "Five_percent",
    label: "A large number of cases",
    description: "5% chance of getting COVID-19 over 2 months – about the same as {case_number} cases per day in {state}",
  },
  {
    value: "Two_percent",
    label: "A lot of cases",
    description: "2% chance of getting COVID-19 over 2 months – about the same as {case_number} cases per day in {state}",
  },
  {
  value: "One_percent",
  label: "A few cases",
  description: "1% chance of getting COVID-19 over 2 months – about the same as {case_number} cases per day in {state}",
  },
];

export const SUBMIT_LABEL = "Calculate risk";

export const SCENARIOS_LABEL = `How many reported cases are there in 
            your area? If you’re not sure, the calculator will assume there is 
            a large number of COVID-19 cases in your area.`;
export const SCENARIOS_DEFAULT = "Five_percent";
export const SCENARIOS = [
  {
    value: "Ten_percent",
    label: "A huge number of cases",
    description: "10% chance of getting COVID-19 over 2 months – about the same as 13,600 cases per day in NSW",
  },
  {
    value: "Five_percent",
    label: "A large number of cases",
    description: "5% chance of getting COVID-19 over 2 months – about the same as 6,800 cases per day in NSW",
  },
  {
    value: "Two_percent",
    label: "A lot of cases",
    description: "2% chance of getting COVID-19 over 2 months – about the same as 2,500 cases per day in NSW",
  },
  {
    value: "One_percent",
    label: "A few cases",
    description: "1% chance of getting COVID-19 over 2 months – about the same as 1,300 cases per day in NSW",
  },
];

export const PZ_SCENARIOS_LABEL = `How many reported cases are there in 
            your area? If you’re not sure, the calculator will assume there is 
            a large number of COVID-19 cases in your area.`;
export const PZ_SCENARIOS_DEFAULT = "Five_percent";
export const PZ_SCENARIOS = [
  {
    value: "Ten_percent",
    label: "A huge number of cases",
    description: "10% chance of getting COVID-19 over 2 months – about the same as {case_number} cases per day in {state}",
  },
  {
    value: "Five_percent",
    label: "A large number of cases",
    description: "5% chance of getting COVID-19 over 2 months – about the same as {case_number} cases per day in {state}",
  },
  {
    value: "Two_percent",
    label: "A lot of cases",
    description: "2% chance of getting COVID-19 over 2 months – about the same as {case_number} cases per day in {state}",
  },
  {
  value: "One_percent",
  label: "A few cases",
  description: "1% chance of getting COVID-19 over 2 months – about the same as {case_number} cases per day in {state}",
  },
];

// output
export const STEP2_TITLE = "Risk output";
export const STEP2_SUBMIT_FORM_FIRST = "Please submit the form for output.";

export const AZ_VERSION_ALERT = `This calculator is for people who had the 
            AstraZeneca vaccine for their first two shots. Last updated on 
            11/03/2022. The tool assumes that all the cases are caused by the 
            Omicron variant.`;
export const LC_VERSION_ALERT = `This calculator is for people who are looking to 
              assess long COVID risk if infected with symptomatic SARS-CoV-2. Last updated
               on 13/02/2024. The tool assumes that all the cases are caused by the Omicron variant.`;
export const PZ_VERSION_ALERT = `This calculator is for people who had the 
            Pfizer vaccine for their first two shots. Last updated on 
            11/03/2022. The tool assumes that all the cases are caused by the 
            Omicron variant.`;
export const PZ_CHILDREN_VERSION_ALERT = `This calculator is for  people  under 
            18 who had the Pfizer vaccine. Last updated on 27/02/2023. The tool 
            assumes that all the cases are caused by the Omicron variant.`;


export const DESCRIPTION_LABEL = "Description";
export const RISK_LABEL = "Risk";
export const COMMENT_LABEL = "Comment";

export const RISK_PER_MILLION = "in a million";
export const LESS_THAN_TENTH_MILLION = "Less than 0.1 in a million";
export const ZERO_RISK = LESS_THAN_TENTH_MILLION;
export const LESS_THAN_TENTH_MILLION_IN_X = "Less than 1 in 10,000,000";
export const ZERO_RISK_IN_X = LESS_THAN_TENTH_MILLION_IN_X;

export const RISK_TEXT = "Number of cases per million people";
export const INFOBOX_RISK_TEXT = "cases per million people";

export const TOS_HEADING = "Important information";
export const TOS_1 = "I have read and agree to the";
export const TOS_2 = "Terms and Conditions";
export const TOS_3 = "for using the COVID-19 Risk Calculator (CoRiCal).";

export const TOS_TITLE = "Terms and Conditions";

export function TOS_TEXT() {
  return (
    <>
      <p>
        The CoRiCal risk calculator intends to provide rough estimates of
        benefits versus risks of COVID-19 vaccines to help people make informed
        decisions about vaccination. CoRiCal does not estimate an individual's
        personal risks related to COVID-19 and COVID-19 vaccination. The risks
        provided by CoRiCal (e.g. risk of dying from COVID-19) are estimates of
        the average risk for males and females in each age group, and does not
        take into account individual level factors such as medical conditions
        (e.g. diabetes, obesity) or behaviour (e.g. occupation, social
        activities). The risks were calculated using a{" "}
        <a href="https://doi.org/10.1016/j.vaccine.2021.10.079">model</a> based
        on the best known evidence, but model estimates inevitably come with
        some level of uncertainty.
      </p>
      <p>
        CoRiCal does not provide advice on diagnosis or medical management. The
        Immunisation Coalition, University of Queensland, La Trobe University,
        and the members of the CoRiCal development team accept no responsibility
        for the outcomes of any actions, decisions, or advice provided, based on
        information obtained from using CoRiCal.
      </p>
      <p>
        Users accept all risks associated with using CoRiCal. Users must
        exercise their own independent clinical skill and judgment or seek
        professional clinical advice before relying on information contained in
        CoRiCal when making a clinical decision.
      </p>
      <p>
        The Immunisation Coalition, University of Queensland, La Trobe
        University, and the members of the CoRiCal development team do not make
        any warranty or representation in relation to the accuracy, currency or
        completeness of any information contained in CoRiCal or on the website
        and do not accept any legal liability or responsibility for any injury,
        loss or damage incurred by use, reliance or interpretation of the
        information contained in CoRiCal.
      </p>
      <p>
        CoRiCal may be found in third parties' programs or materials. This does
        not imply an endorsement or recommendation by the Immunisation
        Coalition, University of Queensland, La Trobe University, and the
        members of the CoRiCal development team for such third parties'
        organisations, products, services, materials, or information. Any use of
        CoRiCal by another organisation is at its own risk.
      </p>
      <p>
        The entire contents of CoRiCal are subject to copyright protection.{" "}
      </p>
      <p>
        The CoRiCal website uses cookies to improve users' experience of the
        website, and to enable CoRiCal to collect de-identified data about the
        use of CoRiCal. These data are used for analysis and evaluation of
        CoRiCal.{" "}
      </p>
      <p>
        CoRiCal does not require users to provide any personal information.
        CoRiCal does not collect users' personal information. CoRiCal has been
        designed to be used anonymously. In using CoRiCal you consent to CoRiCal
        collecting de-identified data for the purposes of analysis and
        evaluation. These data may be collected from user inputs and from user
        surveys, noting that completion of any user surveys in CoRiCal is
        optional.{" "}
      </p>
      <p>
        CoRiCal verifies that all data are stored on secure servers in
        Australia.
      </p>
      <p>
        For further information, please refer to the Immunisation Coalition's
        statement on cookies and the{" "}
        <a
          href="https://www.immunisationcoalition.org.au/privacy-policy/"
          target="_blank"
          rel="noreferrer"
        >
          privacy policy
        </a>
        .
      </p>
    </>
  );
}
