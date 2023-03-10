import {
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab/";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";

import { PfizerFormData } from "./api";
import {
  AGE_LABEL,
  STEP1_HELPER,
  STEP1_TITLE,
  PZ_CHILDREN_VERSION_ALERT,
  CHILDREN_AGE_TOO_SMALL,
  CHILDREN_AGE_TOO_BIG,
  STATE_LABEL,
  STATE_OPTIONS,
  STATE_DEFAULT,
  STATE_NUMBERS,
  SEX_LABEL,
  SEX_OPTIONS,
  FIELD_REQUIRED,
  PZ_VACCINE_LABEL,
  CHILDREN_VACCINE_OPTIONS,
  CHILDREN_SCENARIOS_LABEL,
  CHILDREN_SCENARIOS_DEFAULT,
  CHILDREN_SCENARIOS,
  SUBMIT_LABEL,
  TOS_HEADING,
  TOS_1,
  TOS_2,
  TOS_3,
  TOS_TITLE,
  TOS_TEXT,
} from "./constants";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  formComp: {
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  indent: {
    paddingLeft: "2rem",
  },
  ctOption: {
    marginTop: "0.8rem",
    marginBottom: "0.8rem",
  },
  ctDescription: {
    color: "#777",
    fontSize: "0.9rem",
  },
  message: {
    margin: "2rem 1rem",
  },
}));

type FormInputs = {
  callback: (form: PfizerFormData) => void;
};

export type PfizerFullFormData = {
  tos: boolean;
  form_dose: string;
  form_second_dose: string;
  age?: number;
  sex: string;
  ct: string;
  state: string;
};

export default function Form({ callback }: FormInputs) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PfizerFullFormData>({
    mode: "onBlur",
    defaultValues: {
      ct: CHILDREN_SCENARIOS_DEFAULT,
    },
  });
  const submit = handleSubmit((form: PfizerFullFormData) => {
    callback({
      tos: form.tos,
      dose: form.form_dose,
      age: form.age,
      sex: form.sex,
      ct: form.ct,
    });
  });
  const classes = useStyles();

  const [tosBoxOpen, setTosBoxOpen] = useState(false);

  return (
    <form onSubmit={submit}>
      <Alert key={PZ_CHILDREN_VERSION_ALERT} severity={"info"} className={classes.message}>
        <AlertTitle>{"Calculator Version"}</AlertTitle>
        {PZ_CHILDREN_VERSION_ALERT}
      </Alert>
      <Typography variant="h5" component="h2">
        {STEP1_TITLE}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {STEP1_HELPER}
      </Typography>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="age"
          control={control}
          rules={{
            required: FIELD_REQUIRED,
            min: { value: 5, message: CHILDREN_AGE_TOO_SMALL },
            max: { value: 17, message: CHILDREN_AGE_TOO_BIG },
          }}
          render={({ field }) => (
            <TextField
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              label={AGE_LABEL}
              {...field}
              helperText={errors?.age?.message ?? " "}
              error={!!errors?.age?.message}
            />
          )}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="sex"
          control={control}
          rules={{ required: FIELD_REQUIRED }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">{SEX_LABEL}</FormLabel>
              <RadioGroup
                row
                name="sex-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {SEX_OPTIONS.map(({ value, label }) => (
                  <FormControlLabel
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
              {errors?.sex?.message && (
                <FormHelperText error>{errors.sex.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <Dialog
        open={tosBoxOpen}
        onClose={() => setTosBoxOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{TOS_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TOS_TEXT />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTosBoxOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="tos"
          control={control}
          rules={{
            validate: (value) => !!value || FIELD_REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">{TOS_HEADING}</FormLabel>
              <FormControlLabel
                value={value}
                control={<Checkbox checked={value} onChange={onChange} />}
                label={
                  <span>
                    {TOS_1}{" "}
                    <Link
                      onClick={() => {
                        onChange(!value);
                        setTosBoxOpen(true);
                      }}
                    >
                      {TOS_2}
                    </Link>{" "}
                    {TOS_3}
                  </span>
                }
              />
              {errors?.tos?.message && (
                <FormHelperText error>{errors.tos.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={submit}
        >
          {SUBMIT_LABEL}
        </Button>
      </div>
    </form>
  );
}
