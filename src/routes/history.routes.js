// routes/history.routes.js

import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { getHistory } from "../controllers/history.controller.js"; 
import { createHistoryRecord } from "../controllers/history.controller.js";

const router = express.Router();
router.use(authMiddleware); // Protect all history routes

// Route for fetching history (matches the front-end GET /api/history)
router.get("/", getHistory);

// Route for creating a history record (matches the front-end POST /api/history)
router.post("/", async (req, res) => {
    try {
        // Assuming req.body contains the history record data from AuthContext.js
        const newRecord = await createHistoryRecord(req.body, req.user._id);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create history record', error });
    }
});

export default router;