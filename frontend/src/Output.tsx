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
}));

type OutputProps = {
  output: any;
};

export default function Form({ output }: OutputProps) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" component="h2">
        Step 2: Risk output
      </Typography>
      {output ? (
        <>
          <Typography variant="body1" paragraph>
            Computed risk outputs below.
          </Typography>
          {/* <code>{JSON.stringify(output)}</code> */}
          {output.messages?.map(({ heading, text, severity }: any) => (
            <Alert key={text} severity={severity} className={classes.message}>
              <AlertTitle>{heading}</AlertTitle>
              {text}
            </Alert>
          ))}
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
                      <TableCell>Description</TableCell>
                      <TableCell>Risk</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {risks.map(({ name, risk, comment }: any) => (
                      <TableRow key={name}>
                        <TableCell component="th" scope="row">
                          {name}
                        </TableCell>
                        <TableCell>Risk: {risk}</TableCell>
                        <TableCell>{comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* {JSON.stringify(risks)} */}
            </div>
          ))}
        </>
      ) : (
        <Typography variant="body1" gutterBottom>
          Please submit the form for output.
        </Typography>
      )}
    </>
  );
}
