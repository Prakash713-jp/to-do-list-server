// 📁 routes/history.routes.js (UPDATED)

import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { 
    getHistory, 
    createHistoryRecord, 
    deleteHistoryRecord 
} from "../controllers/history.controller.js"; 

const router = express.Router();

router.use(authMiddleware); // Protect all history routes

// Route for fetching history (GET /api/history)
router.get("/", getHistory);

// 💥 DELETE ROUTE: DELETE /api/history/:id (Confirmed correct structure for 404 fix)
router.delete('/:id', deleteHistoryRecord); 

// Route for manually creating a history record (POST /api/history)
router.post("/", async (req, res) => {
    try {
        // Assumes req.body contains { action, taskSnapshot: { ... }, completedAt, deletedAt }
        const newRecord = await createHistoryRecord(req.body, req.user._id);
        if (newRecord) {
             res.status(201).json(newRecord);
        } else {
             res.status(500).json({ message: 'Failed to create history record (internal error)' });
        }
    } catch (error) {
        console.error("Error creating history record:", error);
        res.status(500).json({ message: 'Failed to create history record', error: error.message });
    }
});

export default router;