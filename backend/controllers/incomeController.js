const Income = require("../models/income");

// Add Income
const addIncome = async (req, res) => {
  try {
    const income = await Income.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Income
const getIncome = async (req, res) => {
  try {
    const income = await Income.find({
      user: req.user.id,
    }).sort({ date: -1 });

    res.json({
      success: true,
      income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addIncome,
  getIncome,
};