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
import { AGE_LABEL, VARIANT_LABEL, STEP1_HELPER, STEP1_TITLE, VARIANTS, AGE_TOO_SMALL, AGE_TOO_BIG, SEX_LABEL, SEX_OPTIONS, FIELD_REQUIRED, VACCINE_LABEL, VACCINE_OPTIONS, SCENARIOS_LABEL, SCENARIOS, SUBMIT_LABEL } from "./constants";

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

  return (
    <form onSubmit={submit}>
      <Typography variant="h5" component="h2">
        {STEP1_TITLE}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {STEP1_HELPER}
      </Typography>
      <div className={classNames(classes.formComp)}>
        <InputLabel htmlFor="variant">{VARIANT_LABEL}</InputLabel>
        <FormControl>
          <Controller
            control={control}
            defaultValue={VARIANTS[0].value}
            rules={{ required: FIELD_REQUIRED }}
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
                        <Typography variant="body2">
                          {label}
                        </Typography>
                        <Typography variant="caption" className={classes.transmissionDescription}>
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
