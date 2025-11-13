const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRouter = require("./routes/authRoutes");
const scoreRouter = require("./routes/scoreRoutes");

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
    exposedHeaders: ["Authorization"] 
  })
);


app.use("/", authRouter);
app.use("/user", scoreRouter);


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ DB connected successfully!"))
  .catch((err) => console.error("❌ DB failed to connect:", err.message));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
