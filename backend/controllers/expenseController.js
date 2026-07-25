const Expense = require("../models/expense");
const mongoose = require("mongoose");

// Create Expense
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Expenses (Only logged-in user's expenses)
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Expense
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
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

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Expense Analytics
const getAnalytics = async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.user.id);


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


    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: "$category",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);


    const highestExpense = await Expense.findOne({
      user: req.user.id,
    }).sort({
      amount: -1,
    });


    const count = await Expense.countDocuments({
      user: req.user.id,
    });


    const total = totalSpent[0]?.total || 0;


    res.status(200).json({
      success: true,
      analytics: {
        totalSpent: total,
        highestExpense: highestExpense || null,
        averageExpense: count > 0 ? total / count : 0,
        categoryBreakdown,
      },
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Monthly Spending Trends
const getMonthlySpending = async (req, res) => {
  try {

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const monthlySpending = await Expense.aggregate([
      {
        $match: {
          user: userId
        }
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$date"
            },
            year: {
              $year: "$date"
            }
          },
          total: {
            $sum: "$amount"
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);


    res.status(200).json({
      success: true,
      monthlySpending
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getAnalytics,
  getMonthlySpending,
};