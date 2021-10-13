import {
  Box,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Link,
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
              John Litt, Kirsty Short, Hassan Vally
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
          </Container>
        </Box>
        <Box my={4}>
          <Container maxWidth="lg">
            {children}
            <Box py={5}>
              &copy; 2021 Immunisation Coalition.{" "}
              <Link href="/docs/corical_preprint.pdf">Data sources.</Link>{" "}
              <Link href="/docs/relatable_risks.pdf">Relatable risks.</Link>{" "}
              <Link href="/docs/tts_information.pdf">Information on TTS.</Link>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
