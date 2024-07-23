import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import records from "./routes/record.js";
import db from "./db/connection.js";

const PORT = process.env.PORT || 5050;
const app = express();


app.use(cors());
app.use(express.json());
app.use("/record", records);

// Register route
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };

    let collection = await db.collection("users");
    await collection.insertOne(user);

    res.status(201).send("User registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user");
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let collection = await db.collection("users");
    const user = await collection.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in user");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
