import {
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";

import { makeStyles } from "@material-ui/core";

const REQUIRED = "This field is required.";
const YES_NO = [
  {
    value: "yes",
    label: "Yes",
  },
  {
    value: "no",
    label: "No",
  },
];
const VARIANTS = [
  {
    value: "alpha",
    label: "Alpha",
  },
  {
    value: "beta",
    label: "Beta",
  },
  {
    value: "delta",
    label: "Delta",
  },
  {
    value: "gamma",
    label: "Gamma",
  },
];
const SEX_OPTIONS = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
];
const VACCINE_OPTIONS = [
  {
    value: "pfizer",
    label: "Pfizer",
  },
  {
    value: "az",
    label: "AstraZeneca",
  },
];

export type FormData = {
  variant: string;
  age?: number;
  sex: string;
  dose1: string;
  vaccine: string;
  dose1weeks?: number;
  dose2: string;
  dose2weeks?: number;
  had_covid: string;
};

const useStyles = makeStyles((theme) => ({
  formComp: {
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  indent: {
    paddingLeft: "2rem",
  },
}));

type FormInputs = {
  callback: (form: FormData) => void;
};

export default function Form({ callback }: FormInputs) {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    mode: "onBlur",
  });
  const submit = handleSubmit(callback);

  const classes = useStyles();

  const vals = watch();

  const disableDose1extras = watch("dose1") !== "yes";
  const disableDose2 = disableDose1extras;
  const disableDose2extras =
    watch("dose1") !== "yes" || watch("dose2") !== "yes";

  return (
    <form onSubmit={submit}>
      {JSON.stringify(vals)}
      <FormHelperText error>{JSON.stringify(errors)}</FormHelperText>
      <Typography variant="h5" component="h2">
        Step 1: Patient information
      </Typography>
      <Typography variant="body1" gutterBottom>
        Instructional text for form.
      </Typography>
      <div className={classNames(classes.formComp)}>
        <InputLabel htmlFor="variant">SARS-CoV-2 Variant</InputLabel>
        <FormControl>
          <Controller
            control={control}
            defaultValue={VARIANTS[0].value}
            rules={{ required: REQUIRED }}
            name="variant"
            render={({ field: { onChange, value } }) => (
              <Select
                onChange={(e) => onChange(e.target.value)}
                value={value}
                id="variant"
                fullWidth
              >
                {VARIANTS.map(({ value, label }) => (
                  <MenuItem key={label} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors?.variant?.message && (
            <FormHelperText error>{errors.variant.message}</FormHelperText>
          )}
        </FormControl>
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="age"
          control={control}
          rules={{
            required: REQUIRED,
            min: { value: 16, message: "Must be at least 16 years old." },
            max: { value: 100, message: "Please enter an age under 100" },
          }}
          render={({ field }) => (
            <TextField
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              label="Age"
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
          rules={{ required: REQUIRED }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">Sex</FormLabel>
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
          name="dose1"
          control={control}
          rules={{ required: REQUIRED }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Has had first dose of COVID-19 vaccine?
              </FormLabel>
              <RadioGroup
                row
                name="dose1-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {YES_NO.map(({ value, label }) => (
                  <FormControlLabel
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
              {errors?.dose1?.message && (
                <FormHelperText error>{errors.dose1.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className={classNames(classes.formComp, classes.indent)}>
        <Controller
          name="vaccine"
          control={control}
          rules={{
            validate: (value) => disableDose1extras || !!value || REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">Vaccine</FormLabel>
              <RadioGroup
                row
                name="vaccine-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {VACCINE_OPTIONS.map(({ value, label }) => (
                  <FormControlLabel
                    disabled={disableDose1extras}
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
      <div className={classNames(classes.formComp, classes.indent)}>
        <Controller
          name="dose1weeks"
          control={control}
          rules={{
            validate: (value) => disableDose1extras || !!value || REQUIRED,
            min: { value: 0, message: "Must be at least 0." },
            max: { value: 104, message: "Must be under 104 weeks." },
          }}
          render={({ field }) => (
            <TextField
              disabled={disableDose1extras}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              label="Weeks since first dose"
              helperText={errors?.dose1weeks?.message ?? " "}
              error={!!errors?.dose1weeks?.message}
              {...field}
            />
          )}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="dose2"
          control={control}
          rules={{ validate: (value) => disableDose2 || !!value || REQUIRED }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Has had second dose of COVID-19 vaccine?
              </FormLabel>
              <RadioGroup
                row
                name="dose2-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {YES_NO.map(({ value, label }) => (
                  <FormControlLabel
                    disabled={disableDose2}
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
              {errors?.dose2?.message && (
                <FormHelperText error>{errors.dose2.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>
      <div className={classNames(classes.formComp, classes.indent)}>
        <Controller
          name="dose2weeks"
          control={control}
          rules={{
            min: { value: 0, message: "Must be at least 0." },
            max: { value: 104, message: "Must be under 104 weeks." },
            validate: (dose2w) => {
              // require dose1weeks <= dose2weeks + this is required if not disableDose2extras
              if (!disableDose2extras) {
                if (!dose2w) {
                  return REQUIRED;
                } else {
                  const dose1w = getValues("dose1weeks") || 0;
                  if (dose2w > dose1w) {
                    return "Second dose must be after first dose.";
                  }
                }
              }
            },
          }}
          render={({ field }) => (
            <TextField
              disabled={disableDose2extras}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              label="Weeks since second dose"
              helperText={errors?.dose2weeks?.message ?? " "}
              error={!!errors?.dose2weeks?.message}
              {...field}
            />
          )}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="had_covid"
          control={control}
          rules={{ required: REQUIRED }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">Has had COVID-19?</FormLabel>
              <RadioGroup
                row
                name="had_covid-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {YES_NO.map(({ value, label }) => (
                  <FormControlLabel
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={label}
                  />
                ))}
              </RadioGroup>
              {errors?.had_covid?.message && (
                <FormHelperText error>
                  {errors.had_covid.message}
                </FormHelperText>
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
          Submit
        </Button>
      </div>
    </form>
  );
}
