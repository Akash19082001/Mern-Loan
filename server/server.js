// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Using the MONGO_URI from the .env file or fallback to a default
const mongoUri = process.env.MONGO_UR



app.use("/api", authRoutes);

app.get("/login", (req, res) => {
  res.send("Hello, this is the backend");
});

// Use customer routes
app.use("/api/customers", customerRoutes);

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
