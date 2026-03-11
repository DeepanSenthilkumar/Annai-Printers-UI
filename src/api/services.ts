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
      const res = await baseUrl.get(`/api/bills`, {params: { ...requestBody, _t: Date.now()}});
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

  createNewService: async (requestBody: any) => {
    try{
      const res = await baseUrl.post(`/api/services`, requestBody);
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

  updateServiceDetails: async (pageId: any, requestBody: any) => {
    try{
      const res = await baseUrl.put(`/api/services/${pageId}`, requestBody);
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

  deleteService: async (pageId: any) => {
    try{
      const res = await baseUrl.delete(`/api/services/${pageId}`);
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

  exportBills: async () => {
    try {
      const response = await baseUrl.get(`/api/bills/export`);
      return response.data;
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
  
  clearBills: async () => {
    debugger
    try {
      const response = await baseUrl.delete(`/api/bills/clear-all`);
      return response.data;
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

  changePrintStatus: async (billNumber: string, requestBody: any) => {
    debugger
    try{
      const response = await baseUrl.patch(`api/bills/${billNumber}/print-status`, requestBody)
      return response.data
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