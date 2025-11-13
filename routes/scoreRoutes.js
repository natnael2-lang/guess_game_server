const express = require("express");
const { getBestScore, getLeaderboard,postBestScore } = require("../controllers/scoreController");
const { authenticate } = require("../controllers/authController");

const router = express.Router();


router.get("/bestScore", authenticate, getBestScore);
router.post("/bestScore", authenticate, postBestScore);

router.get("/leaderboard", getLeaderboard);

module.exports = router;