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

type FormData = {
  variant: string;
  age?: number;
  sex: string;
  dose1: string;
};

const useStyles = makeStyles((theme) => ({
  formComp: {
    marginTop: "2rem",
    marginBottom: "2rem",
  },
}));

export default function Form() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const onSubmit = (data: any) => console.log(data);

  const classes = useStyles();

  const vals = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {JSON.stringify(vals)}
      <Typography variant="h5" component="h2">
        Step 1: Patient information
      </Typography>
      <Typography variant="body1" gutterBottom>
        Instructional text for form.
      </Typography>
      <div className={classNames(classes.formComp)}>
        <InputLabel htmlFor="variant">SARS-CoV-2 Variant</InputLabel>
        <FormControl>
          {errors?.variant?.message && (
            <FormHelperText error>{errors.variant.message}</FormHelperText>
          )}
          <Controller
            control={control}
            defaultValue={VARIANTS[0].value}
            rules={{ required: "Required." }}
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
        </FormControl>
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="age"
          control={control}
          rules={{ min: 16, max: 100 }}
          render={({ field }) => <TextField label="Age" {...field} />}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="sex"
          control={control}
          defaultValue=""
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
            </FormControl>
          )}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Controller
          name="dose1"
          control={control}
          defaultValue={""}
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
            </FormControl>
          )}
        />
      </div>
      <div className={classNames(classes.formComp)}>
        <Button variant="contained" color="primary" disableElevation>
          Submit
        </Button>
      </div>
    </form>
  );
}
