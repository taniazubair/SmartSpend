import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTarget, FiCalendar } from "react-icons/fi";

function AddGoalModal({ isOpen, onClose, onAddGoal, editingGoal, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title || "",
        targetAmount: editingGoal.targetAmount || "",
        deadline: editingGoal.deadline
          ? new Date(editingGoal.deadline).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData({
        title: "",
        targetAmount: "",
        deadline: "",
      });
    }
    setErrors({});
  }, [editingGoal, isOpen]);

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
      savedAmount: editingGoal?.savedAmount || 0,
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-700/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 pb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingGoal ? "Edit Goal" : "Create Goal"}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <FiX className="w-5 h-5 text-gray-500 dark:text-gray-600 dark:text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-400uppercase tracking-wider mb-2.5">
                    Goal Title
                  </label>
                  <div className="relative">
                    <FiTarget className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., New Car, Emergency Fund"
                      disabled={isSubmitting}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border ${errors.title
                        ? "border-red-500/50"
                        : "border-gray-300 dark:border-slate-600/50"
                        } text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-50 text-sm`}
                    /> </div>
                  {errors.title && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>
                  )}
                </div>

                {/* Target Amount - NO ICON */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Target Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    min="1"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border ${errors.targetAmount
                      ? "border-red-500/50"
                      : "border-gray-300 dark:border-slate-600/50"
                      } text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-50 text-sm`}
                  />
                  {errors.targetAmount && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.targetAmount}</p>
                  )}
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                    Target Date
                  </label>
                  <div className="relative">

                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-700/50 border ${errors.deadline
                          ? "border-red-500/50"
                          : "border-gray-300 dark:border-slate-600/50"
                        } text-slate-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all disabled:opacity-50 text-sm`}
                    />
                  </div>
                  {errors.deadline && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.deadline}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </span>
                    ) : editingGoal ? (
                      "Update Goal"
                    ) : (
                      "Create Goal"
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