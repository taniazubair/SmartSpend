const SavingGoal = require("../models/SavingGoal");

// Create Saving Goal
const createSavingGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    const goal = await SavingGoal.create({
      user: req.user.id,
      title,
      targetAmount,
      deadline,
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Saving Goals
const getSavingGoals = async (req, res) => {
  try {
    const goals = await SavingGoal.find({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSavingGoal,
  getSavingGoals,
};