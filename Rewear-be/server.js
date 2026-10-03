import express from "express";
import { ENV_VARS } from "./config/envVars.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./route/auth.route.js";
import { connectDB } from "./config/db.js";
import searchRoutes from "./route/search.route.js";
import adminRoutes from "./route/admin.route.js";
import transactionRoutes from "./route/transaction.route.js";

const app = express();
const PORT = ENV_VARS.PORT;

// import { protectRoute } from "./middleware/protectRoute.js";


const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow dev origins gracefully
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/transaction", transactionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global API Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, async () => {
  console.log(`Server started at http://localhost:${PORT}`);
  await connectDB();
});