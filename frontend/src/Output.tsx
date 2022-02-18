import { Typography } from "@material-ui/core";
import {
  makeStyles,
  Table,
  TableBody,
  Button,
  TableCell,
  TableContainer,
  Box,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Paper,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab/";
import {
  DESCRIPTION_LABEL,
  LESS_THAN_TENTH_MILLION,
  LESS_THAN_TENTH_MILLION_IN_X,
  RISK_LABEL,
  RISK_PER_MILLION,
  RISK_TEXT,
  INFOBOX_RISK_TEXT,
  STEP2_HELPER,
  STEP2_SUBMIT_FORM_FIRST,
  STEP2_TITLE,
  ZERO_RISK,
  ZERO_RISK_IN_X,
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
import { useState } from "react";

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
  centeredTabRoot: {
    flexGrow: 1,
    marginBottom: "2em",
  },
}));

type OutputProps = {
  output: any;
};

function formatNumber(value: number) {
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

function displayRisk(value: number, one_in_x: boolean, label?: string) {
  if (value <= 0.0) {
    if ((typeof label !== 'undefined') && label.includes("dying from COVID-19")) {
      return "No deaths reported in Australia in this group from 18/11/21 to 17/01/22";
    }
    else if (!one_in_x) {
      return "less than  0.0001 (extremely rare)";
    } else {
      return "less than 0.0001 in a million (extremely rare)";
    }
  }
  
  if (!one_in_x) {
    return formatNumber(value * 1e6);
  } else {
    const onval = 1 / value;
    if (onval > 1e6) {
      return "1 in " + formatNumber(onval / 1e6) + " million";
    } else {
      return "1 in " + formatNumber(onval);
    }
  }
}

export function RiskDisplay({
  risk,
  oneInX,
}: {
  risk: number;
  oneInX: boolean;
}) {
  const classes = useStyles();

  const riskPerMillion = risk * 1e6;
  const roundedRisk = displayRisk(risk, oneInX);
  const roundedRiskPerMillionLotsOfDigits =
    Math.round(riskPerMillion * 1e6) / 1e6;

  let textRepresentation = `${roundedRisk} ${RISK_PER_MILLION}`;
  if (oneInX) {
    textRepresentation = `${roundedRisk}`;
  }
  if (riskPerMillion === 0.0) {
    textRepresentation = oneInX ? ZERO_RISK_IN_X : ZERO_RISK;
  } else if (roundedRiskPerMillionLotsOfDigits < 0.1) {
    textRepresentation = oneInX
      ? LESS_THAN_TENTH_MILLION_IN_X
      : LESS_THAN_TENTH_MILLION;
  }

  return (
    <abbr
      title={
        "Model output: " +
        roundedRiskPerMillionLotsOfDigits.toString() +
        " per million"
      }
      className={classes.abbr}
    >
      {textRepresentation}
    </abbr>
  );
}

export default function Form({ output }: OutputProps) {
  const classes = useStyles();

  const [oneInX, setOneInX] = useState(false);
  const [tab, setTab] = useState(0);

  const handleChange = (event: any, newTab: any) => {
    setTab(newTab);
    setOneInX(newTab === 1);
  };

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

          <Paper className={classes.centeredTabRoot}>
            <Tabs
              value={tab}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Show risk per million people" />
              <Tab label="Show risk as a chance" />
            </Tabs>
          </Paper>
          {/* <Button
            onClick={() => setOneInX(!oneInX)}
            color="primary"
            variant="outlined"
          >
            {oneInX
              ? "Show risk as per million risk"
              : "Show risk as reciprocal"}
          </Button> */}

          {output.bar_graphs?.map(({ title, subtitle, risks }: any) => {
            let multiplier = 1e6;
            const data = risks.map(
              ({ label, risk, is_relatable, is_other_shot }: any) => {
                let color = "#413ea0";
                if (is_relatable) {
                  color = "#ccc";
                }
                if (is_other_shot) {
                  color = "#b2b1ce";
                }
                return {
                  label,
                  risk: multiplier * risk,
                  fill: color,
                  display_risk: displayRisk(risk, oneInX, label),
                };
              }
            );
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
                  <XAxis
                    type="number"
                    label={RISK_TEXT}
                    height={100}
                    hide={oneInX}
                  />
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
                            {/* {label}
                            <br /> */}
                            {displayRisk(value / 1e6, false, label)}{" "}
                            {INFOBOX_RISK_TEXT}.
                            <br />
                            This is the same as a{" "}
                            {displayRisk(value / 1e6, true, label)} chance.
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

          {output.printable && (
            <Box py={5}>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                href={output.printable.url}
                target="_blank"
              >
                {output.printable.text}
              </Button>
            </Box>
          )}

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
                          <RiskDisplay risk={risk} oneInX={oneInX} />
                          <br />(<RiskDisplay risk={risk} oneInX={!oneInX} />)
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
