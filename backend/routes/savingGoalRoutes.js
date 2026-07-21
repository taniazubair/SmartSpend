const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createSavingGoal,
  getSavingGoals,
} = require("../controllers/savingGoalController");

router.post("/", protect, createSavingGoal);

router.get("/", protect, getSavingGoals);

module.exports = router;