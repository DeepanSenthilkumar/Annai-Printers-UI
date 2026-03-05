import { menuConfig } from "../config/menuConfig";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const menus = menuConfig.filter((m) => m.roles.includes(role || ""));

  return (
    <div className="fixed left-0 h-full w-64 bg-white shadow-xl z-20 p-6">
      <h2 className="text-lg font-semibold text-[#1F8CF9] mb-6">
        Admin Panel
      </h2>

      <ul className="space-y-3">
        {menus.map((menu) => {
          const active = location.pathname === menu.path;

          return (
            <li key={menu.path} onClick={() => { navigate(menu.path); onClose?.(); }}
              className={`cursor-pointer px-3 py-2 rounded-md transition
                ${ active? "bg-[#1F8CF9] text-white" : "hover:bg-gray-100 text-[#16181D]" }`}>
              {menu.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}