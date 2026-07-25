const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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
        "Education",
        "Other",
      ],
    },

    limit: {
      type: Number,
      required: true,
      min: 0,
    },

    month: {
      type: String,
      required: true,
      // Example: "2026-07"
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Budget", budgetSchema);