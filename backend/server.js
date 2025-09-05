import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (replace YOUR_MONGO_ATLAS_URL with actual URL)
mongoose
  .connect("YOUR_MONGO_ATLAS_URL", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Schema
const tyreSchema = new mongoose.Schema({
  brand: String,
  model: String,
  type: String,
  dp: Number,
  mrp: Number,
});

const Tyre = mongoose.model("Tyre", tyreSchema);

// API to fetch tyres with filters
app.get("/api/tyres", async (req, res) => {
  try {
    const { brand, type, search } = req.query;

    let query = {};

    if (brand) query.brand = { $regex: new RegExp(`^${brand}$`, "i") }; // exact match, case-insensitive
    if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };     // exact match, case-insensitive
    if (search) query.model = { $regex: search, $options: "i" };         // partial match

    console.log("Backend Query:", query); // Debug log

    const tyres = await Tyre.find(query);
    res.json(tyres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
