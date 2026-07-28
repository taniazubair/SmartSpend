const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const requestEmailChange = async(req,res)=>{

try{

const {newEmail}=req.body;

const user = await User.findById(req.user.id);


const token = crypto.randomBytes(32).toString("hex");


user.pendingEmail = newEmail;
user.emailChangeToken = token;
user.emailChangeExpires = Date.now()+15*60*1000;


await user.save();


res.json({
message:"Confirmation email sent"
});


}
catch(error){
res.status(500).json({
message:error.message
});
}

}
const confirmEmailChange = async(req,res)=>{

try{

const user = await User.findOne({
emailChangeToken:req.params.token
});


if(!user){
return res.status(400).json({
message:"Invalid token"
});
}


if(user.emailChangeExpires < Date.now()){
return res.status(400).json({
message:"Token expired"
});
}


user.email = user.pendingEmail;

user.pendingEmail=null;
user.emailChangeToken=null;
user.emailChangeExpires=null;


await user.save();


res.json({
message:"Email updated successfully"
});


}
catch(error){

res.status(500).json({
message:error.message
});

}

}


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
  module.exports={
requestEmailChange,
confirmEmailChange
}

};