// 📁 models/History.js (UPDATED)

import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    action: { 
        type: String, 
        enum: ['CREATED', 'COMPLETED', 'DELETED', 'UPDATED', 'PENDING'], // Added more actions for better history
        required: true 
    },
    // The new field to store all dynamic details (priority, category, description)
    taskSnapshot: {
        title: { type: String, required: true },
        description: { type: String, default: 'No description provided.' },
        category: { type: String, default: 'N/A' },
        priority: { type: String, default: 'N/A' },
        originalCreatedAt: { type: Date }, // The original creation date of the task
    },
    
    // Timestamps for the history action itself
    completedAt: { type: Date },
    deletedAt: { type: Date },
    // Using default Mongoose timestamps for history creation/update is generally sufficient
}, { timestamps: true }); 

const History = mongoose.model('History', HistorySchema);
export default History;