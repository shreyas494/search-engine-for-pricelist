// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000; // ✅ use Render/hosting PORT

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tyreDB"; // ✅ use cloud/local

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const tyreSchema = new mongoose.Schema({
  brand: String,
  category: String,
  price: Number,
});

const Tyre = mongoose.model("Tyre", tyreSchema);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Backend is running...");
});

app.get("/search", async (req, res) => {
  try {
    const { brand } = req.query;
    if (!brand) {
      return res.status(400).json({ error: "Brand is required" });
    }

    const tyres = await Tyre.find({ brand: { $regex: brand, $options: "i" } });
    res.json(tyres);
  } catch (err) {
    console.error("❌ Error searching tyres:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
