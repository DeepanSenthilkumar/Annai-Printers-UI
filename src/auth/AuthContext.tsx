import { createContext, useContext, useState, ReactNode } from "react";
import { toaster } from "../components/toaster";
import { ApiService } from "../api/services";
// import { useOperatorCart } from "../context/OperatorCartContext";

interface AuthState {
  token: string | null;
  role: "Admin" | "Operator" | null;
  // userName: string | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: "Admin" | "Operator", userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );
  // const { clearCart} = useOperatorCart();
  const [role, setRole] = useState<"Admin" | "Operator" | null>(
    (sessionStorage.getItem("role") as "Admin" | "Operator") || null
  );

  const login = (token: string, role: "Admin" | "Operator", userName: string) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("userName", userName);
    setToken(token);
    setRole(role);
  };

  const logout = async() => {
    debugger
    const response = await ApiService.logout() as any
    if(response) {
      sessionStorage.clear();
      // clearCart()
      setToken(null);
      toaster.success('Logged Out', "Success");
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};