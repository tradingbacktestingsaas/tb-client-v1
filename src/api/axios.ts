import axios from "axios";
import { getCsrfToken } from "@/lib/csrf";
import qs from "qs";

const VERSION = "v1";
const PRIVACY = "public";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${BASE_URL}/${PRIVACY}/api/${VERSION}`,
  paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: request interceptor for CSRF token
api.interceptors.request.use((config) => {
  const csrf = getCsrfToken();
  if (csrf) config.headers["X-CSRF-Token"] = csrf;
  return config;
});

export default api;
