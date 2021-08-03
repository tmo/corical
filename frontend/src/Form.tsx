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

const VARIANTS = ["Alpha", "Beta", "Delta", "Gamma"];

type FormData = {
  variant: string;
  age?: number;
  sex: string;
};

const SEX_OPTIONS = ["Male", "Female"];

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
  } = useForm<FormData>();
  const onSubmit = (data: any) => console.log(data);

  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            defaultValue={VARIANTS[0]}
            rules={{ required: "Required." }}
            name="variant"
            render={({ field: { onChange, value } }) => (
              <Select
                onChange={(e) => onChange(e.target.value)}
                value={value}
                id="variant"
                fullWidth
              >
                {VARIANTS.map((variant) => (
                  <MenuItem key={variant} value={variant}>
                    {variant}
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
                {SEX_OPTIONS.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
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
