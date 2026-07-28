import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

function VerifyEmail() {
  const { token } = useParams();

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(
          `https://smartspend-production-2753.up.railway.app/api/auth/verify-email/${token}`
        );

        setStatus("success");
        toast.success("Email verified successfully!");

      } catch (error) {
        setStatus("error");
        toast.error(
          error.response?.data?.message ||
          "Invalid or expired verification link"
        );
      }
    };

    verifyEmail();
  }, [token]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-white/50"
      >

        {status === "verifying" && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Verifying Email...
            </h2>

            <p className="text-gray-500">
              Please wait while we verify your account.
            </p>
          </>
        )}


        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiCheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Email Verified!
            </h2>

            <p className="text-gray-500 mb-6">
              Your SmartSpend account is now verified.
            </p>

            <Link
              to="/login"
              className="inline-block w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold"
            >
              Go to Login
            </Link>
          </>
        )}


        {status === "error" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiXCircle className="w-10 h-10 text-red-600" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Verification Failed
            </h2>

            <p className="text-gray-500 mb-6">
              This verification link is invalid or expired.
            </p>

            <Link
              to="/register"
              className="inline-block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
              Create New Account
            </Link>
          </>
        )}

      </motion.div>

    </div>
  );
}

export default VerifyEmail;