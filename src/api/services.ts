import { ENV } from "../config/env";
import { createAxiosInstance } from "./axios";

const baseUrl = createAxiosInstance(ENV.AUTH_URL);

export const ApiService = {
  login: async (requestBody: any) => {
    try{
      const res = await baseUrl.post("/api/auth/login", requestBody);
      return res.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }

      return {
        isAdded: false,
        message: "Something went wrong",
      };
    }
  }
};