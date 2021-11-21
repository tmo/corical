import { useState } from "react";
import TTSForm from "./TTSForm";
import { TTSFormData, computeTts } from "./api";
import Output from "./Output";
import { Alert, AlertTitle } from "@material-ui/lab/";
import { BY_LINE, TITLE } from "./constants";
import Skel from "./Skel";

export default function App() {
  const [output, setOutput] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const callback = async (form: TTSFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computeTts(form);
      setOutput(res);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };
  return (
    <Skel title={TITLE} subtitle={BY_LINE}>
      <>
        <TTSForm callback={callback} />
        {error ? (
          <Alert severity="error">
            <AlertTitle>An error occured</AlertTitle>
            {error}
          </Alert>
        ) : (
          <Output output={output} />
        )}
      </>
    </Skel>
  );
}
