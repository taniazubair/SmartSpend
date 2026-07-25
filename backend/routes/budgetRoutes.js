const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

// Create Budget
router.post("/", protect, createBudget);

// Get All Budgets
router.get("/", protect, getBudgets);

// Update Budget
router.put("/:id", protect, updateBudget);

// Delete Budget
router.delete("/:id", protect, deleteBudget);

module.exports = router;