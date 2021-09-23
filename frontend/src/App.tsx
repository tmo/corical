import { useState } from "react";
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
import Form from "./Form";
import { FormData, compute } from "./api";
import Output from "./Output";
import { Alert, AlertTitle } from "@material-ui/lab/";
import { BY_LINE, TITLE } from "./constants";

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

export default function App() {
  const [output, setOutput] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const callback = async (form: FormData) => {
    setError(null);
    try {
      const res = await compute(form);
      setOutput(res);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };
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
              {TITLE}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {BY_LINE}
            </Typography>
            <Alert severity="warning">
              <AlertTitle>Early prototype! Not official!</AlertTitle>
              This is an early prototype and is under heavy development. This is
              not an official Immunisation Coalition service!
            </Alert>
          </Container>
        </Box>
        <Box my={4}>
          <Container maxWidth="lg">
            <Form callback={callback} />
            {error ? (
              <Alert severity="error">
                <AlertTitle>An error occured</AlertTitle>
                {error}
              </Alert>
            ) : (
              <Output output={output} />
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
