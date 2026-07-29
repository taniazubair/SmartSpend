const Income = require("../models/income");


// Add Income
const addIncome = async (req, res) => {
  try {
    const income = await Income.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      income,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Get Income
const getIncome = async (req, res) => {
  try {
    const income = await Income.find({
      user: req.user.id,
    }).sort({ date: -1 });

    res.json({
      success: true,
      income,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// Update Income
const updateIncome = async (req, res) => {
  try {

    const income = await Income.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );


    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }


    res.json({
      success: true,
      income,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// Delete Income
const deleteIncome = async (req, res) => {
  try {

    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });


    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }


    res.json({
      success: true,
      message: "Income deleted",
    });


  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }
};



module.exports = {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};