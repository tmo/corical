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
export const SCENARIOS_DEFAULT = "ATAGI_Med_0_275_percent";
export const SCENARIOS = [
  {
    value: "ATAGI_High_3_544_percent",
    label: "High transmission",
    description:
      "Similar to Europe in January 2021 (equivalent to 5.76% of population infected over 6 months, or 2500 cases/day in NSW)",
  },
  {
    value: "ATAGI_Med_0_275_percent",
    label: "Medium transmission",
    description:
      "Similar to the  2nd wave in VIC in 2020 (equivalent to 0.45% of population infected over 6 months, or 200 cases/day in NSW)",
  },
  {
    value: "ATAGI_Low_0_029_percent",
    label: "Low transmission",
    description:
      "Similar to the 1st wave in Australia in 2020 (equivalent to 0.05% of population infected over 6 months, or 21 cases/day in NSW)",
  },
  {
    value: "None_0",
    label: "No community transmission",
    description: "No COVID-19 circulating in the community",
  },
  // {
  //   value: "One_percent",
  //   label: "1%",
  //   description: "Description for 1%",
  // },
  // {
  //   value: "Two_percent",
  //   label: "2%",
  //   description: "Description for 2%",
  // },
  // {
  //   value: "NSW_1000_cases",
  //   label: "NSW 1000 cases",
  //   description: "Description for NSW 1000 cases",
  // },
  // {
  //   value: "VIC_1000_cases",
  //   label: "VIC 1000 cases",
  //   description: "Description for VIC 1000 cases",
  // },
  // {
  //   value: "QLD_1000_cases",
  //   label: "QLD 1000 cases",
  //   description: "Description for QLD 1000 cases",
  // },
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

export function TOS_TEXT() {
  return (
    <>
      <p>
        CoRiCal does not estimate an individual’s personal risks related to
        COVID-19 and COVID-19 vaccination.
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
        CoRiCal may be found in third parties’ programs or materials. This does
        not imply an endorsement or recommendation by the Immunisation
        Coalition, University of Queensland, La Trobe University, and the
        members of the CoRiCal development team for such third parties’
        organisations, products, services, materials, or information. Any use of
        CoRiCal by another organisation is at its own risk.
      </p>
      <p>
        The entire contents of CoRiCal are subject to copyright protection.{" "}
      </p>
      <p>
        The CoRiCal website uses cookies to improve users’ experience of the
        website, and to enable CoRiCal to collect de-identified data about the
        use of CoRiCal. These data are used for analysis and evaluation of
        CoRiCal.{" "}
      </p>
      <p>
        CoRiCal does not require users to provide any personal information.
        CoRiCal does not collect users’ personal information. CoRiCal has been
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
        For further information, please refer to the Immunisation Coalition’s
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
