import { Typography } from "@material-ui/core";
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab/";
import {
  DESCRIPTION_LABEL,
  LESS_THAN_TENTH_MILLION,
  RISK_LABEL,
  RISK_PER_MILLION,
  RISK_TEXT,
  STEP2_HELPER,
  STEP2_SUBMIT_FORM_FIRST,
  STEP2_TITLE,
  ZERO_RISK,
} from "./constants";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Tooltip,
  LabelList,
} from "recharts";

const useStyles = makeStyles((theme) => ({
  message: {
    margin: "2rem 1rem",
  },
  tableContainer: {
    marginTop: "3rem",
    marginBottom: "3rem",
  },
  table: {
    minWidth: 650,
  },
  abbr: {
    textDecoration: "none",
  },
  tooltip: {
    padding: "10px",
    backgroundColor: "white",
    border: "1px solid black",
  },
}));

type OutputProps = {
  output: any;
};

function displayRisk(value: number) {
  if (value <= 0.0) {
    return "0";
  }
  const sigfigs = 2;
  const digits = Math.ceil(Math.log10(value));

  // this avoids some floating point issues!
  const mul = 10 ** (digits - sigfigs);
  const div = 10 ** (sigfigs - digits);
  const rounded = Math.round(value / mul) / div;

  if (rounded < 100) {
    return rounded.toString();
  }

  const [l] = rounded.toString().split(".");
  const out: Array<string> = [];

  for (let i = 1; i <= l.length; ++i) {
    const dig = l[l.length - i];
    out.push(dig);
    if (i % 3 === 0 && i < l.length) {
      out.push(",");
    }
  }

  return out.reverse().join("");
}

export function RiskDisplay({ risk }: { risk: number }) {
  const classes = useStyles();

  const riskPerMillion = risk * 1e6;
  const roundedRiskPerMillion = displayRisk(riskPerMillion);
  const roundedRiskPerMillionLotsOfDigits =
    Math.round(riskPerMillion * 1e6) / 1e6;

  let textRepresentation = `${roundedRiskPerMillion} ${RISK_PER_MILLION}`;
  if (riskPerMillion === 0.0) {
    textRepresentation = ZERO_RISK;
  } else if (roundedRiskPerMillionLotsOfDigits < 0.1) {
    textRepresentation = LESS_THAN_TENTH_MILLION;
  }

  return (
    <abbr
      title={roundedRiskPerMillionLotsOfDigits.toString()}
      className={classes.abbr}
    >
      {textRepresentation}
    </abbr>
  );
}

export default function Form({ output }: OutputProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" component="h2">
        {STEP2_TITLE}
      </Typography>
      {output ? (
        <>
          <Typography variant="body1" paragraph>
            {STEP2_HELPER}
          </Typography>
          {output.messages?.map(({ heading, text, severity }: any) => (
            <Alert key={text} severity={severity} className={classes.message}>
              <AlertTitle>{heading}</AlertTitle>
              {text}
            </Alert>
          ))}

          {output.bar_graphs?.map(({ title, subtitle, risks }: any) => {
            let multiplier = 1e6;
            const data = risks.map(({ label, risk, is_relatable }: any) => {
              return {
                label,
                risk: multiplier * risk,
                fill: is_relatable ? "#ccc" : "#413ea0",
                display_risk: displayRisk(multiplier * risk),
              };
            });
            return (
              <div key={title}>
                <Typography variant="h6" component="h3">
                  {title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {subtitle}
                </Typography>

                <ComposedChart
                  layout="vertical"
                  width={1000}
                  height={400}
                  data={data}
                  margin={{
                    top: 20,
                    right: 80,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis type="number" label={RISK_TEXT} height={100} />
                  <YAxis
                    dataKey="label"
                    type="category"
                    scale="band"
                    width={400}
                  />
                  <Bar dataKey="risk" barSize={30}>
                    <LabelList dataKey="display_risk" position="right" />
                  </Bar>
                  <Tooltip
                    content={({ label, payload, active }) => {
                      if (active && payload && payload.length) {
                        const { value } = payload![0] as any;
                        return (
                          <div className={classes.tooltip}>
                            {label}
                            <br />
                            {RISK_TEXT}: {displayRisk(value)}
                          </div>
                        );
                      } else {
                        return null;
                      }
                    }}
                  />
                </ComposedChart>
              </div>
            );
          })}

          {output.output_groups?.map(({ heading, explanation, risks }: any) => (
            <div key={heading}>
              <Typography variant="h6" component="h3">
                {heading}
              </Typography>
              <Typography variant="body1" paragraph>
                {explanation}
              </Typography>
              <TableContainer
                className={classes.tableContainer}
                component={Paper}
              >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{DESCRIPTION_LABEL}</TableCell>
                      <TableCell>{RISK_LABEL}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {risks.map(({ name, risk, comment }: any) => (
                      <TableRow key={name}>
                        <TableCell component="th" scope="row">
                          {name}
                        </TableCell>
                        <TableCell>
                          <RiskDisplay risk={risk} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))}
        </>
      ) : (
        <Typography variant="body1" gutterBottom>
          {STEP2_SUBMIT_FORM_FIRST}
        </Typography>
      )}
    </>
  );
}
