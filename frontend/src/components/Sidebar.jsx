import { useContext } from "react";
import { FiSettings } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";
import { FiX, FiHome, FiList, FiPieChart, FiTarget, FiLogOut } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: FiHome },
  { path: "/expenses", label: "Expenses", icon: FiList },
  { path: "/budgets", label: "Budgets", icon: FiPieChart },
  { path: "/goals", label: "Goals", icon: FiTarget },
  {
  name: "Settings",
  path: "/settings",
  icon: FiSettings
}
];

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { darkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiPieChart className="w-5 h-5 text-white" />
            </div>
            SmartSpend
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-red-500/20"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;