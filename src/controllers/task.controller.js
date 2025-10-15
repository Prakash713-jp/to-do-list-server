// 📁 controllers/task.controller.js (UPDATED with History Logging)

import Task, { categories, priorities } from "../models/Task.js";
// 🚨 CRITICAL: Import the history utility function
import { recordHistoryAction } from "./history.controller.js";

// GET all tasks (for logged-in user only)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single task (only if it belongs to the logged-in user)
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new task (assigned to logged-in user)
export const createTask = async (req, res) => {
  const { title, description = "", category, priority, deadline } = req.body;

  if (!title || !category || !priority || !deadline) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  if (!priorities.includes(priority)) {
    return res.status(400).json({ message: "Invalid priority" });
  }

  try {
    const task = new Task({
      title,
      description,
      category,
      priority,
      deadline: new Date(deadline),
      user: req.user._id, // ✅ Associate task with user
    });

    const savedTask = await task.save();
    
    // 🚀 HISTORY INTEGRATION: Record task creation
    // The task document is passed, and the action type is 'CREATED'
    await recordHistoryAction(savedTask, 'CREATED');

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE task (only if it belongs to the user)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, description, category, priority, deadline, completed } = req.body;
    
    // Determine the history action type *before* updating
    let actionType = 'UPDATED';

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) {
      if (!categories.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      task.category = category;
    }
    if (priority !== undefined) {
      if (!priorities.includes(priority)) {
        return res.status(400).json({ message: "Invalid priority" });
      }
      task.priority = priority;
    }
    if (deadline !== undefined) task.deadline = new Date(deadline);
    
    if (completed !== undefined) {
        // If the 'completed' status is the only thing changing, prioritize that action
        if (completed === true) {
            actionType = 'COMPLETED';
        } else if (completed === false && task.completed === true) {
            // Only log PENDING if it was previously completed
            actionType = 'PENDING'; 
        }
        task.completed = Boolean(completed);
    }
    
    const updatedTask = await task.save();
    
    // 🚀 HISTORY INTEGRATION: Record task update, completion, or pending status
    await recordHistoryAction(updatedTask, actionType);

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE task (only if it belongs to the user)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    // 💡 IMPORTANT: Capture the task snapshot *before* deletion for history
    const taskSnapshot = task.toObject(); 

    await task.deleteOne();
    
    // 🚀 HISTORY INTEGRATION: Record task deletion using the snapshot
    await recordHistoryAction(taskSnapshot, 'DELETED');

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};