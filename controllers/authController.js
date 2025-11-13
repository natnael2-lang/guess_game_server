const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

// 🔑 Generate Access & Refresh Tokens
const generateAccessToken = (user) =>
  jwt.sign({ id: user._id }, "nati", { expiresIn: "3m" });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id },"nati", { expiresIn: "7d" });

// 📝 Sign Up
exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ id: user._id, username, email });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    console.log("access token ",accessToken)
    console.log("refrash  token ",refreshToken)

    // Send refresh token as cookie, access token in header
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .header("Authorization", `Bearer ${accessToken}`)
      .json({
        message: "Login successful",
        user: { id: user._id, username: user.username, email: user.email },
      });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔄 Refresh Token (no DB storage)
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken,"nati", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired refresh token" });

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      "nati",
      { expiresIn: "3m" }
    );

    res.header("Authorization", `Bearer ${newAccessToken}`).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  });
};

// 🚪 Logout
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.json({ message: "Logged out successfully" });
};

// 🧭 Authenticate Middleware
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token,"nati", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
};
