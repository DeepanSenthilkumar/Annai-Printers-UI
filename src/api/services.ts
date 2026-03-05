// import { ENV } from "../config/env";
// import { createAxiosInstance } from "./axios";

// const authApi = createAxiosInstance(ENV.AUTH_URL);
// const mainApi = createAxiosInstance(ENV.MAIN_URL);
// const reportApi = createAxiosInstance(ENV.REPORT_URL);

export interface LoginResponse {
  isAdded: boolean;
  message: string;
  token: string;
  role: "Admin" | "Operator";
}

export const ApiService = {
  // login: async (email: string, password: string) => {
  //   // REAL
  //   // return authApi.post<LoginResponse>("/login", { email, password });

  //   // TEMP MOCK
  //   return new Promise<LoginResponse>((resolve) => {
  //     setTimeout(() => {
  //       resolve({
  //         isAdded: true,
  //         message: "User Logged in successfully",
  //         token: "fake-jwt",
  //         role: email.includes("admin") ? "Operator" : "Admin",
  //       });
  //     }, 800);
  //   });
  // },

  login: async (email: string, password: string) => {
    return new Promise<LoginResponse>((resolve, reject) => {
      setTimeout(() => {

        const ADMIN_EMAIL = "admin@test.com";
        const ADMIN_PASSWORD = "admin123";

        const OPERATOR_EMAIL = "operator@test.com";
        const OPERATOR_PASSWORD = "operator123";

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          resolve({
            isAdded: true,
            message: "Admin logged in successfully",
            token: "fake-admin-jwt",
            role: "Admin",
          });
        } 
        else if (email === OPERATOR_EMAIL && password === OPERATOR_PASSWORD) {
          resolve({
            isAdded: true,
            message: "Operator logged in successfully",
            token: "fake-operator-jwt",
            role: "Operator",
          });
        } 
        else {
          reject({
            isAdded: false,
            message: "Invalid email or password",
          });
        }

      }, 800);
    });
  },

  // getReports: () => reportApi.get("/list"),
  // getDashboard: () => mainApi.get("/dashboard"),
};