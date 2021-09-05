import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + "/v0/compute";

export type FormData = {
  variant: string;
  age?: number;
  sex: string;
  vaccine: string;
  transmission: string;
};

export async function compute(form: FormData) {
  const res = await axios.post(API_URL, form);
  return res.data;
}
