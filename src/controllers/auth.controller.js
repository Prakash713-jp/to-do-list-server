// src/controllers/auth.controller.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";


// Helper to generate JWT
const generateToken = (userId) => {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not defined!");
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Register payload:", req.body);

  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email, and password are required" });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = generateToken(user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
  console.error("🔥 Auth Error:", err); // log full error
  res.status(500).json({ message: err.message, stack: err.stack }); // send actual error to frontend
}


};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login payload:", req.body);

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
