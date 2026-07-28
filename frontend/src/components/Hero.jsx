import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTrendingUp,
  FiTarget,
  FiPieChart,
} from "react-icons/fi";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
              💙 Personal Finance Made Simple
            </span>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mt-8 leading-tight">
              Track Every
              <br />
              <span className="text-cyan-200">Rupee</span>.
              <br />
              Save Smarter.
            </h1>

            <p className="text-blue-100 text-lg mt-8 leading-8 max-w-xl">
              SmartSpend helps you manage expenses, stay within budget,
              achieve savings goals, and understand your spending through
              beautiful analytics.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/register"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-slate-100 transition"
              >
                Get Started
                <FiArrowRight />
              </Link>

              <Link
                to="/login"
                className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition"
              >
                Login
              </Link>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <FiPieChart className="text-white text-3xl mb-3" />
                <h3 className="text-white font-semibold">
                  Expense Tracking
                </h3>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <FiTrendingUp className="text-white text-3xl mb-3" />
                <h3 className="text-white font-semibold">
                  Budget Planning
                </h3>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <FiTarget className="text-white text-3xl mb-3" />
                <h3 className="text-white font-semibold">
                  Savings Goals
                </h3>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-cyan-300 rounded-full blur-3xl opacity-20"></div>

            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20"></div>

            <div className="relative bg-white rounded-3xl shadow-2xl p-6">
              <img
                src="/dashboard-preview.png"
                alt="SmartSpend Dashboard"
                className="rounded-2xl w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;