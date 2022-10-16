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
  PZ_VERSION_ALERT,
  AGE_TOO_SMALL,
  AGE_TOO_BIG,
  STATE_LABEL,
  STATE_OPTIONS,
  STATE_DEFAULT,
  STATE_NUMBERS,
  SEX_LABEL,
  SEX_OPTIONS,
  FIELD_REQUIRED,
  PZ_VACCINE_LABEL,
  PZ_VACCINE_OPTIONS,
  PZ_VACCINE2_LABEL,
  PZ_VACCINE2_OPTIONS,
  DOSE_OVERDUE_DISCLAIMER,
  PZ_SCENARIOS_LABEL,
  PZ_SCENARIOS_DEFAULT,
  PZ_SCENARIOS,
  PZ_VACCINE_SECOND_VAL,
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
      ct: PZ_SCENARIOS_DEFAULT,
    },
  });
  const submit = handleSubmit((form: PfizerFullFormData) => {
    callback({
      tos: form.tos,
      dose:
        form.form_dose === PZ_VACCINE_SECOND_VAL
          ? form.form_second_dose
          : form.form_dose,
      age: form.age,
      sex: form.sex,
      ct: form.ct,
    });
  });
  const classes = useStyles();

  const [tosBoxOpen, setTosBoxOpen] = useState(false);

  const [stateVal, setStateVal] = useState(STATE_DEFAULT); 

  const enableDose2extras = watch("form_dose") === PZ_VACCINE_SECOND_VAL;

  return (
    <form onSubmit={submit}>
      <Alert key={PZ_VERSION_ALERT} severity={"info"} className={classes.message}>
        <AlertTitle>{"Calculator Version"}</AlertTitle>
        {PZ_VERSION_ALERT}
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
            min: { value: 18, message: AGE_TOO_SMALL },
            max: { value: 100, message: AGE_TOO_BIG },
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
          name="state"
          control={control}
          rules={{
            
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">{STATE_LABEL}</FormLabel>
              <Select
                value={value}
                defaultValue={STATE_DEFAULT}
                label="State"
                onChange={(e, value) => {setStateVal(e.target.value as string)}}
              >
                {STATE_OPTIONS.map(({ value, label }) => (
                    <MenuItem 
                      value={value}
                    >{label}</MenuItem>
                  ))}
              </Select>
            </FormControl>
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
      <div className={classNames(classes.formComp)}>
        <Controller
          name="form_dose"
          control={control}
          rules={{
            validate: (value) => !!value || FIELD_REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">{PZ_VACCINE_LABEL}</FormLabel>
              <Typography variant="caption">
                {DOSE_OVERDUE_DISCLAIMER}
              </Typography>
              <RadioGroup
                // row
                name="form_dose-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {PZ_VACCINE_OPTIONS.map(({ value, label }) => (
                  <FormControlLabel
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={ label }
                  />
                ))}
              </RadioGroup>
              {errors?.form_dose?.message && (
                <FormHelperText error>
                  {errors.form_dose.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <div
        className={classNames(classes.formComp, classes.indent)}
        hidden={!enableDose2extras}
      >
        <Controller
          name="form_second_dose"
          control={control}
          rules={{
            validate: (value) =>
              !enableDose2extras || !!value || FIELD_REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">{PZ_VACCINE2_LABEL}</FormLabel>
              <RadioGroup
                name="form_second_dose-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {PZ_VACCINE2_OPTIONS.map(({ value, label }) => (
                  <FormControlLabel
                    disabled={!enableDose2extras}
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={ label }
                  />
                ))}
              </RadioGroup>
              {errors?.form_second_dose?.message && (
                <FormHelperText error>
                  {errors.form_second_dose.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="ct"
          control={control}
          rules={{
            validate: (value) => !!value || FIELD_REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                {PZ_SCENARIOS_LABEL}
                <br/>
                <br/>
                <Button
                  variant="outlined"
                  color="default"
                  disableElevation
                  size="small"
                  href="/stateinfo"
                >
                  More Information
                </Button>{" "}
              </FormLabel>
              <RadioGroup
                name="ct-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {PZ_SCENARIOS.map(({ value, label, description }) => (
                  <FormControlLabel
                    className={classes.ctOption}
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={
                      <div>
                        <Typography variant="body2">{label}</Typography>
                        <Typography
                          variant="caption"
                          className={classes.ctDescription}
                        >
                          {description
                            .replace('{case_number}', (STATE_NUMBERS as any)[stateVal][value])
                            .replace('{state}', stateVal)}
                        </Typography>
                      </div>
                    }
                  />
                ))}
              </RadioGroup>
              {errors?.ct?.message && (
                <FormHelperText error>{errors.ct.message}</FormHelperText>
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
