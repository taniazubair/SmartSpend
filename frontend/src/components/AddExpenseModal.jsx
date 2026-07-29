import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { FiX } from "react-icons/fi";

function AddExpenseModal({ isOpen, onClose, onExpenseAdded, expenseToEdit }) {
  const { theme } = useTheme();
  const isEditing = !!expenseToEdit;

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || "",
        amount: expenseToEdit.amount || "",
        category: expenseToEdit.category || "Food",
        date: expenseToEdit.date
          ? expenseToEdit.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        notes: expenseToEdit.notes || "",
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
  }, [expenseToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(
          `https://smartspend-production-2753.up.railway.app/api/expenses/${expenseToEdit._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Expense Updated Successfully!");
      } else {
        await axios.post(
          "https://smartspend-production-2753.up.railway.app/api/expenses",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Expense Added Successfully!");
      }

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });

      if (onExpenseAdded) {
        onExpenseAdded();
      }
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to ${isEditing ? "update" : "add"} expense`
      );
    }
  };

  const inputClass =
    "w-full border border-gray-200 dark:border-slate-600 rounded-xl p-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-colors";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-slate-700 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {isEditing ? "Edit Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{ colorScheme: theme === "dark" ? "dark" : "light" }}
            className={inputClass}
            required
          />

          <textarea
            name="notes"
            placeholder="Notes..."
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={inputClass + " resize-none"}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-500/25"
            >
              {isEditing ? "Update Expense" : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseModal;