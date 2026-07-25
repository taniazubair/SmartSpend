import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AddExpenseModal({ isOpen, onClose, onExpenseAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    notes: "",
  });

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
      await axios.post(
        "http://https://smartspend-production-2753.up.railway.app/api/expenses",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Expense Added Successfully!");

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        date: "",
        notes: "",
      });

      // Refresh Dashboard
      if (onExpenseAdded) {
        onExpenseAdded();
      }

      // Close Modal
      onClose();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add expense"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">

        <h2 className="text-3xl font-bold mb-6">
          Add Expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Food</option>
            <option>Shopping</option>
            <option>Transport</option>
            <option>Bills</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Education</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />

          <textarea
            name="notes"
            placeholder="Notes..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save Expense
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddExpenseModal;