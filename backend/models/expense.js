const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Shopping",
        "Transport",
        "Bills",
        "Entertainment",
        "Health",
        "Other",
      ],
    },

    date: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
module.exports =
  mongoose.models.Expense ||
  mongoose.model("Expense", expenseSchema)
