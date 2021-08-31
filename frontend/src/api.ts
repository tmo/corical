import axios from "axios";

const API_URL = "http://localhost:8888/v0/compute";

export type FormData = {
  variant: string;
  age?: number;
  sex: string;
  vaccine: string;
  transmission: string;
};

export async function compute(form: FormData) {
  try {
    console.log("form", form);
    const res = await axios.post(API_URL, form);
    console.log(res);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.error(e);
    return e.message;
  }
}
