import { useState } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import Form from "./Form";
import { FormData, compute } from "./api";
import Output from "./Output";
import { Alert, AlertTitle } from "@material-ui/lab/";
import { BY_LINE, TITLE } from "./constants";

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
    <Box>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1">
          {TITLE}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {BY_LINE}
        </Typography>
        <Alert severity="warning">
          <AlertTitle>Early prototype! Not official!</AlertTitle>
          This is an early prototype and is under heavy development. This is not an official Immunisation Coalition service!
        </Alert>
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
  );
}
