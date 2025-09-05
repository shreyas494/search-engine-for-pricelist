import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("YOUR_MONGO_ATLAS_URL", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Schema
const itemSchema = new mongoose.Schema({
  brand: String,
  model: String,
  type: String,
  dp: Number,
  mrp: Number,
});

const Item = mongoose.model("Item", itemSchema);

// API to fetch items with optional filters
app.get("/api/items", async (req, res) => {
  try {
    const { brand, type, search } = req.query;
    const query = {};

    // Case-insensitive regex for brand/type/model
    if (brand) query.brand = { $regex: new RegExp(brand, "i") };
    if (type) query.type = { $regex: new RegExp(type, "i") };
    if (search) query.model = { $regex: new RegExp(search, "i") };

    const items = await Item.find(query); // no limit
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
