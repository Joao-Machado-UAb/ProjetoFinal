import axios from "axios";
import store from "../store";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASEURL || "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = store.getters["auth/token"];
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
