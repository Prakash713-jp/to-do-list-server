// 📁 controllers/history.controller.js (UPDATED)

import History from '../models/History.js';

// Internal function to create and save a new history record
export const createHistoryRecord = async (data, userId) => {
    try {
        const newRecord = new History({
            user: userId,
            action: data.action,
            taskSnapshot: data.taskSnapshot,
            completedAt: data.completedAt,
            deletedAt: data.deletedAt,
            // Mongoose `timestamps: true` handles the history record's createdAt/updatedAt
        });
        await newRecord.save();
        return newRecord;
    } catch (error) {
        // Log the error but don't fail the main request (like task update/delete)
        console.error("Error creating history record:", error);
    }
};


// UTILITY FUNCTION: Called from task.controller.js to log any task change
export const recordHistoryAction = async (task, actionType) => {
    // Check if the task object has required fields (assuming it's a Mongoose document or plain object)
    if (!task || !task._id || !task.user) {
        console.error("Cannot record history: Invalid task object.");
        return;
    }

    const historyData = {
        action: actionType,
        // 💥 Save the full task details in the snapshot for the frontend
        taskSnapshot: {
            title: task.title,
            description: task.description || 'No description provided.',
            category: task.category || 'N/A',
            priority: task.priority || 'N/A',
            originalCreatedAt: task.createdAt,
        },
        completedAt: actionType === 'COMPLETED' ? new Date() : undefined,
        deletedAt: actionType === 'DELETED' ? new Date() : undefined,
    };
    
    return createHistoryRecord(historyData, task.user);
};


// GET all history records for the authenticated user (API endpoint)
export const getHistory = async (req, res) => {
    try {
        // Fetch history records only for the authenticated user, sort by history creation date (newest first)
        const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: 'Failed to fetch history', error: error.message });
    }
};


// DELETE a history record by ID (API endpoint)
export const deleteHistoryRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Find and delete the history record by its ID AND the user ID
        const result = await History.findOneAndDelete({ 
            _id: id, 
            user: userId 
        });

        if (!result) {
            // This case handles the 404 error correctly when the record doesn't exist or doesn't belong to the user
            return res.status(404).json({ message: "History record not found or access denied." });
        }

        res.status(200).json({ 
            message: "History record deleted successfully.", 
            deletedRecordId: id 
        });

    } catch (error) {
        console.error("Error deleting history record:", error);
        res.status(500).json({ 
            message: "Server error during deletion.", 
            error: error.message 
        });
    }
};