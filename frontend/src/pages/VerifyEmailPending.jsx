import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Clock, RefreshCw, Mail } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://smartspend-production-2753.up.railway.app/api";
const RESEND_COOLDOWN = 60;

function VerifyEmailPending() {
  const location = useLocation();
  const email = location.state?.email || "";

  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  // Load cooldown from localStorage
  useEffect(() => {
    const lastSent = localStorage.getItem("verificationEmailSentAt");
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
      const remaining = Math.max(0, RESEND_COOLDOWN - elapsed);
      if (remaining > 0) setCooldown(remaining);
    }
    return () => clearInterval(intervalRef.current);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      intervalRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || loading || !email) return;

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/auth/resend-verification`,
        { email },
        { timeout: 15000 }
      );

      setCooldown(RESEND_COOLDOWN);
      localStorage.setItem("verificationEmailSentAt", Date.now().toString());
      toast.success("Verification email resent!", { icon: "📧" });

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  }, [email, cooldown, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Check Your Email 📩
        </h2>

        <p className="text-gray-600 mb-2">
          We have sent a verification link to your email address.
          Please click the link to verify your account before logging in.
        </p>

        {email && (
          <p className="text-sm font-medium text-blue-600 bg-blue-50 rounded-lg py-2 px-3 mb-6">
            {email}
          </p>
        )}

        {/* Resend Section */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Didn't receive the email?</p>

          <button
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className={`w-full flex items-center justify-center gap-2 font-medium py-2.5 px-4 rounded-xl transition-all
              ${cooldown > 0 || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : cooldown > 0 ? (
              <>
                <Clock className="w-4 h-4" />
                Resend in {cooldown}s
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Verification Email
              </>
            )}
          </button>

          {cooldown > 0 && (
            <p className="text-xs text-amber-600">
              Email resend will be available after {cooldown} seconds
            </p>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-gray-800 font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPending;