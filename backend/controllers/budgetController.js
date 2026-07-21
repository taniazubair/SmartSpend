const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// Create Budget
const createBudget = async (req, res) => {
    try {

        const { category, limit, month, year } = req.body;

        const budget = await Budget.create({
            category,
            limit,
            month,
            year,
            user: req.user.id,
        });


        res.status(201).json({
            success: true,
            data: budget,
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


// Get User Budgets
const getBudgets = async (req, res) => {
    try {

        const budgets = await Budget.find({
            user: req.user.id,
        });


        res.status(200).json({
            success: true,
            count: budgets.length,
            data: budgets,
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
// Budget Progress
const getBudgetProgress = async (req, res) => {
    try {

        const budgets = await Budget.find({
            user: req.user.id,
        });


        const progress = await Promise.all(
            budgets.map(async (budget) => {

                const expense = await Expense.aggregate([
                    {
                        $match: {
                            user: new mongoose.Types.ObjectId(req.user.id),
                            category: budget.category,
                            date: {
                                $gte: new Date(budget.year, budget.month - 1, 1),
                                $lt: new Date(budget.year, budget.month, 1),
                            },
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


                const spent = expense[0]?.total || 0;


                return {
                    category: budget.category,
                    limit: budget.limit,
                    spent,
                    remaining: budget.limit - spent,
                    usedPercentage: ((spent / budget.limit) * 100).toFixed(2),
                };

            })
        );


        res.status(200).json({
            success: true,
            budgetProgress: progress,
        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudgetProgress,
};