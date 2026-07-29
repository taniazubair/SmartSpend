import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTag, FiCalendar, FiFileText, FiPlus, FiSave } from "react-icons/fi";

function AddExpenseModal({ isOpen, onClose, onExpenseAdded, editingExpense, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || "",
        amount: editingExpense.amount || "",
        category: editingExpense.category || "Food",
        date: editingExpense.date 
          ? new Date(editingExpense.date).toISOString().split("T")[0] 
          : new Date().toISOString().split("T")[0],
        notes: editingExpense.notes || "",
      });
    } else {
      setFormData({
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
    setErrors({});
  }, [editingExpense, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (!formData.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes.trim(),
      };

      if (editingExpense) {
        await axios.put(
          `https://smartspend-production-2753.up.railway.app/api/expenses/${editingExpense._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Expense updated successfully!");
      } else {
        await axios.post(
          "https://smartspend-production-2753.up.railway.app/api/expenses",
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Expense added successfully!");
      }

      if (onExpenseAdded) {
        onExpenseAdded();
      }
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        (editingExpense ? "Failed to update expense" : "Failed to add expense")
      );
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  const categories = [
    "Food", "Shopping", "Transport", "Bills", 
    "Entertainment", "Health", "Education", "Other"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-700/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="text-2xl font-bold text-white">
                  {editingExpense ? "Edit Expense" : "Add Expense"}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <FiX className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2.5">
                    Expense Title
                  </label>
                  <div className="relative">
                    <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Grocery Shopping"
                      disabled={isSubmitting}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-700/50 border ${
                        errors.title ? "border-red-500/50" : "border-slate-600/50"
                      } text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-50 text-sm`}
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2.5">
                    Amount (Rs.)
                  </label>
                  <div className="relative">
            
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="e.g. 2500"
                      min="1"
                      disabled={isSubmitting}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-700/50 border ${
                        errors.amount ? "border-red-500/50" : "border-slate-600/50"
                      } text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-50 text-sm`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.amount}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2.5">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-slate-700/50 border border-slate-600/50 text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-50 text-sm appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-800 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2.5">
                    Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-700/50 border ${
                        errors.date ? "border-red-500/50" : "border-slate-600/50"
                      } text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-50 text-sm [color-scheme:dark]`}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.date}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2.5">
                    Notes (Optional)
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Add any details..."
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-50 text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </span>
                    ) : editingExpense ? (
                      <>
                        <FiSave className="w-5 h-5" />
                        Update Expense
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-5 h-5" />
                        Add Expense
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AddExpenseModal;