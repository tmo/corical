import { Box, Container, Typography } from "@material-ui/core";
import Form from "./Form";
import { compute } from "./api";

export default function App() {
  return (
    <Box>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1">
          CoRiCal: Covid Risk Calculator
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          By, credits line, etc.
        </Typography>
        <Form callback={compute} />
      </Container>
    </Box>
  );
}
