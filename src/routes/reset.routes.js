import express from "express";
import { sendResetLink, resetPassword } from "../controllers/reset.controller.js";

const router = express.Router();
router.post("/request", sendResetLink);
router.post("/reset", resetPassword);

export default router;
