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
  import { Alert, AlertTitle } from "@material-ui/lab/";
  import { Controller, useForm } from "react-hook-form";
  import classNames from "classnames";
  import { makeStyles } from "@material-ui/core";
  
  import { LongCovidFormData } from "./api";
  import {
    AGE_LABEL,
    STEP1_HELPER,
    STEP1_TITLE,
    LC_VERSION_ALERT,
    AGE_TOO_SMALL,
    AGE_TOO_BIG,
    SEX_LABEL,
    SEX_OPTIONS,
    FIELD_REQUIRED,
    LC_COMOR_LABEL,
    LC_COMOR_HELPER,
    LC_COMOR_OPTIONS,
    LC_INFECTION_LABEL,
    LC_INFECTION_OPTIONS,
    VACCINE_LABEL,
    LC_VACCINE2_LABEL,
    LC_VACCINE_OPTIONS,
    LC_VACCINE2_OPTIONS,
    LC_VACCINE3_OPTIONS,
    LC_VACCINE4_OPTIONS,
    LC_VACCINE_SECOND_VAL,
    LC_VACCINE_THIRD_VAL,
    LC_VACCINE_FOURTH_VAL,
    SUBMIT_LABEL_SEP,
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
    callback: (form: LongCovidFormData) => void;
  };
  
  export type LongCovidFullFormData = {
    tos: boolean;
    form_dose: string;
    form_second_dose: string;
    form_third_dose: string;
    form_fourth_dose: string;
    age?: number;
    sex: string;
    comor: string;
    infection: string;
  };
  
  export default function Form({ callback }: FormInputs) {
    const {
      control,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm<LongCovidFullFormData>({
      mode: "onBlur",
    });
    const submit = handleSubmit((form: LongCovidFullFormData) => {
      callback({
        tos: form.tos,
        dose:
          form.form_dose === LC_VACCINE_SECOND_VAL
            ? form.form_second_dose
            : form.form_dose === LC_VACCINE_THIRD_VAL 
            ? form.form_third_dose
            : form.form_dose === LC_VACCINE_FOURTH_VAL
            ? form.form_fourth_dose 
            : form.form_dose,
        age: form.age,
        sex: form.sex,
        comor: form.comor,
        infection: form.infection,
      });
    });
    const classes = useStyles();
  
    const [tosBoxOpen, setTosBoxOpen] = useState(false);
  
    const enableDose2extras = watch("form_dose") === LC_VACCINE_SECOND_VAL;
    const enableDose3extras = watch("form_dose") === LC_VACCINE_THIRD_VAL;
    const enableDose4extras = watch("form_dose") === LC_VACCINE_FOURTH_VAL;
  
    return (
      <form onSubmit={submit}>
        <Alert key={LC_VERSION_ALERT} severity={"info"} className={classes.message}>
          <AlertTitle>{"Calculator Version"}</AlertTitle>
          {LC_VERSION_ALERT}
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
            name="comor"
            control={control}
            rules={{
              validate: (value) => !!value || FIELD_REQUIRED,
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend">{LC_COMOR_LABEL}</FormLabel>
                <Typography variant="caption">
                  {LC_COMOR_HELPER}
                </Typography>
                <RadioGroup
                  // row
                  name="form_comor-radio"
                  onChange={(e, value) => onChange(value)}
                  value={value}
                >
                  {LC_COMOR_OPTIONS.map(({ value, label }) => (
                    <FormControlLabel
                      key={label}
                      value={value}
                      control={<Radio />}
                      label={ label }
                    />
                  ))}
                </RadioGroup>
                {errors?.comor?.message && (
                  <FormHelperText error>
                    {errors.comor.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div className={classNames(classes.formComp)}>
          <Controller
            name="infection"
            control={control}
            rules={{
              validate: (value) => !!value || FIELD_REQUIRED,
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend">{LC_INFECTION_LABEL}</FormLabel>
                <RadioGroup
                  // row
                  name="form_infection-radio"
                  onChange={(e, value) => onChange(value)}
                  value={value}
                >
                  {LC_INFECTION_OPTIONS.map(({ value, label }) => (
                    <FormControlLabel
                      key={label}
                      value={value}
                      control={<Radio />}
                      label={ label }
                    />
                  ))}
                </RadioGroup>
                {errors?.comor?.message && (
                  <FormHelperText error>
                    {errors.comor.message}
                  </FormHelperText>
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
                <FormLabel component="legend">{VACCINE_LABEL}</FormLabel>
                <RadioGroup
                  // row
                  name="form_dose-radio"
                  onChange={(e, value) => onChange(value)}
                  value={value}
                >
                  {LC_VACCINE_OPTIONS.map(({ value, label }) => (
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
                <FormLabel component="legend">{LC_VACCINE2_LABEL}</FormLabel>
                <RadioGroup
                  name="form_second_dose-radio"
                  onChange={(e, value) => onChange(value)}
                  value={value}
                >
                  {LC_VACCINE2_OPTIONS.map(({ value, label }) => (
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
        <div
          className={classNames(classes.formComp, classes.indent)}
          hidden={!enableDose3extras}
        >
          <Controller
            name="form_third_dose"
            control={control}
            rules={{
              validate: (value) =>
                !enableDose3extras || !!value || FIELD_REQUIRED,
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend">{LC_VACCINE2_LABEL}</FormLabel>
                <RadioGroup
                  name="form_third_dose-radio"
                  onChange={(e, value) => onChange(value)}
                  value={value}
                >
                  {LC_VACCINE3_OPTIONS.map(({ value, label }) => (
                    <FormControlLabel
                      disabled={!enableDose3extras}
                      key={label}
                      value={value}
                      control={<Radio />}
                      label={ label }
                    />
                  ))}
                </RadioGroup>
                {errors?.form_third_dose?.message && (
                  <FormHelperText error>
                    {errors.form_third_dose.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        <div
          className={classNames(classes.formComp, classes.indent)}
          hidden={!enableDose4extras}
        >
          <Controller
            name="form_fourth_dose"
            control={control}
            rules={{
              validate: (value) =>
                !enableDose4extras || !!value || FIELD_REQUIRED,
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend">{LC_VACCINE2_LABEL}</FormLabel>
                <RadioGroup
                  name="form_second_dose-radio"
                  onChange={(e, value) => onChange(value)}
                  value={value}
                >
                  {LC_VACCINE4_OPTIONS.map(({ value, label }) => (
                    <FormControlLabel
                      disabled={!enableDose4extras}
                      key={label}
                      value={value}
                      control={<Radio />}
                      label={ label }
                    />
                  ))}
                </RadioGroup>
                {errors?.form_fourth_dose?.message && (
                  <FormHelperText error>
                    {errors.form_fourth_dose.message}
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
            {SUBMIT_LABEL_SEP}
          </Button>
        </div>
      </form>
    );
  }
  