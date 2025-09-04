// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ✅ Tyre Schema
const TyreSchema = new mongoose.Schema(
  {
    brand: String,
    model: String,
    type: String,
    dp: Number,
    mrp: Number,
  },
  { collection: "tyres" }
);

const Tyre = mongoose.model("Tyre", TyreSchema);

// ✅ Get tyres with optional filters
app.get("/api/tyres", async (req, res) => {
  try {
    const { search, brand } = req.query;

    let filter = {};
    if (brand) filter.brand = brand;
    if (search) filter.model = { $regex: search, $options: "i" };

    const tyres = await Tyre.find(filter);
    res.json(tyres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get unique brands
app.get("/api/brands", async (req, res) => {
  try {
    const brands = await Tyre.distinct("brand");
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Serve frontend build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
