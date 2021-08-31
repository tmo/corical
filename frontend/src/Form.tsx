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

import { FormData } from "./api";

const REQUIRED = "This field is required.";
const SCENARIOS = [
  {
    value: "None_0",
    label: "No community transmission",
  },
  {
    value: "ATAGI_Low_0_029_percent",
    label: "ATAGI low",
  },
  {
    value: "ATAGI_Med_0_275_percent",
    label: "ATAGI medium",
  },
  {
    value: "ATAGI_High_3_544_percent",
    label: "ATAGI high",
  },
  {
    value: "One_percent",
    label: "1%",
  },
  {
    value: "Two_percent",
    label: "2%",
  },
  {
    value: "NSW_1000_cases",
    label: "NSW 1000 cases",
  },
  {
    value: "VIC_1000_cases",
    label: "VIC 1000 cases",
  },
  {
    value: "QLD_1000_cases",
    label: "QLD 1000 cases",
  },
];
const VARIANTS = [
  {
    value: "alpha",
    label: "Before Delta variant",
  },
  {
    value: "delta",
    label: "After Delta variant",
  },
];
const SEX_OPTIONS = [
  {
    value: "female",
    label: "Female",
  },
  {
    value: "male",
    label: "Male",
  },
  {
    value: "other",
    label: "Other/prefer not to say",
  },
];
const VACCINE_OPTIONS = [
  {
    value: "az1",
    label: "First shot of AstraZeneca",
  },
  {
    value: "az2",
    label: "Two shots of AstraZeneca",
  },
  {
    value: "az0",
    label: "None",
  },
];

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
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    mode: "onBlur",
  });
  const submit = handleSubmit(callback);
  const classes = useStyles();
  const vals = watch();

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
          name="vaccine"
          control={control}
          rules={{
            validate: (value) => !!value || REQUIRED,
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
            validate: (value) => !!value || REQUIRED,
          }}
          render={({ field: { onChange, value } }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Community transmission scenario
              </FormLabel>
              <RadioGroup
                name="transmission-radio"
                onChange={(e, value) => onChange(value)}
                value={value}
              >
                {SCENARIOS.map(({ value, label }) => (
                  <FormControlLabel
                    key={label}
                    value={value}
                    control={<Radio />}
                    label={label}
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
