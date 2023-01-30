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
  {
    question: "Information on myocarditis",
    answer: ""
  },
  {
    question: "What is myocarditis?",
    answer: <> Myocarditis is inflammation of the heart, and pericarditis is 
      inflammation of the lining around the heart. It can be caused by a number 
      of viruses. Viral infections are the most commonly identified cause of 
      myocarditis, in particular coxsackieviruses, adenoviruses and parvovirus 
      B19 as well as human immunodeficiency virus (HIV), adenovirus, influenza 
      and hepatitis C. Some viruses infect heart muscle and cause direct injury 
      to the heart, while others cause heart damage indirectly through the 
      immune system.
      <br/><br/>
      Cardiac inflammation and acute/life-threatening myocarditis has also 
      become a well-recognised complication of severe acute respiratory 
      syndrome coronavirus 2 (SARS-CoV-2) infection.
      <br/><br/>
      Before the emergence of COVID-19, the estimated global incidence of acute 
      myocarditis was 1–10 cases per 100,000 people per year.
      </>,
  },
  {
    question: "How often does myocarditis occur after COVID?",
    answer:`One study estimated that myocarditis affects about 40 people out of every 1,000,000 people who test positive for COVID-19, however, myocarditis is much more common in patients hospitalized for COVID-19 (226 per 100,000).`,
  },
  {
    question: "How often does myocarditis occur after receipt of an mRNA vaccine?",
    answer: <> Myocarditis is a known but very rare side effect of Comirnaty 
      (Pfizer) and Spikevax (Moderna). It is usually temporary, with most 
      people getting better within a few days. Myocarditis is reported in 
      around 1-2 in every 100,000 people who receive Comirnaty (Pfizer) and 
      around 2 in every 100,000 of those who receive Spikevax (Moderna). 
      However, it is more common after the second dose in 12-17 year-old boys 
      (13 cases per 100,000 Comirnaty doses and 21 cases per 100,000 Spikevax 
      doses) and men under 30 (9 cases per 100,000 Comirnaty doses and 22 cases 
      per 100,000 Spikevax doses).
      <br/><br/>
      COVID-19 vaccination reduces the relative risk of myocarditis and 
      arrhythmia post COVID.
      <br/><br/>
      To 21 August 2022, the TGA has received 674 reports which have been 
      assessed as likely to be myocarditis from about 43.7 million doses of 
      Comirnaty (Pfizer) and 106 reports which have been assessed as likely 
      to be myocarditis from about 5.3 million doses of Spikevax (Moderna). 
      Reports of myocarditis after a booster dose are very rare, occurring in 
      less than 1 in every 100,000 vaccinated people.
    </>,
  },
  {
    question: "What is the outcome of people who have had myocarditis following an mRNA vaccine?",
    answer: `Most people recover fully with rest and a few days of supportive treatment while being monitored in a hospital.`,
  },
  {
    question: "What is the incidence of myocarditis in children following an mRNA vaccine?",
    answer: `The TGA is also closely monitoring adverse event reports in 5-11 year olds. To 21 August 2022, we have received about 1,620 reports from approximately 2.3 million Comirnaty (Pfizer) and Spikevax (Moderna) doses administered in this age group. The most common reactions reported included chest pain, vomiting, fever, headache and abdominal pain. We have received 38 reports of suspected myocarditis and/or pericarditis in this age group. Following review of the reports, 4 were likely to represent myocarditis and another 7 reports were likely to represent pericarditis.`,
  },
  {
    question: "How is the incidence of myocarditis post-vaccination being monitored in Australia?",
    answer: `The TGA is actively investigating reports of myocarditis (inflammation of the heart) and/or pericarditis (inflammation of the membrane around the heart) associated with mRNA vaccines. TGA are continuing to work with international regulators on this safety signal.`,
  },
  {
    question: "Does myocarditis occur following other COVID vaccines?",
    answer: `The TGA has received a small number of reports of suspected myocarditis and/or pericarditis in people who have received the Nuvaxovid (Novavax) vaccine. After assessing these against a set of internationally accepted criteria, 7 cases were likely to represent myocarditis and 26 were likely to represent pericarditis. As a result of the TGA investigation, the Product Information (PI) for Nuvaxovid (Novavax) has been updated to include pericarditis as a potential adverse event.`,
  },
  {
    question: "What is the risk of myocarditis following COVID when compared with the risk of myocarditis following an mRNA COVID vaccine?",
    answer: `A useful summary table showing the likelihood of myocarditis following either a COVID vaccine or getting COVID is included in the CoRiCal calculator. The table below highlights the incidence of myocarditis following COVID or a COVID vaccine. It is clear that the risk of myocarditis following COVID is much more common than myocarditis following an mRNA COVID vaccine.`,
  },
];


