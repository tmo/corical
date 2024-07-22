export const CHILDREN_FAQ_HEADER = <>
  <p>To help parents make informed decisions, we developed a child version of the CoRiCal tool.  Children with weak immune systems should consider a COVID vaccine booster every 12 months, for ages 5 to 17 (ATAGI advice, 2024). 
    A COVID vaccine booster is not recommended for any children under the age of 5 years. </p>
  <p>This frequently asked questions (FAQ) webpage outlines some of the questions that parents have asked about the COVID-19 vaccines. This includes side effects and how likely the COVID-19 vaccine is to prevent serious illness.  </p>
  <p>The information is consistent with ATAGI and the National Centre for Immunisation Research and Surveillance (NCIRS). </p>
</>

export const CHILDREN_FAQ_ITEMS =  [
  {
    question: "Are children at risk of getting COVID-19?",
    answer: "Yes. Everyone is at risk of getting COVID-19. Studies show that children and adolescents can play a role in spreading the SARS-CoV-2 virus. This is the virus that causes COVID-19. Spread between young children is just as common as spread between adults. The Omicron variants of COVID-19 are easier to spread. They cause more cases in children, but do not cause more severe disease. Children are most likely to catch COVID-19 from unvaccinated adults (household or close family) and at school. Children tend to get mild disease, and most do not need to go to hospital. Rarely, around 1 in 3000 children infected with COVID-19 develop a post-COVID inflammatory syndrome that affects many organs in their body. This is called paediatric inflammatory multisystem syndrome temporarily associated with SARS-CoV-2 (PIMS-TS). It is also called multisystem inflammatory syndrome in children (MIS-C). ",
  },
  {
    question: "Which children are most at risk from getting COVID-19?",
    answer: <>Some conditions increase the risk of children needing to go to hospital with COVID-19. This includes:
    <ul>
      <li>diabetes</li>
      <li>congenital heart disease</li>
      <li>chronic pulmonary disease</li>
      <li>neurological diseases</li>
      <li>being born premature</li>
      <li>being overweight</li>
    </ul> </>,
  },
  {
    question: "Should children get the COVID-19 vaccine?",
    answer: <>
      <p>While COVID-19 is mild in most children, a few can become very sick and have long term effects. 
        Children are more likely to become very sick from COVID-19 if they have certain conditions (see list above). 
        The COVID-19 vaccine reduces the chance that a child will get very sick from COVID-19. 
        There is also some evidence that the vaccine reduces the chance of children getting multi-inflammatory syndrome after they catch COVID-19. 
        Children can spread COVID-19 to others, especially members of their family and household. 
        Vaccinated people are less likely to pass on the virus than unvaccinated people. The 2024 ATAGI advice on COVID vaccination boosters is shown below (Table 1).</p>
        <img src="table1.png" alt="table 1"></img>
    </>,
  },
  {
    question: "What are the side effects of the COVID-19 vaccine?",
    answer: <>
      <p>Side effects are not common, but the COVID-19 vaccine can cause local injection-site pain, redness and swelling, headaches or general aches and pains. These side effects usually go away quickly. More severe reactions are very uncommon. A very small number of children get myocarditis (inflammation of the heart muscle) after the COVID-19 vaccine. This is more likely to happen after catching COVID-19 (see above). Myocarditis after getting COVID-19 is more severe than myocarditis after a COVID-19 vaccine.</p>
    </>,
  },
  {
    question: "Do the COVID-19 vaccines reduce the risk of myocarditis and going to hospital?",
    answer: `The chance of getting myocarditis and going to hospital is higher in unvaccinated children who catch COVID-19. The best protection is provided by having at least two doses of a COVID-19 vaccine. The vaccine also reduces the risk of multi-inflammatory syndrome after catching COVID-19. `,
  },
  {
    question: "Why does the kids model only look at the Pfizer vaccine?",
    answer: <><p>In Australia, the Pfizer COVID-19 vaccine is approved and available for children aged over 5 years. The Moderna COVID-19 vaccine is registered and available for children ≥ 12 years. 
    This is based on 2024 ATAGI advice. See their <a href="https://www.health.gov.au/our-work/covid-19-vaccines/getting-your-vaccination#:~:text=Regular%20COVID%2D19%20vaccinations%20(also,risk%20of%20severe%20COVID%2D19">website</a> for the most up-to-date information. </p>
    <p>Novavax XBB.1.5 vaccine was not available when this model was developed. The original Novavax vaccine can be given to people aged 12 years and older, but ATAGI suggests that XBB.1.5-based vaccines are preferred. See their <a href="https://www.health.gov.au/news/atagi-recommendations-on-use-of-the-moderna-and-pfizer-monovalent-omicron-xbb15-covid-19-vaccines ">website</a> for more information. </p></>
  }
];

export const CHILDREN_FAQ_REFS = <>
  <ol>
    <li>
      <a
        href="https://www.health.gov.au/our-work/covid-19-vaccines/who-can-get-vaccinated/children#:~:text=ATAGI%20recommends%20that%20everyone%20aged,eligible%20for%20COVID%2D19%20vaccination"
        rel="noreferrer" target="_blank" >
          https://www.health.gov.au/our-work/covid-19-vaccines/who-can-get-vaccinated/children#
      </a>
    </li>
    <li>
      <a
        href="https://www.ncirs.org.au/covid-19-decision-aid-for-children/risks?lang=en "
        rel="noreferrer" target="_blank" >
          https://www.ncirs.org.au/covid-19-decision-aid-for-children/risks?lang=en 
      </a>
    </li>
    <li>
      <a
        href="https://www.ncirs.org.au/covid-19/covid-19-and-children-frequently-asked-questions#:~:text=However%2C%20children%205%20years%20of,or%20a%20COVID%2D19%20vaccination"
        rel="noreferrer" target="_blank" >
          https://www.ncirs.org.au/covid-19/covid-19-and-children-frequently-asked-questions#
      </a>
    </li>
  </ol>
</>