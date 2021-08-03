import axios from "axios";

import { Sex, Vaccine, Variant } from "./proto/corical_pb";

const API_URL = "http://localhost:8888/v0/compute";

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

function variantToInt(variant: string) {
  switch (variant) {
    case "alpha":
      return Variant.VARIANT_ALPHA;
    case "beta":
      return Variant.VARIANT_BETA;
    case "delta":
      return Variant.VARIANT_DELTA;
    case "gamma":
      return Variant.VARIANT_GAMMA;
    default:
      return Variant.VARIANT_UNSPECIFIED;
  }
}

function sexToInt(sex: string) {
  switch (sex) {
    case "female":
      return Sex.SEX_FEMALE;
    case "male":
      return Sex.SEX_MALE;
    default:
      return Sex.SEX_UNSPECIFIED;
  }
}

function vaccineToInt(vaccine: string) {
  switch (vaccine) {
    case "pfizer":
      return Vaccine.VACCINE_PFIZER;
    case "astrazeneca":
      return Vaccine.VACCINE_ASTRAZENECA;
    default:
      return Vaccine.VACCINE_UNSPECIFIED;
  }
}

// message ComputeReq {
//   Variant variant = 1;
//   uint32 age = 2;
//   Sex sex = 3;
//   bool dose1 = 4;
//   Vaccine vaccine = 5;
//   uint32 dose1weeks = 6;
//   bool dose2 = 7;
//   uint32 dose2weeks = 8;
//   bool had_covid = 9;
// }

export function apifyForm(form: FormData) {
  // some duplicate logic from Form

  const disableDose1extras = form.dose1 !== "yes";
  const disableDose2 = disableDose1extras;
  const disableDose2extras = form.dose1 !== "yes" || form.dose2 !== "yes";

  return {
    variant: variantToInt(form.variant),
    age: form.age,
    sex: sexToInt(form.sex),
    dose1: form.dose1 === "yes",
    vaccine: disableDose1extras ? undefined : vaccineToInt(form.vaccine),
    dose1weeks: disableDose1extras ? undefined : form.dose1weeks,
    dose2: disableDose2 ? undefined : form.dose2 === "yes",
    dose2weeks: disableDose2extras ? undefined : form.dose2weeks,
    had_covid: form.had_covid === "yes",
  };
}

export async function compute(form: FormData) {
  try {
    console.log("form", form);
    const apified = apifyForm(form);
    console.log("apified", apified);
    const res = await axios.post(API_URL, apified);
    console.log(res);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.error(e);
    return e.message;
  }
}
