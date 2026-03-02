import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import AdminPage1 from "./pages/AdminPage1";
import AdminPage2 from "./pages/AdminPage2";
import OperatorPage1 from "./pages/OperatorPage1";
import OperatorPage2 from "./pages/OperatorPage2";
import { OperatorCartProvider } from "./context/OperatorCartContext";

function App() {
  return (
      <AuthProvider>
        <OperatorCartProvider>
          <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} transition={Slide} limit={1} newestOnTop closeOnClick pauseOnHover={false} draggable={false} theme="colored" />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={ <ProtectedRoute allowedRoles={["Admin"]}><AdminPage1 /></ProtectedRoute> }/>

            <Route path="/detailView" element={ <ProtectedRoute allowedRoles={["Admin"]}><AdminPage2 /></ProtectedRoute> }/>

            <Route path="/operator" element={ <ProtectedRoute allowedRoles={["Operator"]}><OperatorPage1 /></ProtectedRoute> }/>

            <Route path="/calculation" element={ <ProtectedRoute allowedRoles={["Operator"]}><OperatorPage2 /></ProtectedRoute> }/>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </OperatorCartProvider>
      </AuthProvider>
  );
}

export default App;