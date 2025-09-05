import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Replace YOUR_MONGO_ATLAS_URL with your actual MongoDB connection string
mongoose
  .connect("YOUR_MONGO_ATLAS_URL", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Define schema
const tyreSchema = new mongoose.Schema({
  brand: String,
  model: String,
  type: String,
  dp: Number,
  mrp: Number,
});

const Tyre = mongoose.model("Tyre", tyreSchema);

// API route to fetch tyres filtered by brand, type, and model search
app.get("/api/tyres", async (req, res) => {
  try {
    const { brand, type, search } = req.query;

    let query = {};

    // Case-insensitive exact match for brand and type via regex
    if (brand) query.brand = { $regex: new RegExp(`^${brand}$`, "i") };
    if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };

    // Partial, case-insensitive match on the model name
    if (search) query.model = { $regex: search, $options: "i" };

    console.log("Backend Query:", query); // Debugging log

    const tyres = await Tyre.find(query);
    res.json(tyres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
