import { useState } from "react";
import TTSForm from "./TTSForm";
import PfizerForm from "./PfizerForm";
import PfizerChildrenForm from "./PfizerChildrenForm";
import { TTSFormData, PfizerFormData, computeTts, computePfizer, computePfizerChildren } from "./api";
import Output from "./Output";
import { Alert, AlertTitle } from "@material-ui/lab/";
import { BY_LINE, TITLE } from "./constants";
import Skel from "./Skel";
import { 
  Button , 
  Typography,   
  Box,
  Container,
} from "@material-ui/core";
import { Link, Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { FAQ_ITEMS }  from "./FAQ";
import { RELEASE_NOTES } from "./ReleaseNotes" ;

function IndexRoute() {
  return (
    <>
      <h1>Choose a risk calculator</h1>
      <Box mb={4}>
      <h2>First dose Pfizer - Omicron Variant, updated 11/03/2022</h2>
      <Button component={Link} to="/pfizer" color="primary" variant="contained">
        Pfizer calculator
      </Button>
      </Box>
      <Box mb={5}>
      <h2>First dose AstraZeneca - Omicron Variant, updated 11/03/2022</h2>
      <Button
        component={Link}
        to="/astrazeneca"
        color="primary"
        variant="contained"
      >
        AstraZeneca calculator
      </Button>
      </Box>
      <Box mb={5}>
      <h2>Pfizer for Children - Omicron Variant, updated 27/05/2022</h2>
      <Button
        component={Link}
        to="/pfizer_children"
        color="primary"
        variant="contained"
      >
        Children's calculator
      </Button>
      </Box>
    </>
  );
}

function RiskChartRoute() {
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
      <h1>View risk chart </h1>
      <h2>Risk of dying from COVID-19 based on age, sex, and vaccination status - 90% Omicron/10% Delta Variants, updated January 2022</h2>
      <Button
        href="https://www.immunisationcoalition.org.au/wp-content/uploads/2021/05/2022_03_24_Covid-risk-chart-MJA.pdf"
        color="primary"
        variant="contained"
        rel="noreferrer" 
        target="_blank"
      >
        Risk chart
      </Button>
      
    </>
  );
}

function PfizerRoute() {
  const [error, setError] = useState<string | null>(null);
  const [pfizerOutput, setPfizerOutput] = useState<any | null>(null);
  const pfizerCallback = async (form: PfizerFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computePfizer(form);
      setPfizerOutput(res);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator selection
      </Button>
      <PfizerForm callback={pfizerCallback} />
      {error ? (
        <Alert severity="error">
          <AlertTitle>An error occured</AlertTitle>
          {error}
        </Alert>
      ) : (
        <Output output={pfizerOutput} />
      )}
    </>
  );
}

function PfizerChildrenRoute() {
  const [error, setError] = useState<string | null>(null);
  const [pfizerChildrenOutput, setPfizerChildrenOutput] = useState<any | null>(null);
  const pfizerChildrenCallback = async (form: PfizerFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computePfizerChildren(form);
      setPfizerChildrenOutput(res);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator selection
      </Button>
      <PfizerChildrenForm callback={pfizerChildrenCallback} />
      {error ? (
        <Alert severity="error">
          <AlertTitle>An error occured</AlertTitle>
          {error}
        </Alert>
      ) : (
        <Output output={pfizerChildrenOutput} />
      )}
    </>
  );
}
function AZRoute() {
  const [error, setError] = useState<string | null>(null);
  const [ttsOutput, setTTSOutput] = useState<any | null>(null);
  const ttsCallback = async (form: TTSFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computeTts(form);
      setTTSOutput(res);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator selection
      </Button>
      <TTSForm callback={ttsCallback} />
      {error ? (
        <Alert severity="error">
          <AlertTitle>An error occured</AlertTitle>
          {error}
        </Alert>
      ) : (
        <Output output={ttsOutput} />
      )}
    </>
  );
}

