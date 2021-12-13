import { useState } from "react";
import TTSForm from "./TTSForm";
import PfizerForm from "./PfizerForm";
import { TTSFormData, PfizerFormData, computeTts, computePfizer } from "./api";
import Output from "./Output";
import { Alert, AlertTitle } from "@material-ui/lab/";
import { BY_LINE, TITLE } from "./constants";
import Skel from "./Skel";
import { Button } from "@material-ui/core";

export default function App() {
  const [formS, setFormS] = useState<"tts" | "pfizer" | null>(null);
  const [ttsOutput, setTTSOutput] = useState<any | null>(null);
  const [pfizerOutput, setPfizerOutput] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ttsCallback = async (form: TTSFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computeTts(form);
      setTTSOutput(res);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };
  const pfizerCallback = async (form: PfizerFormData) => {
    setError(null);
    try {
      form.age = Math.round(form.age!);
      const res = await computePfizer(form);
      setPfizerOutput(res);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };
  return (
    <Skel title={TITLE} subtitle={BY_LINE}>
      <>
        {!formS && (
          <>
            <h1>Choose a risk calculator</h1>
            <h2>Pfizer vaccine: risk of myocarditis</h2>
            <Button
              onClick={() => setFormS("pfizer")}
              color="primary"
              variant="contained"
            >
              Pfizer calculator
            </Button>
            <h2>AstraZeneca vaccine: risk of blood clots</h2>
            <Button
              onClick={() => setFormS("tts")}
              color="primary"
              variant="contained"
            >
              AstraZeneca calculator
            </Button>
          </>
        )}
        {formS === "tts" && (
          <>
            <TTSForm callback={ttsCallback} />
            {error ? (
              <Alert severity="error">
                <AlertTitle>An error occured</AlertTitle>
                {error}
              </Alert>
            ) : (
              <Output output={ttsOutput} />
            )}
          </>
        )}
        {formS === "pfizer" && (
          <>
            <PfizerForm callback={pfizerCallback} />
            {error ? (
              <Alert severity="error">
                <AlertTitle>An error occured</AlertTitle>
                {error}
              </Alert>
            ) : (
              <Output output={pfizerOutput} />
            )}
          </>
        )}
      </>
    </Skel>
  );
}
