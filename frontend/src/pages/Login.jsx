import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";


import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiTrendingUp,
  FiDollarSign,
  FiTarget,
} from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
  if (searchParams.get("emailChanged")) {
    toast.success("Email changed successfully. Please login.");
  }
}, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://smartspend-production-2753.up.railway.app/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      toast.success("Welcome Back to SmartSpend!");
      navigate("/dashboard");

    } catch (error) {
      // ✅ FIXED: Handle ALL possible error formats from backend
      let errorMessage = "Login Failed. Please try again.";

      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        const data = error.response.data;

        // Backend might send: { message: "..." } OR { error: "..." } OR { msg: "..." }
        errorMessage =
          data?.message ||
          data?.error ||
          data?.msg ||
          data?.errors?.[0]?.msg ||
          `Error ${error.response.status}: ${error.response.statusText}`;

      } else if (error.request) {
        // Request made but no response (server down, CORS, network)
        errorMessage = "Cannot connect to server. Please check your internet.";

      } else {
        // Something else happened
        errorMessage = error.message || "An unexpected error occurred.";
      }

      toast.error(errorMessage);
      console.error("Login error:", error); // For debugging

    } finally {
      setIsLoading(false);
    }
  };

  // Feature data for the left side
  const features = [
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Track Growth",
      description: "Monitor your financial progress in real-time",
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      title: "Smart Budgeting",
      description: "AI-powered insights for better spending",
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Goal Setting",
      description: "Set and achieve your financial milestones",
    },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* LEFT SIDE */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#7C3AED]"
      >
        {/* Decorative Circles with animation */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[450px] h-[450px] rounded-full bg-cyan-300/20 blur-3xl -top-32 -left-32"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute w-[350px] h-[350px] rounded-full bg-pink-400/20 blur-3xl bottom-0 right-0"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[200px] h-[200px] rounded-full bg-purple-400/15 blur-2xl top-1/2 left-1/3"
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-16 text-white">
          {/* Top Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold mb-4 tracking-tight">SmartSpend</h1>
              <p className="text-blue-100 text-lg">
                Your personal finance companion
              </p>
            </motion.div>
          </div>

          {/* Middle Section - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                className="flex items-start space-x-4 cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10"
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="text-sm text-blue-200">
              © 2026 SmartSpend. All rights reserved.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50"
          >
            <div className="text-center mb-8">
              <motion.h2
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                Welcome Back
              </motion.h2>
              <p className="text-gray-500">
                Sign in to continue to SmartSpend
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:border-blue-300"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:border-blue-300"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Remember & Forgot */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <motion.svg
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 text-white mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </motion.svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;