import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiTrendingUp,
  FiDollarSign,
  FiTarget,
} from "react-icons/fi";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      toast.success("Welcome to SmartSpend!");
      navigate("/dashboard");
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        const data = error.response.data;
        errorMessage =
          data?.message ||
          data?.error ||
          data?.msg ||
          data?.errors?.[0]?.msg ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Cannot connect to server. Please check your internet.";
      } else {
        errorMessage = error.message || "An unexpected error occurred.";
      }

      toast.error(errorMessage);
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* LEFT SIDE — Register Form (was right side in login) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
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
                Create Account
              </motion.h2>
              <p className="text-gray-500">
                Join SmartSpend and start your financial journey
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:border-blue-300"
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:border-blue-300"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
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

              {/* Confirm Password */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:border-blue-300"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
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
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT SIDE — SmartSpend Panel (was left side in login) */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#7C3AED]"
      >
        {/* Decorative Circles with animation */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[450px] h-[450px] rounded-full bg-cyan-300/20 blur-3xl -top-32 -right-32"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute w-[350px] h-[350px] rounded-full bg-pink-400/20 blur-3xl bottom-0 left-0"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[200px] h-[200px] rounded-full bg-purple-400/15 blur-2xl top-1/2 right-1/3"
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

          {/* Middle Section — Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                whileHover={{ x: -10, transition: { duration: 0.2 } }}
                className="flex items-start space-x-4 cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: -10, scale: 1.1 }}
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
    </div>
  );
}

export default Register;