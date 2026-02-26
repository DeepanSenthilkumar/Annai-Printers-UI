import { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-8">Annai Printers</h2>

        {role === "Admin" && (
          <>
            <button onClick={() => navigate("/admin")} className="block w-full text-left mb-4 hover:text-indigo-600">
              Admin Dashboard
            </button>

            <button onClick={() => navigate("/detailView")} className="block w-full text-left mb-4 hover:text-indigo-600">
              Manage Users
            </button>
          </>
        )}

        {role === "Operator" && (
          <>
            <button onClick={() => navigate("/operator")} className="block w-full text-left mb-4 hover:text-indigo-600">
              Operator Dashboard
            </button>
            <button onClick={() => navigate("/calculation")} className="block w-full text-left mb-4 hover:text-indigo-600">
              Orders
            </button>
          </>
        )}

        <button onClick={logout} className="mt-10 text-red-500 hover:text-red-700">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}