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
        <Box py={22} style={{ backgroundColor: "#efecf2" }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" paragraph>
              {title}
            </Typography>
            <Typography variant="caption" paragraph>
              <ul>
                <li>
                  CoRiCal aims to help people make informed decisions about the
                  risks versus benefits of COVID-19 vaccines.
                </li>
                <li>
                  These risks and benefits vary depending on age, sex, the
                  number of doses of vaccine received, and the level of
                  community transmission.
                </li>
                <li>
                  It is important to note that these are estimates of the
                  average chance for people of your sex and age group, and does
                  not take into account individual factors such as medical
                  conditions (e.g. diabetes, obesity) or exposure risks (e.g.
                  occupation).
                </li>
                <li>
                  The Moderna vaccine has similar effectiveness as the Pfizer 
                  vaccine when used for the third (booster) dose.
                </li>
                <li>
                  Calculations are based on the best data currently available,  
                  and will be updated as new evidence emerges.
                </li>
                <li>
                  Last updated on 18/02/2022. 
                  Estimates based on an assumed distribution of 100% Omicron 
                  variant.
                </li>
                <li>
                  In Australia, there have been no COVID-19 related deaths in 
                  females aged 10-39 years or males aged 10-19 years from 
                  18/11/2021 to 17/01/2022.  Therefore, the calculator shows 
                  an extremely low risk of dying for both vaccinated and 
                  unvaccinated people in these groups.  However, vaccines are 
                  still very beneficial for reducing the risk of symptomatic 
                  infection and severe illness.
                </li>
              </ul>
            </Typography>
          </Container>
        </Box>
        <Box my={4}>
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
                href="/docs/pfizer_assumptions_18_02_22.pdf"
              >
                Pfizer data sources
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                rel="noreferrer" 
                target="_blank"
                href="/docs/astrazeneca_assumptions_18_02_22.pdf"
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
              <b>Development of interactive tool</b>:{" "}
              <a
                href="https://www.aapelivuorinen.com"
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                Aapeli Vuorinen
              </a>, Tina Moghaddam
              <br />
              <b>Subject expertise</b>: Andrew Baird, Anoop Enjeti, Colleen Lau,
              John Litt, Raj Puranik, Kirsty Short, Hassan Vally, Sudhir Wahi
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
              Sinclair, Hassan Vally, Aapeli Vuorinen
              <br />
              <b>Risk Communication</b>: Carys Batcup, Carissa Bonner, 
              Colleen Lau, John Litt, Kirsty Short, Jane Sinclair
              <br />
              <b>Administration and management</b>: Andrew Baird, Jayne Geddes,
              John Litt, Kim Sampson, Kirsty Short
              <br />
            </Typography>
            <Box py={5}>
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="https://forms.gle/8DW7NRF5z3JE8JCGA"
              >
                Feedback or comments?
              </Button>
            </Box>
            <Box>&copy; 2022 Immunisation Coalition. </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
