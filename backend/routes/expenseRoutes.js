const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getAnalytics,
    getMonthlySpending
} = require("../controllers/expenseController");
router.post("/", protect, createExpense);

router.get("/", protect, getExpenses);

router.get("/analytics", protect, getAnalytics);

router.get("/monthly", protect, getMonthlySpending);

router.put("/:id", protect, updateExpense);

router.delete("/:id", protect, deleteExpense);

module.exports = router;