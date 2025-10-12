import Task, { categories, priorities } from "../models/Task.js";

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
    if (completed !== undefined) task.completed = Boolean(completed);

    const updatedTask = await task.save();
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

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
