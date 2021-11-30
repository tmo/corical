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
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";

import { PfizerFormData } from "./api";
import {
  AGE_LABEL,
  STEP1_HELPER,
  STEP1_TITLE,
  AGE_TOO_SMALL,
  AGE_TOO_BIG,
  SEX_LABEL,
  SEX_OPTIONS,
  FIELD_REQUIRED,
  PZ_VACCINE_LABEL,
  PZ_VACCINE_OPTIONS,
  PZ_SCENARIOS_LABEL,
  PZ_SCENARIOS_DEFAULT,
  PZ_SCENARIOS,
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
}));

type FormInputs = {
  callback: (form: PfizerFormData) => void;
};

export default function Form({ callback }: FormInputs) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PfizerFormData>({
    mode: "onBlur",
    defaultValues: {
      ct: PZ_SCENARIOS_DEFAULT,
    },
  });
  const submit = handleSubmit(callback);
  const classes = useStyles();

  const [tosBoxOpen, setTosBoxOpen] = useState(false);

  return (
    <form onSubmit={submit}>
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
          name="dose"
          control={control}
          rules={{
            validate: (value) => !!value || FIELD_REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">{PZ_VACCINE_LABEL}</FormLabel>
              <RadioGroup
                // row
                name="dose-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {PZ_VACCINE_OPTIONS.map(({ value, label }) => (
                  <FormControlLabel
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
              {errors?.dose?.message && (
                <FormHelperText error>{errors.dose.message}</FormHelperText>
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
              <FormLabel component="legend">{PZ_SCENARIOS_LABEL}</FormLabel>
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
                          {description}
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