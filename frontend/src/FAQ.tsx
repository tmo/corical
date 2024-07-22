export const FAQ_ITEMS =  [
  {
    question: "How are the COVID-19 risks calculated? ",
    answer: <> We have used trusted data sources (such as government reports 
      and published scientific studies) to create a Bayesian Network 
      model. A Bayesian network is a mathematical model that shows the 
      relationship between factors and how they influence the 
      chance of something happening. Examples of the CoRiCal model are <a rel="noreferrer" target="_blank" href="/docs/AstraZeneca_and_Pfizer_Model_Manual_Calculations.pdf">here for Astrazeneca vaccine</a>, <a rel="noreferrer" target="_blank" href="/docs/Pfizer_Model_Manual_Calculations.pdf">here for the Pfizer vaccine</a>, 
      and <a rel="noreferrer" target="_blank" href="/docs/Long_Covid_Assumptions_100224.pdf">here for long COVID</a>.  
      The data sources used and assumptions are listed <a rel="noreferrer" target="_blank" href="/docs/astrazeneca_assumptions_11_03_22.pdf">here for Astrazeneca vaccine</a>, <a rel="noreferrer" target="_blank" href="/docs/pfizer_assumptions_10_05_23.pdf">here for the Pfizer vaccine</a>, and <a rel="noreferrer" target="_blank" href="/docs/children_assumptions_26_02_2023.pdf">here for the Paediatric Pfizer vaccine</a>.
      </>,
  },
  {
    question: "Why don’t all the CoRiCal models include health conditions that affect COVID-19 outcomes? (e.g. obesity, diabetes, cardiovascular disease, immunosuppression etc.)",
    answer: `Currently, only the long COVID risk calculator can take these factors into account. This is because of limited data for the other calculators. However, we are working on a new model for the Pfizer COVID-19 vaccine that will take health conditions into account. `,
  },
  {
    question: "Which COVID-19 variant is the calculator based on? ",
    answer: `The current calculator assumes that 100% of COVID-19 cases are caused by the Omicron variant. We may update this in future. `,
  },
  {
    question: "How does having had COVID-19 previously and vaccination affect the outcomes? ",
    answer: `The long COVID risk calculator includes how many times you’ve had COVID-19. COVID-19 can induce an immune response. 
    This may give some short-term protection from getting COVID-19 again. But it may also increase your chance of getting long COVID. 
    For the Pfizer COVID-19 vaccine, we are collecting new data on this and will update CoRiCal once we have enough evidence. `,
  },
  {
    question: "Are the rates given per whole population, or for the relevant age group population? ",
    answer: `The rates are displayed as the number per 1 million people in the selected age and sex group. 
    You can also display the results as a “1 in x” chance for the selected age and sex group.  `,
  },
  {
    question: "Why is the risk of dying different between the risk charts and the interactive calculator?  ",
    answer: `This is because the interactive calculator is the latest update and assumes 100% of cases are caused by the Omicron variant. 
    The risk charts were designed in January 2022, when it was assumed that 10% of cases were Delta and 90% were Omicron.  `,
  },
  {
    question: "Is the calculator based on Australian data? ",
    answer: <> We have used Australian data sources where possible. Where 
      Australian data are not available, we have used overseas data. 
      All data sources are shown here (see  
      <a rel="noreferrer" target="_blank" href="/docs/pfizer_assumptions_10_05_23.pdf"> Pfizer data sources </a>,  
      <a rel="noreferrer" target="_blank" href="/docs/astrazeneca_assumptions_11_03_22.pdf"> AstraZeneca data
      sources </a>, <a rel="noreferrer" target="_blank" href="/docs/Long_Covid_Assumptions_100224.pdf">and long COVID data sources</a>).</>,
  },
  {
    question: "What are the assumptions in the CoRiCal model?",
    answer: <> Unfortunately there is not always data available to fit every situation. For example, if data are not available for specific age groups,
    we have to assume the chance is the same for a wide age group (e.g. 18-60 years). For a full explanation of the assumptions for each calculator, 
    please follow the links in the <a rel="noreferrer" href="/moreinfo">MORE INFO</a>  tab.</>,
  },
  {
    question: "What are the most common side-effects of the COVID-19 vaccines?",
    answer: <> Pain around the injection site is the most frequently reported local side effect, 
    most often the day after injection. According to a study of more than 600,000 people in the UK, local side effects were reported by: 
    <ul>
      <li>71·9% of people after the first dose of the Pfizer COVID-19 vaccine</li>
      <li>68·5% after the second dose of Pfizer COVID-19 vaccine</li>
      <li>58·7% after the first dose of AstraZeneca COVID-19 vaccine</li>
    </ul></>,
  },
  {
    question: "Does the calculator get any funding from pharmaceutical companies?",
    answer: `This calculator receives funding from the Immunisation Coalition, who in turn receives untied educational grants from pharmaceutical companies that manufacture vaccines. 
    However, the CoRiCal project has not received any direct funding from AstraZeneca, Moderna, Pfizer, or any other companies that produce COVID-19 vaccines.  `,
  },
  {
    question: "Does the calculator get any funding from governments?",
    answer: `No, the calculator is not funded by any governments. Nearly all the contributors (including both clinicians and academics) work on the calculator in their free time. 
    A few people are doing the behind-the scenes programming of the Bayesian model. We update the models behind the interactive online tool when substantial new data are available,
     to make it easier for people to use the models. `,
  },
  {
    question: "Is the calculator designed to push vaccination?",
    answer: <> <p>No. The CoRiCal calculator is designed as a shared decision-making tool to help people weigh up the pros and cons of COVID-19 vaccines. 
      It has been developed to simplify complex information about rare outcomes from COVID-19 and vaccines.</p>
      <p>The calculator has been developed by researchers and clinicians who are not employed by the Immunisation Coalition, or vaccine manufacturers. 
        The authors have not received any specific instructions from these organisations about the content. </p>
      <p>The risk estimates that have been used are transparent and listed on the website that hosts the CoRiCal tool. The estimates change when the evidence changes. 
        As stated above, the main purpose of the calculator is to help people discuss and make informed decisions about COVID-19 vaccines. 
        You may want to discuss this information further with your vaccine provider (e.g. GP, pharmacist or nurse). </p>
    </>
  },
  {
    question: "Where can I get more information about the CoRiCal tool? ",
    answer: <> If you would like to get some information or offer feedback, 
    please complete the form via <a href="https://forms.gle/8DW7NRF5z3JE8JCGA"> this link </a>. 
    You will need to include your email address if you would like someone to respond.
    </>
  },
  {
    question: "What is myocarditis?",
    answer: <><p>Myocarditis is inflammation of the heart muscle. Pericarditis is inflammation of the lining around the heart. 
      They can occur separately or at the same time. </p>
      <p>There are many possible causes of myocarditis and pericarditis. COVID-19 can cause myocarditis and/or pericarditis in some people. 
        Myocarditis and pericarditis are also rare complications after some COVID-19 vaccines, e.g., mRNA COVID vaccines made by Moderna or Pfizer. </p>
      <p>Myocarditis and pericarditis are more likely in young males aged 15-40 years, and after the second dose of an mRNA COVID vaccine.</p>
      <p>Myocarditis after COVID-19 is different and often more severe than myocarditis after a vaccine. Most people with myocarditis after a vaccine make a full recovery. </p>
      <p>The risk of myocarditis and pericarditis are much lower in children aged 5 to 11 years compared to adolescents. 
        The risk is also lower after a booster than the initial injections. Symptoms of myocarditis or pericarditis typically appear within 1 to 5 days of vaccination.</p>
      <p>Common symptoms of myocarditis include:</p>
      <ul>
        <li>chest pain</li>
        <li>pressure or discomfort in the chest</li>
        <li>irregular, skipped heartbeats or ‘fluttering’</li>
        <li>fainting</li>
        <li>shortness of breath</li>
        <li>pain when breathing</li>
      </ul>
      <p>If you are concerned about myocarditis and have any of the above symptoms, you should see a health professional.</p>
    </>,
  },
];


