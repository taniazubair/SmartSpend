const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const savingGoalRoutes = require("./routes/savingGoalRoutes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saving-goals", savingGoalRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("Smart Spend API Running");
   
});

// Server
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Connected");
// TEMP TEST ROUTE — no auth required
app.get("/api/test", (req, res) => {
    res.json({ message: "Server is responding fine" });
});
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error) => {
    console.log("MongoDB Connection Error:", error);
});