function PubRoute() {
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
      <Box my={4}>
        <h1>Publications</h1>
        <Container maxWidth="lg">
          <h2>Peer Reviewed</h2>
          <Container maxWidth="lg">
            <Typography>
              Lau, C. L., H. J. Mayfield, J. E. Sinclair, S. J. Brown, M. Waller, 
              A. K. Enjeti, A. Baird, K. Short, K. Mengersen and J. Litt (2021). 
              "Risk-benefit analysis of the AstraZeneca COVID-19 vaccine in Australia 
              using a Bayesian network modelling framework." Vaccine.  
              <a
                href="https://doi.org/10.1016/j.vaccine.2021.10.079"
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >https://doi.org/10.1016/j.vaccine.2021.10.079</a>
              <br />
              <br />
              Mayfield H.J., Lau C.L., Sinclair J.E., Brown S.J., Baird A., 
              Litt J., Vuorinen A., Short K.R., Waller M., Mengersen K. 
              Designing an evidence-based Bayesian network for estimating the 
              risk versus benefits of AstraZeneca COVID-19 vaccine. Vaccine. 
              2022;40(22):3072-84. doi: 
              <a
                href="https://doi.org/10.1016/j.vaccine.2022.04.004" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >https://doi.org/10.1016/j.vaccine.2022.04.004</a>
              <br />
              <br />
              Sinclair J.E., Mayfield H.J., Short K.R., Brown S.J., Puranik R., 
              Mengersen K., Litt J.C.B., Lau C.L. A Bayesian network analysis 
              quantifying risks versus benefits of the Pfizer COVID-19 vaccine 
              in Australia. npj Vaccines. 2022;7(1):93. 
              doi: 
              <a
                href="https://doi.org/10.1038/s41541-022-00517-6" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >https://doi.org/10.1038/s41541-022-00517-6</a>
            </Typography>
          </Container>
        </Container>
      </Box>
    </>
  );
}

function FaqRoute() {
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
      <Box my={4}>
        <h1>FAQs</h1>
        <Container maxWidth="lg">
          <Typography>
          {FAQ_ITEMS.map(({ question, answer }) => (
            <>
              <b>{question}</b>
              <br />
              {answer}
              <br />
              <br />
            </>
          ))}
          </Typography>
        </Container>
      </Box>
    </>
  );
}

function StateInfoRoute() {
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
      <Box my={4}>
        <h1>State Case Numbers</h1>
        <Container maxWidth="lg">
          <Typography>
            <p>You can check the curent number of cases in your state from your state's health webpage below: </p>
            <a
                href="https://www.health.nsw.gov.au/" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >New South Wales Health</a><br/>
            <a
                href="https://www.health.vic.gov.au/" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >Victoria Health</a> <br/>
            <a
                href="https://www.health.qld.gov.au/" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >Queensland Health</a><br/>
            <a
                href="https://www.health.wa.gov.au/" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >Western Australia Health</a><br/>
            <a
                href="https://www.sahealth.sa.gov.au/" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >South Australia Health</a><br/>
            <a
                href="https://www.health.tas.gov.au/" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >Tasmania Health</a><br/>
            <a
                href="https://www.health.act.gov.au/" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >Australian Capital Territory Health</a><br/>
            <a
                href="https://health.nt.gov.au" 
                rel="noreferrer" target="_blank"
                style={{ textDecoration: "underline", color: "inherit" }}
                >Northern Territory Health</a><br/>
          </Typography>
        </Container>
      </Box>
    </>
  );
}

function InfoRoute() {
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
      <Box my={4}>
        <h1>More Information</h1>
        <Container maxWidth="lg">
          <Typography>
            <p>
              The pdf files linked in this page contain more information about 
              the models and outputs used in the risk calculators.
            </p>

            <a 
              href="/docs/pfizer_assumptions_11_03_22.pdf"  
              rel="noreferrer" 
              target="_blank"> 
              Assumptions and data sources for the Pfizer model (pdf) 
            </a>
            <br />
            <a 
              href="/docs/astrazeneca_assumptions_11_03_22.pdf" 
              rel="noreferrer" 
              target="_blank"> 
              Assumptions and data sources for the AstraZeneca model (pdf) 
            </a>
            <br />
            <a 
              href="/docs/relatable_risks.pdf"
              rel="noreferrer" 
              target="_blank"> 
              Explanations of the relatable risks used for comparison in the 
              calculator outputs (pdf) 
            </a>
            <br />
            <a 
              href="/docs/tts_information.pdf"
              rel="noreferrer" 
              target="_blank"> 
              Information on TTS (pdf) 
            </a>
          </Typography>
        </Container>
      </Box>
    </>
  );
}

function NewRoute() {
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
      <Box my={4}>
        <h1>What's New</h1>
        <Container maxWidth="lg">
          {RELEASE_NOTES}
        </Container>
      </Box>
    </>
  );
}

