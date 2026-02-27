import { ReactNode, useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Layout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <header className="h-[70px] bg-white shadow-sm flex items-center justify-between px-10">
        
        <h1 className="text-xl font-bold text-[#1F8CF9]">
          Annai Printers
        </h1>

        <div className="relative" ref={dropdownRef}>
          <div onClick={() => setShowMenu((prev) => !prev)} className="flex items-center gap-2 cursor-pointer select-none" >
            <div className="w-9 h-9 bg-[#1F8CF9] rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>

            <span className="text-[#16181D] font-medium">
              Admin01
            </span>

            <svg className={`w-4 h-4 transition-transform ${showMenu ? "rotate-180" : "" }`}
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-md w-36 py-2 border">
              <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-10 py-8">
        {children}
      </main>

      <footer className="h-[50px] bg-white border-t flex items-center justify-center text-sm text-[#575E6B]">
        © 2026 Annai Printers. All rights reserved.
      </footer>
    </div>
  );
}