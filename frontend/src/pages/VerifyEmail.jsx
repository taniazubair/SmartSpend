import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://smartspend-production-2753.up.railway.app/api";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`${API_BASE_URL}/auth/verify-email/${token}`);
        setStatus("success");
        toast.success("Email verified successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } catch (error) {
        setStatus("error");
        toast.error(error.response?.data?.message || "Invalid or expired link");
      }
    };

    if (token) verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email...
            </h2>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-600 mb-3">
              Email Verified
            </h2>
            <p className="text-gray-600">
              Your account has been verified.
              <br />
              Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-3">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-4">
              This link is invalid or has expired.
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;