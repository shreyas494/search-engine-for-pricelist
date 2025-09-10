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

// ✅ Flexible schema (no strict enforced fields)
const productSchema = new mongoose.Schema({}, { strict: false });

// ✅ Force model to use "tyres" collection
const Product = mongoose.model("Product", productSchema, "tyres");

// ✅ API Endpoint
app.get("/api/tyres", async (req, res) => {
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
