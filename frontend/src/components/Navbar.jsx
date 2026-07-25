import { FiBell, FiSearch, FiUser } from "react-icons/fi";

function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">

      {/* Left */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back 
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-3 w-80">

          <FiSearch className="text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3 w-full"
          />

        </div>

        {/* Notification */}
        <button className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">

          <FiBell size={22} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white">

            <FiUser size={20} />

          </div>

          <div className="hidden md:block">
            <h4 className="font-semibold">Tania</h4>
            <p className="text-sm text-gray-500">Student</p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;