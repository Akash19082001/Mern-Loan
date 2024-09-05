const express = require("express");
const cors = require("cors");
const User = require("./models/register");
const connectDB = require("./db/connection");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get All Users Route
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, 'name email role'); // Only return necessary fields
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Default Route
app.get("/login", (req, res) => {
  res.send("Hello, this is the backend");
});

// Start Server
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(5000, () => {
      console.log("Server is listening on port 5000");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
