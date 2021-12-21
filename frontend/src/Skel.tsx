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
                  CoRiCal calculates estimates of the chance of different
                  outcomes for your age and sex group per million people.
                </li>
                <li>
                  It is important to note that these are estimates of the
                  average chance for people of your sex and age group, and does
                  not take into account individual factors such as medical
                  conditions (e.g. diabetes, obesity) or exposure risks (e.g.
                  occupation).
                </li>
                <li>
                  Please remember that even if there might be low community
                  transmission in your state now, this is most likely to
                  increase over time as lockdowns end and borders reopen.
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
                href="/docs/pfizer_assumptions.pdf"
              >
                Pfizer data sources
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="https://doi.org/10.1016/j.vaccine.2021.10.079"
              >
                AstraZeneca data sources
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="/docs/relatable_risks.pdf"
              >
                Relatable risks
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="/docs/tts_information.pdf"
              >
                Information on TTS
              </Button>{" "}
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="https://www.immunisationcoalition.org.au/resources/corical/"
              >
                Printable summary graphs
              </Button>
            </Box>
            <Typography variant="caption" paragraph>
              <b>CoRiCal co-chairs</b>: Andrew Baird, John Litt, Kirsty Short
              <br />
              <b>Project conception</b>: Andrew Baird, John Litt, Kirsty Short
              <br />
              <b>Development of interactive tool</b>:{" "}
              <a
                href="https://www.aapelivuorinen.com"
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                Aapeli Vuorinen
              </a>
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
            <Box>&copy; 2021 Immunisation Coalition. </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
