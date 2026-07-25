const Budget = require("../models/Budget");
const Expense = require("../models/expense");

// ===============================
// Create Budget
// ===============================
const createBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    const budget = await Budget.create({
      user: req.user.id,
      category,
      limit,
      month,
    });

    res.status(201).json({
      success: true,
      data: budget,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Budgets
// ===============================
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Expense.find({
          user: req.user.id,
          category: budget.category,
        });

        const spent = expenses.reduce(
          (total, expense) => total + expense.amount,
          0
        );

        const remaining = budget.limit - spent;

        const percentage =
          budget.limit > 0
            ? Math.min((spent / budget.limit) * 100, 100)
            : 0;

        return {
          ...budget.toObject(),
          spent,
          remaining,
          percentage,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: budgetsWithProgress,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// Update Budget
// ===============================
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      data: budget,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Budget
// ===============================
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};