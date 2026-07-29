import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiBriefcase, FiTag, FiCalendar } from "react-icons/fi";

const INCOME_CATEGORIES = ["Salary", "Freelance", "Business", "Gift", "Investment", "Other"];

function AddIncomeModal({ isOpen, onClose, onIncomeAdded, editingIncome }) {
  const [form, setForm] = useState({
    amount: "",
    source: "",
    category: "Other",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or editingIncome changes
  useEffect(() => {
    if (isOpen && editingIncome) {
      setForm({
        amount: editingIncome.amount?.toString() || "",
        source: editingIncome.source || "",
        category: editingIncome.category || "Other",
        date: editingIncome.date ? editingIncome.date.slice(0, 10) : "",
      });
    } else if (isOpen && !editingIncome) {
      setForm({
        amount: "",
        source: "",
        category: "Other",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen, editingIncome]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.source || !form.date) return;

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (editingIncome) {
        await axios.put(
          `https://smartspend-production-2753.up.railway.app/api/income/${editingIncome._id}`,
          payload,
          config
        );
        onIncomeAdded("Income updated successfully");
      } else {
        await axios.post(
          "https://smartspend-production-2753.up.railway.app/api/income",
          payload,
          config
        );
        onIncomeAdded("Income added successfully");
      }

      onClose();
    } catch (error) {
      console.error(error);
      onIncomeAdded("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-700"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingIncome ? "Edit Income" : "Add Income"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {editingIncome ? "Update your income details" : "Track a new source of income"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div className="relative">
    
              <input
                type="number"
                placeholder="Amount"
                min="0"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Source */}
            <div className="relative">
              <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Source (e.g. Monthly Salary)"
                required
                value={form.source}
                onChange={(e) => handleChange("source", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                {INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="relative">
              <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : editingIncome ? (
                "Update Income"
              ) : (
                "Add Income"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddIncomeModal;