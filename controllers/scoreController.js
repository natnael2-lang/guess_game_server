const User = require("../models/user");


exports.getBestScore = async (req, res) => {
  console.log("in get best score")
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("username bestScore");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      username: user.username,
      bestScore: user.bestScore ?? null,
    });
  } catch (err) {
    console.error("Get Best Score Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.postBestScore = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const { bestScore } = req.body;
    console.log("New best score:", bestScore);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { bestScore },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Best score updated successfully!",
      bestScore: user.bestScore,
    });
  } catch (err) {
    console.error("Post Best Score Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({ bestScore: { $ne: null } })
      .sort({ bestScore: 1 }) 
      .limit(10)
      .select("username bestScore");

    res.json(topUsers);
  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
