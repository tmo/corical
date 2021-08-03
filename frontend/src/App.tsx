import { useState } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import Form from "./Form";
import { FormData, compute } from "./api";
import Output from "./Output";
import { Alert, AlertTitle } from "@material-ui/lab/";

export default function App() {
  const [msg, setMsg] = useState("");
  const [output, setOutput] = useState<any | null>(null);
  const callback = async (form: FormData) => {
    const res = await compute(form);
    setMsg(res.msg);
    setOutput(res);
  };
  return (
    <Box>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1">
          CoRiCal: Covid Risk Calculator
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          By, credits line, etc.
        </Typography>
        <Alert severity="error">
          <AlertTitle>Early prototype!</AlertTitle>
          This is an early prototype and is under heavy development.
        </Alert>
        <p>Debugging info:</p>
        <pre>{msg}</pre>
        <Form callback={callback} />
        <Output output={output} />
      </Container>
    </Box>
  );
}
