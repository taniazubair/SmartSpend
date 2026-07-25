import { useState, useEffect } from "react";

function AddGoalModal({
  isOpen,
  onClose,
  onAddGoal,
  editingGoal,
}) {
  const [goal, setGoal] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  useEffect(() => {
    if (editingGoal) {
      setGoal({
        title: editingGoal.title,
        targetAmount: editingGoal.targetAmount,
        deadline: editingGoal.deadline
          ? editingGoal.deadline.substring(0, 10)
          : "",
      });
    } else {
      setGoal({
        title: "",
        targetAmount: "",
        deadline: "",
      });
    }
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setGoal({
      ...goal,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newGoal = {
      title: goal.title,
      targetAmount: Number(goal.targetAmount),
      deadline: goal.deadline,
    };

    // Send data to Goals.jsx
    await onAddGoal(newGoal);

    // Reset form
    setGoal({
      title: "",
      targetAmount: "",
      deadline: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800">
          {editingGoal ? "Edit Goal" : "Create Goal"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Goal Name"
            value={goal.title}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="number"
            name="targetAmount"
            placeholder="Target Amount"
            value={goal.targetAmount}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="date"
            name="deadline"
            value={goal.deadline}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-xl text-sm sm:text-base font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-medium"
            >
              {editingGoal ? "Update Goal" : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGoalModal;