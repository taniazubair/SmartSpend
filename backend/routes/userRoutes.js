const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  requestEmailChange,
  confirmEmailChange,
} = require("../controllers/userController");


const protect = require("../middleware/authMiddleware");


router.get(
 "/profile",
 protect,
 getProfile
);


router.put(
 "/profile",
 protect,
 updateProfile
);


router.put(
 "/change-password",
 protect,
 changePassword
);
router.put("/request-email-change", protect, requestEmailChange);

router.get("/confirm-email-change/:token", confirmEmailChange);

module.exports = router;