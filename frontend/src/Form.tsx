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

import { FormData } from "./api";
import {
  AGE_LABEL,
  STEP1_HELPER,
  STEP1_TITLE,
  AGE_TOO_SMALL,
  AGE_TOO_BIG,
  SEX_LABEL,
  SEX_OPTIONS,
  FIELD_REQUIRED,
  VACCINE_LABEL,
  VACCINE_OPTIONS,
  SCENARIOS_LABEL,
  SCENARIOS,
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
  transmissionOption: {
    marginTop: "0.8rem",
    marginBottom: "0.8rem",
  },
  transmissionDescription: {
    color: "#777",
  },
}));

type FormInputs = {
  callback: (form: FormData) => void;
};

export default function Form({ callback }: FormInputs) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onBlur",
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
            min: { value: 16, message: AGE_TOO_SMALL },
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
          name="vaccine"
          control={control}
          rules={{
            validate: (value) => !!value || FIELD_REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">{VACCINE_LABEL}</FormLabel>
              <RadioGroup
                row
                name="vaccine-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {VACCINE_OPTIONS.map(({ value, label }) => (
                  <FormControlLabel
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
              {errors?.vaccine?.message && (
                <FormHelperText error>{errors.vaccine.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="transmission"
          control={control}
          rules={{
            validate: (value) => !!value || FIELD_REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">{SCENARIOS_LABEL}</FormLabel>
              <RadioGroup
                name="transmission-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {SCENARIOS.map(({ value, label, description }) => (
                  <FormControlLabel
                    className={classes.transmissionOption}
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={
                      <div>
                        <Typography variant="body2">{label}</Typography>
                        <Typography
                          variant="caption"
                          className={classes.transmissionDescription}
                        >
                          {description}
                        </Typography>
                      </div>
                    }
                  />
                ))}
              </RadioGroup>
              {errors?.transmission?.message && (
                <FormHelperText error>
                  {errors.transmission.message}
                </FormHelperText>
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
            {TOS_TEXT}
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
