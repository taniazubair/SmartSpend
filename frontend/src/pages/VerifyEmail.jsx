import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  MailCheck, 
  Loader2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  ShieldCheck,
  Mail,
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://smartspend-production-2753.up.railway.app/api";
const RESEND_COOLDOWN = 60; // seconds

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  RESENDING: "resending",
};

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const redirectTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const [status, setStatus] = useState(STATUS.LOADING);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  // ─── Load cooldown from localStorage on mount ───
  useEffect(() => {
    const storedExpiry = localStorage.getItem("resendCooldownExpiry");
    if (storedExpiry) {
      const remaining = Math.ceil((parseInt(storedExpiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setResendCooldown(remaining);
      } else {
        localStorage.removeItem("resendCooldownExpiry");
      }
    }
  }, []);

  // ─── Countdown timer effect ───
  useEffect(() => {
    if (resendCooldown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            localStorage.removeItem("resendCooldownExpiry");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [resendCooldown]);

  const clearPendingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (redirectTimerRef.current) {
      clearInterval(redirectTimerRef.current);
      clearTimeout(redirectTimerRef.current);
    }
  }, []);

  const handleRedirect = useCallback(() => {
    clearPendingRequests();
    navigate("/login", { replace: true });
  }, [navigate, clearPendingRequests]);

  const startRedirectCountdown = useCallback(() => {
    setCountdown(5);
    
    redirectTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(redirectTimerRef.current);
          navigate("/login", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [navigate]);

  const verifyEmail = useCallback(async () => {
    if (!token) {
      setStatus(STATUS.ERROR);
      setErrorMessage("Invalid verification link. No token provided.");
      toast.error("Invalid verification link");
      return;
    }

    clearPendingRequests();
    abortControllerRef.current = new AbortController();

    setStatus(STATUS.LOADING);
    setErrorMessage("");

    try {
      await axios.get(
        `${API_BASE_URL}/auth/verify-email/${token}`,
        {
          signal: abortControllerRef.current.signal,
          timeout: 15000,
        }
      );

      setStatus(STATUS.SUCCESS);
      toast.success("Email verified successfully!", { duration: 4000 });
      startRedirectCountdown();

    } catch (error) {
      if (axios.isCancel(error)) return;

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "This verification link is invalid or has expired.";

      // Try to extract email from error response if backend sends it
      const emailFromError = error.response?.data?.email;
      if (emailFromError) setUserEmail(emailFromError);

      setStatus(STATUS.ERROR);
      setErrorMessage(message);
      toast.error(message, { duration: 5000 });
    }
  }, [token, clearPendingRequests, startRedirectCountdown]);

  // ─── RESEND EMAIL ───
  const resendEmail = useCallback(async () => {
    if (resendCooldown > 0) return;

    if (!userEmail) {
      toast.error("Please enter your email to resend verification");
      return;
    }

    setStatus(STATUS.RESENDING);
    abortControllerRef.current = new AbortController();

    try {
      await axios.post(
        `${API_BASE_URL}/auth/resend-verification`,
        { email: userEmail },
        {
          signal: abortControllerRef.current.signal,
          timeout: 15000,
        }
      );

      toast.success("Verification email sent! Check your inbox.");
      
      // Start 60s cooldown
      setResendCooldown(RESEND_COOLDOWN);
      const expiryTime = Date.now() + RESEND_COOLDOWN * 1000;
      localStorage.setItem("resendCooldownExpiry", expiryTime.toString());

      setStatus(STATUS.ERROR); // Stay on error screen but show success toast

    } catch (error) {
      if (axios.isCancel(error)) return;
      
      const msg = error.response?.data?.message || "Failed to resend email. Try again later.";
      toast.error(msg, { duration: 5000 });
      setStatus(STATUS.ERROR);
    }
  }, [userEmail, resendCooldown]);

  useEffect(() => {
    verifyEmail();

    return () => {
      clearPendingRequests();
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [verifyEmail, clearPendingRequests]);

  useEffect(() => {
    const handleBeforeUnload = () => clearPendingRequests();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [clearPendingRequests]);

  const renderContent = () => {
    switch (status) {
      case STATUS.LOADING:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-5 py-4"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-blue-100 border-t-blue-600 animate-spin" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Verifying your email
              </h2>
              <p className="text-sm text-gray-500 max-w-xs">
                Please wait while we confirm your email address. This may take a few seconds.
              </p>
            </div>
          </motion.div>
        );

      case STATUS.SUCCESS:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="flex flex-col items-center gap-5 py-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center ring-4 ring-green-100"
            >
              <ShieldCheck className="w-10 h-10 text-green-600" />
            </motion.div>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Email Verified!
              </h2>
              <p className="text-gray-600 max-w-xs leading-relaxed">
                Your account has been successfully verified. You can now access all features.
              </p>
            </div>

            <div className="w-full space-y-3 pt-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg py-2.5 px-4">
                <MailCheck className="w-4 h-4" />
                <span>Redirecting to login in {countdown}s</span>
              </div>

              <button
                onClick={handleRedirect}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
              >
                Go to Login Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        );

      case STATUS.ERROR:
      case STATUS.RESENDING:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center gap-5 py-2"
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center ring-4 ring-red-100"
            >
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </motion.div>

            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold text-gray-900">
                Verification Failed
              </h2>
              <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                {errorMessage}
              </p>
            </div>

            {/* ─── EMAIL INPUT FOR RESEND ─── */}
            <div className="w-full space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enter your email to resend
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="w-full space-y-3 pt-2">
              {/* ─── RESEND BUTTON WITH COOLDOWN ─── */}
              <button
                onClick={resendEmail}
                disabled={status === STATUS.RESENDING || resendCooldown > 0 || !userEmail}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                {status === STATUS.RESENDING ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <Timer className="w-4 h-4" />
                    Resend available in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend Verification Email
                  </>
                )}
              </button>

              {/* ─── COOLDOWN MESSAGE ─── */}
              {resendCooldown > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-center text-amber-600 bg-amber-50 rounded-lg py-2 px-3"
                >
                  Email resend will be available after {resendCooldown} seconds
                </motion.p>
              )}

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200"
              >
                Back to Login
              </Link>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-blue-900/5 border border-white/50 backdrop-blur-sm overflow-hidden"
      >
        <AnimatePresence>
          {status === STATUS.LOADING && (
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"
            />
          )}
        </AnimatePresence>

        <div className="p-8 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-400">
            Need help?{" "}
            <Link to="/support" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;