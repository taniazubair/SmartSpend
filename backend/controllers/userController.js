const User = require("../models/user");
const bcrypt = require("bcryptjs");


// GET PROFILE
exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    res.json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// UPDATE PROFILE
exports.updateProfile = async (req, res) => {

  try {

    const { name, email } = req.body;


    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email
      },
      {
        new: true
      }
    ).select("-password");


    res.json({
      success:true,
      user
    });


  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};




// CHANGE PASSWORD

exports.changePassword = async(req,res)=>{

  try{

    const {oldPassword,newPassword}=req.body;


    const user = await User.findById(req.user.id);


    const match = await bcrypt.compare(
      oldPassword,
      user.password
    );


    if(!match){
      return res.status(400).json({
        message:"Old password incorrect"
      });
    }


    user.password = await bcrypt.hash(
      newPassword,
      10
    );


    await user.save();


    res.json({
      message:"Password updated successfully"
    });


  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};