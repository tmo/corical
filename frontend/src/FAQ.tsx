export const FAQ_ITEMS =  [
  {
    question: "How is the risk of various scenarios calculated?",
    answer: <> We have used trusted data sources (such as government reports 
      and published scientific studies) to create a Bayesian Network 
      model. A Bayesian network is a graphical model that uses conditional 
      probabilities to determine the likely probability of certain events.
      For examples of how these probabilities are calculated based on the assumptions, 
      see <a rel="noreferrer" target="_blank" href="/docs/AstraZeneca_and_Pfizer_Model_Manual_Calculations.pdf">here for Astrazeneca vaccine</a>  and <a rel="noreferrer" target="_blank" href="/docs/Pfizer_Model_Manual_Calculations.pdf">here for the Pfizer vaccine</a>.  
      Assumptions are listed <a rel="noreferrer" target="_blank" href="/docs/astrazeneca_assumptions_11_03_22.pdf">here for Astrazeneca vaccine</a> and <a rel="noreferrer" target="_blank" href="/docs/pfizer_assumptions_11_03_22.pdf">here for the Pfizer vaccine</a>.
      </>,
  },
  {
    question: "Why are comorbidities (e.g. obesity, diabetes, cardiovascular disease, immunosuppression etc) not included in this calculator?",
    answer: `We are currently designing an updated model and calculator that takes these factors into account. We anticipate releasing this new version as soon as possible`,
  },
  {
    question: "Will future versions include other outcomes of SARS-CoV-2 infection (e.g. hospitalisation, ICU admission, long COVID, etc)?",
    answer: `Yes. We will release these versions as data become available. `,
  },
  {
    question: "What viral variant is the calculator based upon? ",
    answer: `The current calculator assumes that 100% of COVID-19 cases are caused by the Omicron variant. Should this change in the future we will look to update the calculator accordingly. `,
  },
  {
    question: "What are the chances of each outcome for someone who has had a prior COVID-19 infection with or without vaccination?",
    answer: `Prior COVID-19 infection can induce an immune response that may give people some level of protection from re-infection. We are currently collecting the latest available data on this and anticipate releasing this update once sufficient evidence has been obtained.`,
  },
  {
    question: "Are the rates per whole population or are the rates per the relevant age group population?",
    answer: `The rates are displayed either as number per million people of the selected age group and sex, or as a 1 in a number chance of the event for the selected age group and sex. `,
  },
  {
    question: "Why is the risk of dying different between the risk charts and the interactive calculator? ",
    answer: `This is because the interactive calculator is the latest update which assumes 100% of cases are Omicron. The risk charts were designed in January 2022 and when it was assumed that 10% of cases were Delta and 90% of cases were Omicron. `,
  },
  {
    question: "Is the calculator based on Australian data? ",
    answer: <> Where possible we have tried to draw on Australian data sources 
      but where this is not available we have used international data sources. 
      All data sources are shown here (see  
      <a rel="noreferrer" target="_blank" href="/docs/pfizer_assumptions_11_03_22.pdf"> Pfizer data sources </a> 
      and <a rel="noreferrer" target="_blank" href="/docs/astrazeneca_assumptions_11_03_22.pdf"> AstraZeneca data
      sources </a> and assumptions). </>,
  },
  {
    question: "What are the common non-serious adverse effects of the vaccines and how frequently do they occur?",
    answer: <> According to <a rel="noreferrer" target="_blank" href="https://www.sciencedirect.com/science/article/pii/S1473309921002243"> 
    a study of more than 600,000 individuals in the UK </a> local side-effects 
    were reported by 71·9% of individuals after the first dose of the Pfizer 
    COVID-19 vaccine, by 68·5% after the second dose of Pfizer COVID-19 vaccine, 
    and by 58·7% after the first dose of AstraZeneca COVID-19 vaccine. Tenderness 
    and local pain around the injection site were the most frequently reported 
    local effects, occurring most often on the day after injection. </>,
  },
  {
    question: "Does the calculator get any funding from pharmaceutical companies?",
    answer: `This calculator receives funding from the Immunisation Coalition who in turn receives educational grants from pharmaceutical companies that manufacture vaccines.  However, the CoRiCal project has not received any direct funding from AstraZeneca, Moderna, Pfizer, or any other companies that produce COVID-19 vaccines. `,
  },
  {
    question: "Does the calculator get any funding from governments?",
    answer: `No, the calculator is not funded by any governments. The contributors (including both clinicians and academics) work on the calculator in their free time. `,
  },
  {
    question: "Is the calculator designed to push vaccination?",
    answer: `No. While the support for the calculator came from the Immunisation Coalition, its development has been done by researchers and clinicians who are neither employed by the Immunisation Coalition (or vaccine manufacturers) nor have they received any specific directions as to the content. The risk estimates that have been used are provided and are in the public domain. The estimates are changed if the risks change. The primary purpose of the tool is as a shared decision-making tool to assist the public (and GPs) in coming to a decision that they feel comfortable with about having a COVID-19 vaccine. It presents the risk in a manner that is hopefully simple to understand and the decision about vaccination is left to the patient. The patient may want to discuss this information with their vaccine provider eg GP, practice nurse. Alternatively thay can look at the calculator online without any health care provider input`,
  },
  {
    question: "Where can I get more information about the calculator CoRiCal?",
    answer: `There is a feedback section at the end of the tool. If you would like to get some information or offer feedback, please complete the tool. You will need to include your email address if you want someone to get back to you`,
  },
  {
    question: "Where can I get information about treatments for COVID-19?",
    answer: <> This information can be found at the Australian Department of 
      Health Website (<a rel="noreferrer" target="_blank" href="https://www.health.gov.au/health-alerts/covid-19/treatments"> 
      https://www.health.gov.au/health-alerts/covid-19/treatments </a>). </>,
  },
];


