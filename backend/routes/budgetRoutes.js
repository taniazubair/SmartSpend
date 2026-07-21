const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createBudget,
    getBudgets,
    getBudgetProgress,
} = require("../controllers/budgetController");

router.post("/", protect, createBudget);

router.get("/", protect, getBudgets);

router.get("/progress", protect, getBudgetProgress);


module.exports = router;