const SavingGoal = require("../models/SavingGoal");

// Create Saving Goal
const createSavingGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    const goal = await SavingGoal.create({
      user: req.user.id,
      title,
      targetAmount,
      savedAmount: 0,
      deadline,
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error(error);

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
const deleteSavingGoal = async (req, res) => {
  try {
    const goal = await SavingGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const addSavings = async (req, res) => {
  try {
    const { amount } = req.body;

    const goal = await SavingGoal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    goal.savedAmount += Number(amount);

    if (goal.savedAmount > goal.targetAmount) {
      goal.savedAmount = goal.targetAmount;
    }

    await goal.save();

    res.status(200).json({
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
const updateSavingGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline } = req.body;

    const goal = await SavingGoal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    goal.title = title;
    goal.targetAmount = targetAmount;
    goal.deadline = deadline;

    await goal.save();

    res.status(200).json({
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
module.exports = {
  createSavingGoal,
  getSavingGoals,
  deleteSavingGoal,
  addSavings,
   updateSavingGoal,
};