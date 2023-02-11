export const FAQ_ITEMS =  [
  {
    question: "How is the risk of various scenarios calculated?",
    answer: <> We have used trusted data sources (such as government reports 
      and published scientific studies) to create a Bayesian Network 
      model. A Bayesian network is a mathematical model that shows the 
      relationship between multiple factors and how they can influence the 
      chance of something occurring. Examples of how these chances are 
      calculated can be found <a rel="noreferrer" target="_blank" href="/docs/AstraZeneca_and_Pfizer_Model_Manual_Calculations.pdf">here for Astrazeneca vaccine</a>  and <a rel="noreferrer" target="_blank" href="/docs/Pfizer_Model_Manual_Calculations.pdf">here for the Pfizer vaccine</a>.  
      The data sources used and assumptions are listed <a rel="noreferrer" target="_blank" href="/docs/astrazeneca_assumptions_11_03_22.pdf">here for Astrazeneca vaccine</a> and <a rel="noreferrer" target="_blank" href="/docs/pfizer_assumptions_11_03_22.pdf">here for the Pfizer vaccine</a>.
      </>,
  },
  {
    question: "Why are health conditions that can affect the chances of getting complications from COVID-19 (e.g. obesity, diabetes, cardiovascular disease, immunosuppression etc) not included in this calculator?",
    answer: `We are currently designing an updated model and calculator that takes these factors into account. We plan to release this new version as soon as possible.`,
  },
  {
    question: "Will future versions include other outcomes of COVID-19 (e.g. hospitalisation, ICU admission, long COVID, etc)?",
    answer: `Yes. We will release these versions as data become available. `,
  },
  {
    question: "What viral variant is the calculator based upon? ",
    answer: `The current calculator assumes that 100% of COVID-19 cases are caused by the Omicron variant. Should this change in the future we will look to update the calculator accordingly. `,
  },
  {
    question: "What are the chances of each outcome for someone who has had a prior COVID-19 infection with or without vaccination?",
    answer: ` COVID-19 can induce an immune response that may give people some protection from getting COVID-19 again. We are currently collecting the latest available data on this and plan to update CoRiCAL once we have enough evidence.`,
  },
  {
    question: "Are the rates given per whole population or are the rates per the relevant age group population?",
    answer: `The rates are displayed either as number per million people of the selected age group and sex, or as a 1 in a number chance of the event for the selected age group and sex. `,
  },
  {
    question: "Why is the risk of dying different between the risk charts and the interactive calculator? ",
    answer: `This is because the interactive calculator is the latest update and assumes 100% of cases are Omicron. The risk charts were designed in January 2022 and when it was assumed that 10% of cases were Delta and 90% of cases were Omicron. `,
  },
  {
    question: "Is the calculator based on Australian data? ",
    answer: <> We have used Australian data sources where possible. Where 
      Australian data is not available, we have used overseas data. 
      All data sources are shown here (see  
      <a rel="noreferrer" target="_blank" href="/docs/pfizer_assumptions_11_03_22.pdf"> Pfizer data sources </a> 
      and <a rel="noreferrer" target="_blank" href="/docs/astrazeneca_assumptions_11_03_22.pdf"> AstraZeneca data
      sources </a>). </>,
  },
  {
    question: "What are assumptions?",
    answer: `Unfortunately there is not always data available to fit every situation. For example, data is usually presented for age groups rather than for every age. We make the assumption that the chances are the same for every age in the age group.`,
  },
  {
    question: "What are the most common side-effects of the COVID-19 vaccines?",
    answer: <> According to <a rel="noreferrer" target="_blank" href="https://www.sciencedirect.com/science/article/pii/S1473309921002243"> 
    a study of more than 600,000 people in the UK </a> local side-effects 
    were reported by 71·9% of people after the first dose of the Pfizer COVID-19 
    vaccine, by 68·5% after the second dose of Pfizer COVID-19 vaccine, and by 
    58·7% after the first dose of AstraZeneca COVID-19 vaccine. Pain around the 
    injection site was the most frequently reported local effect, occurring most 
    often the day after injection. </>,
  },
  {
    question: "Does the calculator get any funding from pharmaceutical companies?",
    answer: `This calculator receives funding from the Immunisation Coalition who in turn receives educational grants from pharmaceutical companies that manufacture vaccines.  However, the CoRiCal project has not received any direct funding from AstraZeneca, Moderna, Pfizer, or any other companies that produce COVID-19 vaccines. `,
  },
  {
    question: "Does the calculator get any funding from governments?",
    answer: `No, the calculator is not funded by any governments. Many contributors (including both clinicians and academics) work on the calculator in their free time. `,
  },
  {
    question: "Is the calculator designed to push vaccination?",
    answer: `No. While there is support from the Immunisation Coalition, the calculator has been developed by researchers and clinicians who are not employed by the Immunisation Coalition (or vaccine manufacturers) and have not received any specific instructions as to the content. The risk estimates that have been used are provided. The estimates are changed if the evidence changes. 
    The main purpose of the calculator is to help people with talking and making a decision about getting a COVID-19 vaccination. You may want to discuss this information further with your vaccine provider (e.g. GP, practice nurse). `,
  },
  {
    question: "Where can I get more information about the calculator CoRiCal?",
    answer: <> If you would like to get some information or offer feedback, 
    please complete form via <a href="https://forms.gle/8DW7NRF5z3JE8JCGA"> this link </a>. 
    You will need to include your email address if you would like someone to get back to you.
    </>
  },
  {
    question: "Where can I get information about treatments for COVID-19?",
    answer: <>  Information about treatment for COVID-a9 can be found at the Australian Department of 
      Health Website (<a rel="noreferrer" target="_blank" href="https://www.health.gov.au/health-alerts/covid-19/treatments"> 
      https://www.health.gov.au/health-alerts/covid-19/treatments </a>). </>,
  },
  {
    question: "What is myocarditis?",
    answer: `Myocarditis is inflammation of the heart. Pericarditis is inflammation of the lining around the heart. There are many possible causes of myocarditis and pericarditis. COVID-19 can cause myocarditis and pericarditis is some people. Myocarditis and pericarditis are also rare complications after vaccination with some COVID-19 vaccine.`,
  },
];


