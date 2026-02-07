import axios from "axios";

const defaultApiBase = "https://threadlybackend-8v2id5kc.b4a.run/api";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBase;

//* create an instance of axios
export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, //? sends cookeis with each request
});
