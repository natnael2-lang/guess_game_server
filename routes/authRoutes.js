const express = require("express");
const { signUp,login,logout,refreshToken ,verifyEmail} = require("../controllers/authController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();


router.post("/signUp",signUp);

router.post("/login", login);
router.get("/logout", logout);
router.post("/auth/refresh", refreshToken);
router.get("/auth/check", authenticate, (req, res) => {
    console.log("in auth chek")
  res.status(200).json({ authenticated: true });
});
router.get("/verify/:token", verifyEmail);

module.exports = router;