function VideoRoute() {
  return (
    <>
      <Button
        component={Link}
        to="/"
        color="primary"
        variant="outlined"
        size="small"
        style={{ margin: "1em" }}
      >
        Back to calculator
      </Button>
      <Box my={4}>
        <h1>Video Overview</h1>
        <p>The CoRiCal team have produced a few short film clips to outline:
        <ul> 
          <li> what is CoRiCal, our COVID-19 Risk calculator, and who has 
            contributed to its construction</li>
          <li> why it was developed,</li>
          <li> why it is both useful and unique,  summarising the strengths of 
            using such a decision-making tool.</li>
          <li> the risk chart for COVID-19 deaths to estimate the likely risk of 
            dying from COVID-19 based upon age, sex and number of COVID-19 vaccine doses.</li>
        </ul>
        There are 4 very brief clips, each about 1 ½ minutes in length. There is 
        one longer film clip (~7 ½ minutes) that puts all these sections together.
        GPs and health care professionals offering COVID-19 vaccines are welcome to 
        download the film clips to their desktop or even consider installing 
        them on the TV in the patient waiting room.
        </p>

        <Container maxWidth="lg">
          <Typography>
          <h2>Full CoRiCal Video</h2>
          <iframe title="main_video" 
            src="https://player.vimeo.com/video/731968709?h=04dfd4374d" 
            width="640" height="360" frameBorder="0" allow="autoplay; 
            fullscreen; picture-in-picture" allowFullScreen></iframe>
          <br />

          <h2>What is CoRiCal? </h2>
          <iframe title="what_video" 
            src="https://player.vimeo.com/video/731969006?h=01779c0ebd" 
            width="640" height="360" frameBorder="0" allow="autoplay; 
            fullscreen; picture-in-picture" allowFullScreen></iframe>
          <br />

          <h2>Why did the academic team develop CoRiCal?</h2>
          <p>A significant number of people ( ~30%) have not had a COVID-19 vaccine 
            booster. This puts them at considerable risk from the more recent 
            Omicron COVID-19 variants as they have little protection.
          Given that nearly 75% of the deaths from COVID-19 have occurred this 
          year and can be attributed to Omicron. 
          </p>
          <iframe title="rationale_video" 
            src="https://player.vimeo.com/video/731969146?h=a6ef24648b" 
            width="640" height="360" frameBorder="0" allow="autoplay; 
            fullscreen; picture-in-picture" allowFullScreen></iframe>
          <br />

          <h2>Strengths of CoRiCal </h2>
          <iframe title="strengths_video" 
            src="https://player.vimeo.com/video/731969339?h=f8fad2c6ee" 
            width="640" height="360" frameBorder="0" allow="autoplay; 
            fullscreen; picture-in-picture" allowFullScreen></iframe>
          <br />

          <h2>Risk of dying from COVID-19</h2>
          <iframe title="risks_video" 
            src="https://player.vimeo.com/video/731968526?h=27f7b80c9f" 
            width="640" height="360" frameBorder="0" allow="autoplay; 
            fullscreen; picture-in-picture" allowFullScreen></iframe>
          <br />

          <h2>Acknowledgements</h2>
          <p>The CoRiCal team are very grateful to Dr Ramesh Manocha and his 
            team HealthEd for graciously providing their film crew to film the 
            CoRiCal clips at no cost. The CoRiCal team are also grateful to 
            Kim Sampson, Jayne Geddes and the team at the Immunisation 
            Coalition in providing ongoing administrative support to the 
            development of CoRiCal.</p>

          </Typography>
        </Container>

      </Box>
    </>
  );
}

export default function App() {
  return (
    <Skel title={TITLE} subtitle={BY_LINE}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexRoute />} />
          <Route path="/riskchart" element={<RiskChartRoute />} />
          <Route path="/pfizer" element={<PfizerRoute />} />
          <Route path="/pfizer_children" element={<PfizerChildrenRoute />} />
          <Route path="/astrazeneca" element={<AZRoute />} />
          <Route path="/publications" element={<PubRoute />} />
          <Route path="/faq" element={<FaqRoute />} />
          <Route path="/whatsnew" element={<NewRoute />} />
          <Route path="/videos" element={<VideoRoute />} />
          <Route path="/moreinfo" element={<InfoRoute />} />
          <Route path="/stateinfo" element={<StateInfoRoute />} />
        </Routes>
      </BrowserRouter>
    </Skel>
  );
}
