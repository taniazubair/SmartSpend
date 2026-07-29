import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTarget, FiDollarSign, FiCalendar, FiPlus, FiSave } from "react-icons/fi";

function AddGoalModal({ isOpen, onClose, onAddGoal, editingGoal, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title || "",
        targetAmount: editingGoal.targetAmount || "",
        savedAmount: editingGoal.savedAmount || "",
        deadline: editingGoal.deadline 
          ? new Date(editingGoal.deadline).toISOString().split("T")[0] 
          : "",
      });
    } else {
      setFormData({
        title: "",
        targetAmount: "",
        savedAmount: "",
        deadline: "",
      });
    }
    setErrors({});
  }, [editingGoal, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Valid target amount is required";
    }
    if (!formData.deadline) newErrors.deadline = "Deadline is required";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.deadline && new Date(formData.deadline) < today) {
      newErrors.deadline = "Deadline cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onAddGoal({
      title: formData.title.trim(),
      targetAmount: Number(formData.targetAmount),
      savedAmount: Number(formData.savedAmount) || 0,
      deadline: formData.deadline,
    });
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto border border-gray-100 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                    {editingGoal ? (
                      <FiSave className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FiPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {editingGoal ? "Edit Goal" : "Create New Goal"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {editingGoal ? "Update your savings goal" : "Set a new financial target"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Goal Title
                  </label>
                  <div className="relative">
                    <FiTarget className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., New Car, Emergency Fund"
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.title 
                          ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-gray-200 dark:border-slate-600 focus:ring-blue-500/20 focus:border-blue-500"
                      } bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 transition-all disabled:opacity-50`}
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Amount (Rs.)
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      placeholder="50000"
                      min="1"
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.targetAmount 
                          ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-gray-200 dark:border-slate-600 focus:ring-blue-500/20 focus:border-blue-500"
                      } bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 transition-all disabled:opacity-50`}
                    />
                  </div>
                  {errors.targetAmount && (
                    <p className="mt-1 text-sm text-red-500">{errors.targetAmount}</p>
                  )}
                </div>

                {/* Saved Amount (only when editing) */}
                {editingGoal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Already Saved (Rs.)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="savedAmount"
                        value={formData.savedAmount}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        disabled={isSubmitting}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        errors.deadline 
                          ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
                          : "border-gray-200 dark:border-slate-600 focus:ring-blue-500/20 focus:border-blue-500"
                      } bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 transition-all disabled:opacity-50`}
                    />
                  </div>
                  {errors.deadline && (
                    <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : editingGoal ? (
                      <>
                        <FiSave className="w-5 h-5" />
                        Update Goal
                      </>
                    ) : (
                      <>
                        <FiPlus className="w-5 h-5" />
                        Create Goal
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

export default AddGoalModal;