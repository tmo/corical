import { useState } from "react";
import { Box, Container, Typography } from "@material-ui/core";
import Form from "./Form";
import { FormData, compute } from "./api";

export default function App() {
  const [msg, setMsg] = useState("");
  const callback = async (form: FormData) => {
    const res = await compute(form);
    setMsg(res.msg);
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
        <pre>{msg}</pre>
        <Form callback={callback} />
      </Container>
    </Box>
  );
}
