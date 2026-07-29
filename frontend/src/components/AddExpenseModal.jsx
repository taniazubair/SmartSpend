import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { FiX } from "react-icons/fi";

function AddExpenseModal({ isOpen, onClose, onExpenseAdded, expenseToEdit }) {
  const { darkMode } = useTheme();
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
        amount: expenseToEdit.amount !== undefined ? String(expenseToEdit.amount) : "",
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
          { ...formData, amount: Number(formData.amount) },
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
          { ...formData, amount: Number(formData.amount) },
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

  const cardBg = darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100";
  const inputBg = darkMode ? "bg-slate-800 border-slate-600 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400";
  const titleText = darkMode ? "text-white" : "text-gray-900";
  const btnSecondary = darkMode ? "bg-slate-800 text-gray-300 hover:bg-slate-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${cardBg} rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border relative`}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"}`}
        >
          <FiX className="w-5 h-5" />
        </button>

        <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${titleText}`}>
          {isEditing ? "Edit Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${inputBg}`}
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className={`w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${inputBg}`}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${inputBg}`}
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
            style={{ colorScheme: darkMode ? "dark" : "light" }}
            className={`w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${inputBg}`}
            required
          />

          <textarea
            name="notes"
            placeholder="Notes..."
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className={`w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${inputBg}`}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl transition font-medium ${btnSecondary}`}
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