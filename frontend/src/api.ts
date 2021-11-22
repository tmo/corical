import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + "/v1";

export type TTSFormData = {
  tos: boolean;
  age?: number;
  sex: string;
  vaccine: string;
  transmission: string;
};

export type PfizerFormData = {
  tos: boolean;
  dose: string;
  age?: number;
  sex: string;
  ct: string;
};

export async function computeTts(form: TTSFormData) {
  const res = await axios.post(API_URL + "/compute_tts", form);
  return res.data;
}

export async function computePfizer(form: PfizerFormData) {
  const res = await axios.post(API_URL + "/compute_pfizer", form);
  return res.data;
}
