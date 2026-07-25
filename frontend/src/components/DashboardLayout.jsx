import { useState, useContext } from "react";
import { FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { ThemeContext } from "../context/ThemeContext";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        
        {/* Desktop Header — sirf dark mode toggle */}
        <div className="hidden lg:flex justify-end items-center p-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {darkMode ? (
              <FiSun size={22} className="text-yellow-400" />
            ) : (
              <FiMoon size={22} className="text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
          >
            <FiMenu size={24} />
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-white"
          >
            {darkMode ? (
              <FiSun size={20} className="text-yellow-400" />
            ) : (
              <FiMoon size={20} />
            )}
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;