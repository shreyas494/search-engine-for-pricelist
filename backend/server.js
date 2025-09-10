// server.js
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// --- For __dirname in ES module ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB connection ---
mongoose.connect(
  "mongodb+srv://Harshal:Harshal123@cluster0.qvgyeqg.mongodb.net/tyreDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// --- Tyre Schema & API Routes ---
const tyreSchema = new mongoose.Schema({
  brand: String,
  model: String,
  dp: Number,
  mrp: Number,
});

const Tyre = mongoose.model("Tyre", tyreSchema);

// Get all tyres
app.get("/api/tyres", async (req, res) => {
  try {
    const tyres = await Tyre.find();
    res.json(tyres);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new tyre
app.post("/api/tyres", async (req, res) => {
  try {
    const newTyre = new Tyre(req.body);
    const savedTyre = await newTyre.save();
    res.json(savedTyre);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- Serve frontend build (Vite + Tailwind) ---
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
