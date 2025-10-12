import mongoose from "mongoose";

const categories = [
  "Work", "Personal", "Study", "Shopping", "Health",
  "Finance", "Travel", "Home", "Projects", "Events"
];

const priorities = ["Low", "Medium", "High", "Urgent"];

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, required: true, enum: categories },
  priority: { type: String, required: true, enum: priorities },
  deadline: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // 👈 Add this
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
export { categories, priorities };
