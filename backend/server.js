import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect("YOUR_MONGO_ATLAS_URL", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ General Product Schema
const productSchema = new mongoose.Schema({
  brand: String,
  model: String,
  type: String,
  dp: Number,
  rp: Number,
  rp1: Number,
  mrp: Number,
  warranty: String,
});

// ✅ Product Model
const Product = mongoose.model("Product", productSchema);

// ✅ API Endpoint
app.get("/api/products", async (req, res) => {
  try {
    const { brand, type, search } = req.query;
    let query = {};

    if (brand) query.brand = { $regex: new RegExp(`^${brand}$`, "i") };
    if (type) query.type = { $regex: new RegExp(`^${type}$`, "i") };
    if (search) query.model = { $regex: search, $options: "i" };

    console.log("Backend Query:", query);

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
