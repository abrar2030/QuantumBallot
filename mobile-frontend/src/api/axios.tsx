import axios from "axios";
import { Config } from "../constants/config";

const axiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Config.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

export const axiosPrivate = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Config.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for logging (development only)
if (Config.APP.SHOW_LOGS) {
  axiosInstance.interceptors.request.use(
    (config) => {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
      return config;
    },
    (error) => {
      console.error("[API Request Error]", error);
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error(
        "[API Response Error]",
        error.response?.status,
        error.message,
      );
      return Promise.reject(error);
    },
  );
}
