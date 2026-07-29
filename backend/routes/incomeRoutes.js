const express = require("express");
const router = express.Router();

const {
  addIncome,
  getIncome,
} = require("../controllers/incomeController");

const protect = require("../middleware/authMiddleware");


router.post("/", protect, addIncome);

router.get("/", protect, getIncome);


module.exports = router;