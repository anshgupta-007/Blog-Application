const express = require("express");
const router = express.Router();

const {signUp,login,logout,sendOtp} = require("../controllers/auth.js");

router.post("/send-otp", sendOtp);
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router