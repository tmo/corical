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
  COMMENT_LABEL,
  DESCRIPTION_LABEL,
  LESS_THAN_TENTH_MILLION,
  RISK_LABEL,
  RISK_PER_MILLION,
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

export function RiskDisplay({ risk }: { risk: number }) {
  const classes = useStyles();

  const riskPerMillion = risk * 1e6;
  const roundedRiskPerMillion = Math.round(riskPerMillion * 10) / 10;
  const roundedRiskPerMillionLotsOfDigits =
    Math.round(riskPerMillion * 1e6) / 1e6;

  let textRepresentation = `${roundedRiskPerMillion} ${RISK_PER_MILLION}`;
  if (riskPerMillion === 0.0) {
    textRepresentation = ZERO_RISK;
  } else if (roundedRiskPerMillion < 0.1) {
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

  const displayRisk = (value: number, mul = 1e2) =>
    Math.ceil(value * mul) / mul;

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
          {/* <code>{JSON.stringify(output)}</code> */}
          {output.messages?.map(({ heading, text, severity }: any) => (
            <Alert key={text} severity={severity} className={classes.message}>
              <AlertTitle>{heading}</AlertTitle>
              {text}
            </Alert>
          ))}

          {output.bar_graphs?.map(({ title, subtitle, risks }: any) => {
            const max_risk = Math.max(...risks.map(({ risk }: any) => risk));
            let multiplier = 1;
            let xaxis = "Risk";
            if (max_risk < 100e-6) {
              multiplier = 1e6;
              xaxis = "Risk in a million";
            } else if (max_risk < 100e-3) {
              multiplier = 1e3;
              xaxis = "Risk in a thousand";
            }
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
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis type="number" label={xaxis} height={100} />
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
                            {xaxis}: {displayRisk(value, 1e5)}
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
                      <TableCell>{COMMENT_LABEL}</TableCell>
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
                        <TableCell>{comment}</TableCell>
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
