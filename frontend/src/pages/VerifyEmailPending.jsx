import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Mail,
  Clock,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Inbox,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://smartspend-production-2753.up.railway.app/api";
const RESEND_COOLDOWN = 60;

function VerifyEmailPending() {
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef(null);

  // ─── Load cooldown from localStorage ───
  useEffect(() => {
    const lastSent = localStorage.getItem("verificationEmailSentAt");
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
      const remaining = Math.max(0, RESEND_COOLDOWN - elapsed);
      if (remaining > 0) setCooldown(remaining);
    }
    return () => clearInterval(intervalRef.current);
  }, []);

  // ─── Countdown timer ───
  useEffect(() => {
    if (cooldown > 0) {
      intervalRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            localStorage.removeItem("verificationEmailSentAt");
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
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (cooldown > 0 || loading) return;

    setCooldown(RESEND_COOLDOWN);
    localStorage.setItem("verificationEmailSentAt", Date.now().toString());
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/auth/resend-verification`,
        { email: email.trim() },
        { timeout: 15000 }
      );
      toast.success("Verification email resent!", { icon: "📧", duration: 4000 });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend. Please try again.",
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  }, [email, cooldown, loading]);

  const progress = cooldown > 0 ? ((RESEND_COOLDOWN - cooldown) / RESEND_COOLDOWN) * 100 : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-blue-900/5 border border-white/50 overflow-hidden"
      >
        {/* Progress bar */}
        {cooldown > 0 && (
          <div className="w-full h-1 bg-gray-100">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        )}

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center ring-4 ring-blue-100/50">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center ring-2 ring-white">
                <Sparkles className="w-4 h-4 text-yellow-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Check Your Inbox
              </h1>
              <p className="text-gray-600 max-w-sm leading-relaxed">
                We've sent a verification link to your email. Click the link to
                activate your account.
              </p>
            </div>
          </div>

          {/* ─── TIMER + BUTTON ─── */}
          <div className="space-y-3">
            {/* Timer */}
            {cooldown > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-xl py-3 px-4"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Resend available in {cooldown} seconds</span>
              </motion.div>
            )}

            {/* Resend Button */}
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              className={`w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed
                ${
                  cooldown > 0 || loading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
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
                  Wait {cooldown}s
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </button>

            {/* ─── GO TO GMAIL ─── */}
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4" />
              Open Gmail
            </a>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Troubleshooting Tips
            </p>
            <ul className="space-y-2.5">
              {[
                { icon: <Inbox className="w-4 h-4" />, text: "Check your spam/junk folder" },
                { icon: <Clock className="w-4 h-4" />, text: "Emails may take up to 5 minutes to arrive" },
                { icon: <AlertCircle className="w-4 h-4" />, text: "Ensure you entered the correct email address" },
              ].map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-amber-900/80"
                >
                  <span className="mt-0.5 text-amber-600 shrink-0">{tip.icon}</span>
                  {tip.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-2 border-t border-gray-100">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyEmailPending;