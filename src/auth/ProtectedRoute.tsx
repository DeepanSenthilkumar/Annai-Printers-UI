import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Props {
  children: JSX.Element;
  allowedRoles: ("Admin" | "Operator")[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (!role || !allowedRoles.includes(role))
    return <Navigate to="/login" replace />;

  return children;
}