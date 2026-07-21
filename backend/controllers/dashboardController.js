const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const SavingGoal = require("../models/SavingGoal");

const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const expenses = await Expense.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const budgets = await Budget.find({
      user: userId,
    });

    const savingGoals = await SavingGoal.find({
      user: userId,
    });

    const totalSpent = await Expense.aggregate([
      {
        $match: {
          user: userId,
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

    res.status(200).json({
      success: true,
      dashboard: {
        totalSpent: totalSpent[0]?.total || 0,
        recentExpenses: expenses,
        budgets,
        savingGoals,
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