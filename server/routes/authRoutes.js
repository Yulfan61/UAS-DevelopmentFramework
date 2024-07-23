// authRoutes.js
import express from "express";
import { getDb } from "../db/connection.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = getDb();
    const collection = db.collection("users");

    // Check if username already exists
    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user document
    const newUser = {
      username,
      password: hashedPassword,
    };

    // Insert new user into database
    const result = await collection.insertOne(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = getDb();
    const collection = db.collection("users");

    // Find user by username
    const user = await collection.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Passwords match, user authenticated
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
