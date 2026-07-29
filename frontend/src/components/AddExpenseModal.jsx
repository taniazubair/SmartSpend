import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiType, FiTag, FiCalendar } from "react-icons/fi";

const EXPENSE_CATEGORIES = ["Food", "Shopping", "Transport", "Bills", "Entertainment", "Health", "Education", "Other"];

function AddExpenseModal({ isOpen, onClose, onExpenseAdded, expenseToEdit }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && expenseToEdit) {
      setForm({
        title: expenseToEdit.title || "",
        amount: expenseToEdit.amount?.toString() || "",
        category: expenseToEdit.category || "Food",
        date: expenseToEdit.date ? expenseToEdit.date.slice(0, 10) : "",
      });
    } else if (isOpen && !expenseToEdit) {
      setForm({
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen, expenseToEdit]);

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
    if (!form.title || !form.amount || !form.date) return;

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

      if (expenseToEdit) {
        await axios.put(
          `https://smartspend-production-2753.up.railway.app/api/expenses/${expenseToEdit._id}`,
          payload,
          config
        );
        onExpenseAdded("Expense updated successfully");
      } else {
        await axios.post(
          "https://smartspend-production-2753.up.railway.app/api/expenses",
          payload,
          config
        );
        onExpenseAdded("Expense added successfully");
      }

      onClose();
    } catch (error) {
      console.error(error);
      onExpenseAdded("Something went wrong", "error");
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {expenseToEdit ? "Edit Expense" : "Add Expense"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {expenseToEdit ? "Update your expense details" : "Track a new expense"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Expense Title
              </label>

              <div className="relative">
                <FiType className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  type="text"
                  placeholder="e.g. Grocery Shopping"
                  required
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Amount (Rs.)
              </label>

              <input
                type="number"
                placeholder="e.g. 2500"
                min="0"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Category
              </label>

              <div className="relative">
                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-0 text-slate-500 w-5 h-5 pointer-events-none" />

                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 text-slate-900 dark:text-white appearance-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="bg-slate-700 text-white"
                    >
                      {cat}
                    </option>
                  ))}
                </select>

                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Expense Date
              </label>

              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600/50 text-slate-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : expenseToEdit ? (
                "Update Expense"
              ) : (
                "Add Expense"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddExpenseModal;