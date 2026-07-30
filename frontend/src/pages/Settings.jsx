import { useEffect, useState, useCallback } from "react";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProfile,
  updateProfile,
  changePassword
} from "../services/settingsService";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";
import { ThemeContext } from "../context/ThemeContext";

import {
  FiUser,
  FiMail,
  FiMoon,
  FiSun,
  FiLogOut,
  FiLock,
  FiRefreshCw,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiShield,
  FiEdit3,
  FiSave,
  FiX,
} from "react-icons/fi";

// ─── Animation Variants ────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

// ─── Skeleton Loader ─────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div>
          <div className="w-32 h-5 rounded bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
          <div className="w-48 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="w-full h-12 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
        <div className="w-full h-12 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Reusable Input Field ─────────────────────────────────

function InputField({ label, icon: Icon, type = "text", value, onChange, placeholder, disabled = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Section Card Wrapper ─────────────────────────────────

function SectionCard({ children, title, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      variants={item}
      custom={delay}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Main Settings Component ────────────────────────────────

function Settings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "" });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch user profile on mount
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProfile();
const userData = res.data?.data?.user || {};

setProfile(userData);
setFormData({
  name: userData.name || "",
  email: userData.email || "",
});
    } catch (error) {
      console.log(error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle profile update (name or email change)
  const handleUpdateProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setSaving(true);

      // If only name changed (email stays the same)
      if (formData.email === profile.email) {
        const res = await updateProfile({
          name: formData.name,
          email: formData.email,
        });

        setProfile(res.data.data.user);
        setEditMode(false);
        toast.success("Profile updated successfully");
        return;
      }

      // If email changed: first update name on profile
      await updateProfile({
        name: formData.name,
        email: profile.email,
      });

      // Then send email change confirmation request
      const response = await fetch(
        "https://smartspend-production-2753.up.railway.app/api/users/request-email-change",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            newEmail: formData.email,
          }),
        }
      );

      // Parse the JSON response from the server
      const data = await response.json();

      // If response is not ok (400, 500, etc.), throw error with server message
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setEditMode(false);
      toast.success(
        "Confirmation email sent. Please check your inbox to confirm your new email."
      );
    } catch (error) {
      console.log(error);
      // Show the actual error message in a toast (e.g. "This email already exists")
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setChangingPassword(true);
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Generate avatar initials from name
  const getInitials = (name) => {
    return (name || "U")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse mb-2" />
            <div className="w-48 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
          </div>
          <SkeletonCard />
          <div className="mt-6"><SkeletonCard /></div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout title="Settings">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">{error}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={fetchProfile}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto"
      >
        {/* Page Header */}
        <motion.div variants={item} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage your account, security, and preferences.
          </p>
        </motion.div>

        {/* Profile Information Card */}
        <SectionCard title="Profile Information" icon={FiUser} delay={0}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25">
              {getInitials(profile?.name || user?.name)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {profile?.name || user?.name || "User"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.email || user?.email || "No email"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InputField
              label="Full Name"
              icon={FiUser}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              disabled={!editMode}
            />
            <InputField
              label="Email Address"
              icon={FiMail}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              disabled={!editMode}
            />

            <div className="flex items-center gap-3 pt-2">
              {editMode ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    {saving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    Save Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setEditMode(false);
                      setFormData({ name: profile?.name || "", email: profile?.email || "" });
                    }}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  <FiEdit3 className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Security / Password Card */}
        <div className="mt-6">
          <SectionCard title="Security" icon={FiShield} delay={1}>
            <div className="space-y-4">
              <InputField
                label="Current Password"
                icon={FiLock}
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                placeholder="Enter current password"
              />
              <InputField
                label="New Password"
                icon={FiLock}
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
              <InputField
                label="Confirm New Password"
                icon={FiLock}
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm mt-2"
              >
                {changingPassword ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <FiLock className="w-4 h-4" />
                )}
                Change Password
              </motion.button>
            </div>
          </SectionCard>
        </div>

        {/* Appearance / Dark Mode Toggle */}
        <div className="mt-6">
          <SectionCard title="Appearance" icon={darkMode ? FiMoon : FiSun} delay={2}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Toggle between light and dark theme
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`relative p-1 rounded-full w-14 h-8 transition-colors duration-300 ${darkMode ? "bg-blue-600" : "bg-gray-200 dark:bg-slate-700"}`}
              >
                <motion.div
                  animate={{ x: darkMode ? 24 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                >
                  {darkMode ? (
                    <FiMoon className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <FiSun className="w-3.5 h-3.5 text-amber-500" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </SectionCard>
        </div>

        {/* Logout Section */}
        <motion.div variants={item} className="mt-6">
          <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-500/10">
                  <FiLogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">Logout</p>
                  <p className="text-xs text-red-600/70 dark:text-red-300/70">
                    Sign out of your account on this device
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-red-200"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center border border-gray-100 dark:border-slate-700"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Logout?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Are you sure you want to sign out of your account?
              </p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium text-sm transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  Yes, Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default Settings;