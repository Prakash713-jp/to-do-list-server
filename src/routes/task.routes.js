import express from "express";
import { authMiddleware } from "../middlewares/auth.js"; // ✅ Add this
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/task.controller.js";

const router = express.Router();
router.use(authMiddleware); // ✅ Protect all task routes

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
