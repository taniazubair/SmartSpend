import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiSend } from "react-icons/fi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });

      setIsSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: "🔐",
      title: "Secure Reset",
      description: "Your password reset link expires in 15 minutes",
    },
    {
      icon: "📧",
      title: "Email Verified",
      description: "Link sent only to registered email addresses",
    },
    {
      icon: "⚡",
      title: "Quick Process",
      description: "Reset your password in under a minute",
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

        <div className="relative z-10 flex flex-col justify-between w-full p-16 text-white">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold mb-4 tracking-tight">SmartSpend</h1>
              <p className="text-blue-100 text-lg">Your personal finance companion</p>
            </motion.div>
          </div>

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
                  className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 text-2xl"
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="text-sm text-blue-200">© 2026 SmartSpend. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50">
            {!isSent ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
                  >
                    <FiArrowLeft className="mr-2" />
                    Back to Login
                  </Link>
                </motion.div>

                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.4 }}
                    className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FiMail className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                  <p className="text-gray-500">Enter your email and we'll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
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
                        placeholder="Enter your registered email"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white/50 hover:border-blue-300"
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Send Reset Link
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email!</h3>
                <p className="text-gray-500 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Didn't receive it? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Login
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;