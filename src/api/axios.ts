import axios from "axios";
import { toaster } from "../components/toaster";

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // convert to ms
    return Date.now() > expiry;
  } catch {
    return true;
  }
};

export const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // REQUEST INTERCEPTOR (token validation)
  instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      if (isTokenExpired(token)) {
        sessionStorage.clear();

        toaster.error("Session expired. Please login again.", "Session Expired");

        setTimeout(() => {
          window.dispatchEvent(new Event("session-expired"));
        }, 500);

        return Promise.reject("Token expired");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // RESPONSE INTERCEPTOR (only handle real unauthorized)
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 403) {
        toaster.error("You don't have permission", "Access Denied");
      }

      return Promise.reject(error);
    }
  );

  return instance;
};