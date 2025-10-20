import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware - IMPORTANT: Order matters!
app.use(cors());
app.use(express.json()); // This must come before routes
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Import Routes
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

// Use Routes
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "Expense Tracker API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users", 
      expenses: "/api/expenses"
    }
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));