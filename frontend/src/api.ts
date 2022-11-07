import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + "/v1";

export type PfizerFormData = {
  tos: boolean;
  dose: string;
  age?: number;
  sex: string;
  ct: string;
};

export type CombinedFormData = {
  tos: boolean;
  vaccine?: string;
  dose_number: string;
  dose_2?: string;
  dose_3?: string;
  dose_time?: string;
  age?: number;
  sex: string;
  ct: string;
};

export async function computeCombined(form: CombinedFormData) {
  const res = await axios.post(API_URL + "/compute_combined", form);
  return res.data;
}

export async function computePfizerChildren(form: PfizerFormData) {
  const res = await axios.post(API_URL + "/compute_pfizer_children", form);
  return res.data;
}
