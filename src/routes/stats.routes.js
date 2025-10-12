import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getSummary } from "../controllers/stats.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/summary", getSummary);

export default router;
