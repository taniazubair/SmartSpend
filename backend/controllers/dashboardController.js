const mongoose = require("mongoose");
const Expense = require("../models/expense");
const Budget = require("../models/Budget");
const SavingGoal = require("../models/SavingGoal");
const Income = require("../models/income");
const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Recent Expenses
    const recentExpenses = await Expense.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Budgets
    const budgets = await Budget.find({ user: userId });

    // Saving Goals
    const savingGoals = await SavingGoal.find({ user: userId });

    // Total Expenses
    const totalSpentResult = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
const totalIncome = await Income.aggregate([
  {
    $match: {
      user: new mongoose.Types.ObjectId(req.user.id),
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$amount",
      },
    },
  },
]);

const incomeAmount = totalIncome[0]?.total || 0;
console.log("INCOME AMOUNT:", incomeAmount);
    // Weekly Spending Analytics
    const weeklyAnalytics = await Expense.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: {
            $dayOfWeek: "$date",
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const weekDays = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];

    const weeklyData = weekDays.map((day, index) => {
      const found = weeklyAnalytics.find(
        (item) => item._id === index + 1
      );

      return {
        day,
        amount: found ? found.amount : 0,
      };
    });

    const totalBudget = budgets.reduce(
      (sum, budget) => sum + budget.limit,
      0
    );

    const totalSavings = savingGoals.reduce(
      (sum, goal) => sum + goal.savedAmount,
      0
    );

  res.status(200).json({
  success: true,
  dashboard: {
    totalIncome: incomeAmount,
    totalSpent: totalSpentResult[0]?.total || 0,
    totalSavings: incomeAmount - (totalSpentResult[0]?.total || 0),
    totalBudget,
    recentExpenses,
    budgets,
    savingGoals,
    weeklyData,
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};