import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  Mail, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Copy,
  ExternalLink,
  Inbox,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://smartspend-production-2753.up.railway.app/api";
const RESEND_COOLDOWN = 10; // seconds

function VerifyEmailPending() {
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [resendStatus, setResendStatus] = useState("idle"); // idle | loading | success | error
  const [cooldown, setCooldown] = useState(0);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef(null);

  // Initialize cooldown from localStorage (persist across refresh)
  useEffect(() => {
    const lastSent = localStorage.getItem("verificationEmailSentAt");
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
      const remaining = Math.max(0, RESEND_COOLDOWN - elapsed);
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  // Cooldown timer
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

  const handleCopyEmail = useCallback(() => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [email]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || resendStatus === "loading") return;

    setResendStatus("loading");
    
    try {
      await axios.post(
        `${API_BASE_URL}/auth/resend-verification`,
        { email },
        { timeout: 15000 }
      );

      setResendStatus("success");
      setCooldown(RESEND_COOLDOWN);
      localStorage.setItem("verificationEmailSentAt", Date.now().toString());
      
      toast.success("Verification email resent successfully!", {
        duration: 4000,
        icon: "📧",
      });

      // Reset success status after a while
      setTimeout(() => setResendStatus("idle"), 3000);

    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend email. Please try again.";
      setResendStatus("error");
      toast.error(message, { duration: 5000 });
      setTimeout(() => setResendStatus("idle"), 3000);
    }
  }, [email, cooldown, resendStatus]);

  const tips = [
    { icon: <Inbox className="w-4 h-4" />, text: "Check your spam/junk folder" },
    { icon: <Clock className="w-4 h-4" />, text: "Emails may take up to 5 minutes to arrive" },
    { icon: <AlertCircle className="w-4 h-4" />, text: "Ensure you entered the correct email address" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-blue-900/5 border border-white/50 overflow-hidden"
      >
        {/* Top decorative bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="p-8 sm:p-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center gap-4 mb-8"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center ring-4 ring-blue-100/50">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center ring-2 ring-white"
              >
                <Sparkles className="w-4 h-4 text-yellow-600" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Check Your Inbox
              </h1>
              <p className="text-gray-600 max-w-sm leading-relaxed">
                We've sent a verification link to your email address. Click the link to activate your account.
              </p>
            </div>
          </motion.div>

          {/* Email Display Box */}
          {email && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3 group hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sent to</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{email}</p>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="shrink-0 p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all active:scale-95"
                  title="Copy email address"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Resend Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 mb-8"
          >
            <p className="text-sm text-gray-500 text-center">
              Didn't receive the email?
            </p>

            <button
              onClick={handleResend}
              disabled={cooldown > 0 || resendStatus === "loading"}
              className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed
                ${cooldown > 0 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : resendStatus === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-200"
                }`}
            >
              {resendStatus === "loading" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : resendStatus === "success" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Email Sent Successfully
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  Resend available in {cooldown}s
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </button>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-3"
          >
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Troubleshooting Tips
            </p>
            <ul className="space-y-2.5">
              {tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 text-sm text-amber-900/80"
                >
                  <span className="mt-0.5 text-amber-600 shrink-0">{tip.icon}</span>
                  {tip.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 pb-8 pt-2 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Open Gmail
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyEmailPending;