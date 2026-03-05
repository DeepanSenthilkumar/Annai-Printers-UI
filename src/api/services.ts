// import axiosInstance from "./axios";

// export interface LoginResponse {
//   isAdded: boolean;
//   message: string;
//   token: string;
//   role: "Admin" | "Operator";
// }

// export const ApiService = {
//   login: async (email: string, password: string) => {
//     // REAL INDUSTRIAL CALL:
//     // return axiosInstance.post<LoginResponse>("/auth/login", { email, password });

//     // TEMP HARD CODE
//     return new Promise<LoginResponse>((resolve) => {
//       setTimeout(() => {
//         if (email === "admin@test.com") {
//           resolve({
//             isAdded: true,
//             message: "User Logged in successfully",
//             token: "admin-fake-jwt",
//             role: "Admin",
//           });
//         } else {
//           resolve({
//             isAdded: true,
//             message: "User Logged in successfully",
//             token: "operator-fake-jwt",
//             role: "Operator",
//           });
//         }
//       }, 1000);
//     });
//   },
// };

import { ENV } from "../config/env";
import { createAxiosInstance } from "./axios";

const authApi = createAxiosInstance(ENV.AUTH_URL);
const mainApi = createAxiosInstance(ENV.MAIN_URL);
const reportApi = createAxiosInstance(ENV.REPORT_URL);

export interface LoginResponse {
  isAdded: boolean;
  message: string;
  token: string;
  role: "Admin" | "Operator";
}

export const ApiService = {
  login: async (email: string, password: string) => {
    // REAL
    // return authApi.post<LoginResponse>("/login", { email, password });

    // TEMP MOCK
    return new Promise<LoginResponse>((resolve) => {
      setTimeout(() => {
        resolve({
          isAdded: true,
          message: "User Logged in successfully",
          token: "fake-jwt",
          role: email.includes("admin") ? "Operator" : "Admin",
        });
      }, 800);
    });
  },

  getReports: () => reportApi.get("/list"),
  getDashboard: () => mainApi.get("/dashboard"),
};