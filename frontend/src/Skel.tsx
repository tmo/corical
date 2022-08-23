import {
  Box,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Button,
  Grid,
} from "@material-ui/core";

const theme = createTheme({
  palette: {
    common: {
      black: "rgb(51, 51, 51)",
    },
    primary: {
      main: "#c25a5e",
    },
    secondary: {
      main: "#2e2739",
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    caption: {
      fontSize: 14,
    },
    subtitle1: {
      fontWeight: 700,
    },
    subtitle2: {
      fontWeight: 700,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
  },
});

interface SkelProps {
  title: string;
  subtitle: React.ReactNode | string;
  children: React.ReactNode;
}

export default function Skel({ title, subtitle, children }: SkelProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="inherit">
        <Container maxWidth="lg">
          <Toolbar>
            <a
              href="https://www.immunisationcoalition.org.au/"
              style={{ flexGrow: 1 }}
            >
              <img
                style={{ padding: "15px 0", height: "70px" }}
                src="/ic-logo-with-text.png"
                alt="Immunisation Coalition Advocating for Immunisation Across the Lifespan"
              />
            </a>
            <Button
              color="primary"
              href="https://www.immunisationcoalition.org.au/"
            >
              Home
            </Button>
            <Button
              color="primary"
              href="https://www.immunisationcoalition.org.au/disclaimer/"
            >
              Disclaimer
            </Button>
            <Button
              color="primary"
              href="https://www.immunisationcoalition.org.au/privacy-policy/"
            >
              Privacy policy
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Box>
        <Box pt={17} pb={2} style={{ backgroundColor: "#efecf2"  }}>
          <Container maxWidth="lg" style={{ backgroundImage: "url('/logos/CoricalBoat_logo.png')",
                                            backgroundSize: "17%",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right center",
                                            }}>
            <Typography variant="h4" component="h1" paragraph>
              {title}
            </Typography>
            <Grid container spacing={1}>
            <Grid item xs={10} >
            <Typography variant="caption" paragraph>
              <ul>
                <li>
                  CoRiCal is a tool to help people who are not sure about getting 
                  the COVID-19 vaccines. It tells you how the vaccine can reduce 
                  your chances of getting or dying from COVID-19. It also shows 
                  the chances of developing certain rare conditions from the vaccines.
                </li>
                <li>
                  The benefits and risks of the vaccines vary because of many 
                  reasons. Some of these are: your age, your sex, how many 
                  vaccines you have had, which vaccine(s) you have had, and the 
                  number of COVID-19 cases in your community.
                </li>
                <li>
                  The tool shows you what your chances are of getting sick based 
                  on your age and sex. It shows you the risk out of a million 
                  people, or a one in x chance. You can choose which way the 
                  results are displayed for each calculator by clicking on the 
                  tabs for ‘Show risk per million people’ or ‘Show risk as a chance’.
                </li>
                <li>
                  Note that the chances shown are only a rough guide. 
                  The tool shows the average chance for people who are the same 
                  sex and age as you. It does not use other factors, like any 
                  health problems you have, such as heart problems or diabetes. 
                  It also does not know if you live or work in a place with more COVID-19 
                  cases, or if you have a job that puts you in contact with a lot 
                  of people. These things may change your chances of getting 
                  COVID-19 or dying from it.
                </li>
                <li>
                  Even if there are not many cases in your community right now, 
                  this can change. The number of cases can go up quickly at any 
                  time. So when you make your decision about getting the COVID-19 
                  vaccine, you should also think about possible cases in the future. 
                </li>
                <li>
                  The Moderna vaccine has similar effectiveness as the Pfizer 
                  vaccine when used for the third (booster) dose.
                </li>
                <li>
                  Last updated on 11/03/2022. 
                  Estimates based on an assumed distribution of 100% Omicron 
                  variant.
                </li>
              </ul>

              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="/whatsnew"
              >
                What's New!
              </Button>{" "}
            </Typography>
            </Grid>
            {/* <Grid item xs={3} >
            <Container maxWidth="lg">
              <img
                style={{ padding: "15px 0", height: "100px" }}
                src="/logos/CoRiCal_logo.png"
                alt="CoRiCal: Covid Risk Calculator"
              />
            </Container>
            </Grid> */}
            </Grid>
          </Container>
        </Box>
        <Box mt={4} mb={2}>
          <Container maxWidth="lg">
            {children}
            <Box py={5}>
            <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="/faq"
              >
                FAQ
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                rel="noreferrer" 
                target="_blank"
                href="/docs/pfizer_assumptions_11_03_22.pdf"
              >
                Pfizer data sources
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                rel="noreferrer" 
                target="_blank"
                href="/docs/astrazeneca_assumptions_11_03_22.pdf"
              >
                AstraZeneca data sources
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="/publications"
              >
                Publications
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                rel="noreferrer" 
                target="_blank"
                href="/docs/relatable_risks.pdf"
              >
                Relatable risks
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                rel="noreferrer" 
                target="_blank"
                href="/docs/tts_information.pdf"
              >
                Information on TTS
              </Button>{" "}
            </Box>
            <Typography variant="caption" paragraph>
              <b>CoRiCal co-chairs</b>: Andrew Baird, Colleen Lau, John Litt, Kirsty Short
              <br />
              <b>Project conception</b>: Andrew Baird, John Litt, Kirsty Short
              <br />
              <b>Web Development</b>:{" "}
              <a
                href="https://www.aapelivuorinen.com"
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                Aapeli Vuorinen
              </a>, Tina Moghaddam
              <br />
              <b>Subject expertise</b>: Andrew Baird, Anoop Enjeti, Colleen Lau,
              John Litt, Raj Puranik, Kirsty Short, Sudhir Wahi
              <br />
              <b>Model design</b>: Colleen Lau, Helen Mayfield, Kerrie Mengersen
              <br />
              <b>Data acquisition</b>: Andrew Baird, Anoop Enjeti, Colleen Lau,
              John Litt, Helen Mayfield, Kirsty Short
              <br />
              <b>Data analysis</b>: Samuel Brown, Colleen Lau, Helen Mayfield,
              Kerrie Mengersen, Jane Sinclair, Michael Waller
              <br />
              <b>Data visualisation and communication</b>: Kirsty Short, Jane
              Sinclair, Aapeli Vuorinen
              <br />
              <b>Risk Communication</b>: Carys Batcup, Carissa Bonner, 
              Colleen Lau, John Litt, Kirsty Short, Jane Sinclair, Hassan Vally
              <br />
              <b>Administration and project management</b>: Andrew Baird, Jayne Geddes,
              John Litt, Helen Mayfield, Kim Sampson, Kirsty Short
              <br />
            </Typography>
            <Box pt={5} pb={1}>
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="https://forms.gle/8DW7NRF5z3JE8JCGA"
              >
                Feedback or comments?
              </Button>
            </Box>
          </Container>
        </Box>
        <Container maxWidth="lg">
          <Box mb={7}> <b> Collaborating institutions </b> </Box>
          <Grid container spacing={2}>
            <Grid item xs={2} >
              <img
                style={{ padding: "0px 0", height: "80px", verticalAlign: "middle" }}
                src="/logos/UQ_logo_s.png"
                alt="University of Queensland"
              />
            </Grid>
            <Grid item xs={2} >
              <img
                style={{ padding: "5px 0", height: "60px", verticalAlign: "middle" }}
                src="/logos/FU_logo.jpg"
                alt="Flinders University"
              />
            </Grid>
            <Grid item xs={2} >
              <img
                style={{ padding: "5px 0", height: "50px", verticalAlign: "middle" }}
                src="/logos/QUT_logo_White_c.png"
                alt="Queensland University of Technology"
              />
            </Grid>
            <Grid item xs={2} >
              <img
                style={{ padding: "5px 0", height: "60px", verticalAlign: "middle" }}
                src="/logos/USYD_logo.png"
                alt="University of Sydney"
              />
            </Grid>
            <Grid item xs={2} >
              <img
                style={{ padding: "5px 0px", width: "120px", verticalAlign: "middle" }}
                src="/logos/Bayesfusion_logo.jpg"
                alt="BayesFusion"
              />
            </Grid>
          </Grid>
          <Box mt={3} mb={2}>&copy; 2022 Immunisation Coalition. </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

