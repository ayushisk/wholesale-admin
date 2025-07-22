import axios from "axios";

export const baseURL =
  import.meta.env.VITE_WORKING_ENVIRONMENT === "DEVELOPMENT"
    ? import.meta.env.VITE_APP_BACKEND_DEV_BASE_URL
    : import.meta.env.VITE_APP_BACKEND_PROD_BASE_URL;

console.log("Base URL:", baseURL);

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("digitalAuth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("digitalAuth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
