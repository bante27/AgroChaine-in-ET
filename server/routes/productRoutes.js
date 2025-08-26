import express from "express";
import auth from "../middleware/auth.js";
import Product from "../models/Product.js";
import User from "../models/User.js";          // <-- imported User model
import { productImageUpload } from "../middleware/upload.js";

const router = express.Router();

// Utility to generate unique 10-digit productId
const generateProductId = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();

// ---------------- Add a product ----------------
router.post("/", auth, productImageUpload.array("images", 5), async (req, res) => {
  try {
    const { title, price, originAddress, type, quantity, description, comment } = req.body;

    const images = req.files ? req.files.map(f => `/uploads/productImages/${f.filename}`) : [];
    const productId = generateProductId();

    const newProduct = new Product({
      productId,
      title,
      price,
      originAddress,
      type,
      quantity,
      description,
      comment,
      images,
      ownerUserId: req.user.userId,
      ownerName: req.user.fullName,
    });

    await newProduct.save();

    // Add this new product ID to the user's postedProducts array
    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { postedProducts: newProduct._id } }
    );

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error adding product" });
  }
});

// --------------- Get all products ----------------
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", type } = req.query;

    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (type) filter.type = type;

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(filter);

    res.json({
      success: true,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      total: count,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error fetching products" });
  }
});

// --------------- Get single product ----------------
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error fetching product" });
  }
});

// --------------- Add a review to a product ----------------
router.post("/:productId/review", auth, async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ success: false, error: "Review comment is required" });
    }

    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const review = {
      comment,
      userId: req.user.userId,
      userName: req.user.fullName,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.updatedAt = new Date();
    await product.save();

    res.status(201).json({ success: true, message: "Review added", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error adding review" });
  }
});
// --------------- Like a product ----------------
router.post("/:productId/like", auth, async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    product.likesCount += 1;
    product.updatedAt = new Date();
    await product.save();

    // Update user's savedProducts
    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $addToSet: { savedProducts: product._id } }
    );

    res.json({ success: true, message: "Product liked", likesCount: product.likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error liking product" });
  }
});

// --------------- Unlike a product ----------------
router.post("/:productId/unlike", auth, async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    if (product.likesCount > 0) {
      product.likesCount -= 1;
      product.updatedAt = new Date();
      await product.save();
    }

    // Remove from user's savedProducts
    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $pull: { savedProducts: product._id } }
    );

    res.json({ success: true, message: "Product unliked", likesCount: product.likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error unliking product" });
  }
});

export default router;
