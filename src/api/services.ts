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
  },
  
  logout: async () => {
    try{
      const res = await baseUrl.post("/api/auth/logout");
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
  },
  
  getServiceDetails: async () => {
    try{
      const res = await baseUrl.get("/api/services/dropdown/names");
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
  },
  
  getPageType: async (serviceId: number) => {
    try{
      const res = await baseUrl.get(`/api/services/dropdown/pagetypes/${serviceId}`);
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
  },
  
  getAllService: async () => {
    try{
      const res = await baseUrl.get(`/api/services/all`);
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
  },
  
  submitBill: async (requestBody: any) => {
    try{
      const res = await baseUrl.post(`/api/bills`, requestBody);
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
  },
  
  getAllBill: async (requestBody: any) => {
    try{
      const res = await baseUrl.get(`/api/bills`, requestBody);
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
  },
};