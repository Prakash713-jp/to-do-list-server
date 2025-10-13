import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { env } from "./config/env.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();

// ✅ Proper CORS config for GitHub Pages
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://prakash713-jp.github.io/To_Do_List/", // ← replace this
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend running successfully!");
});

// ✅ MongoDB connection
mongoose.connect(env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
});
