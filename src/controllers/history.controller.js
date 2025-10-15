import History from '../models/History.js';

// GET all history records for the authenticated user
export const getHistory = async (req, res) => {
    try {
        const history = await History.find({ user: req.user._id }).sort({ timestamp: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history', error });
    }
};

// POST a new history record (used by the task controller, or directly by recordHistoryAction)
export const createHistoryRecord = async (taskDetails, userId) => {
    try {
        const newRecord = new History({
            ...taskDetails, 
            user: userId 
        });
        await newRecord.save();
        return newRecord;
    } catch (error) {
        console.error("Error creating history record:", error);
        // It's usually fine to let the main request (delete/update) complete, but log the failure
    }
};