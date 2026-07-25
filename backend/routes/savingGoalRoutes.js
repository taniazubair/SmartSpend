const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createSavingGoal,
  getSavingGoals,
  deleteSavingGoal,
   addSavings,
   updateSavingGoal
} = require("../controllers/savingGoalController");

router.post("/", protect, createSavingGoal);
router.get("/", protect, getSavingGoals);
router.delete("/:id", protect, deleteSavingGoal);
router.put("/:id/add", protect, addSavings);
router.put("/:id", protect, updateSavingGoal);

module.exports = router;