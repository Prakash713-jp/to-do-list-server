import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    title: { type: String, required: true },
    action: { type: String, enum: ['COMPLETED', 'DELETED'], required: true },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const History = mongoose.model('History', HistorySchema);
export default History;