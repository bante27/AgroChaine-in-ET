import express from "express";
import auth from "../middleware/auth.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { productImageUpload } from "../middleware/cloudinaryUpload.js";
import mongoose from "mongoose";
import isNotRestricted from "../middleware/isNotRestricted.js";

const router = express.Router();

// Utility to generate unique 10-digit productId
const generateProductId = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();

// Middleware to restrict unverified users
const restrictUnverifiedUsers = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.govIdStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        error: 'Action restricted: Government ID verification pending or not completed',
      });
    }
    next();
  } catch (err) {
    console.error('Error checking verification status:', err);
    res.status(500).json({ success: false, error: 'Server error checking verification status' });
  }
};

// ---------------- Add a product ----------------
router.post("/", auth, restrictUnverifiedUsers, isNotRestricted, productImageUpload.array("images", 5), async (req, res) => {
  try {

    const { title, price, originAddress, type, quantity, description, comment } = req.body;
    if (!title || !price || !originAddress || !type || !quantity) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const images = req.files ? req.files.map(f => f.path) : [];
    const productId = generateProductId();

    const newProduct = new Product({
      productId,
      title,
      price,
      originAddress,
      type,
      initialQuantity: quantity,
      quantityAvailable: quantity,
      description,
      comment,
      images,
      ownerUserId: req.user.userId,
      ownerName: req.user.fullName,
    });

    await newProduct.save();
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
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ productId: id });
    }
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, error: "Server error fetching product" });
  }
});

// --------------- Get user's products ----------------
router.get("/my-products", auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).populate('postedProducts');
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, products: user.postedProducts || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error fetching user products" });
  }
});

// --------------- Add a review to a product ----------------
router.post("/:productId/review", auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (user.isRestricted) return res.status(403).json({ success: false, error: "Restricted users cannot add reviews" });

    const { comment } = req.body;
    if (!comment) return res.status(400).json({ success: false, error: "Review comment is required" });

    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

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
    const user = await User.findOne({ userId: req.user.userId });
    if (user.isRestricted) return res.status(403).json({ success: false, error: "Restricted users cannot like products" });

    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    product.likesCount += 1;
    product.updatedAt = new Date();
    await product.save();

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
    const user = await User.findOne({ userId: req.user.userId });
    if (user.isRestricted) return res.status(403).json({ success: false, error: "Restricted users cannot unlike products" });

    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    if (product.likesCount > 0) {
      product.likesCount -= 1;
      product.updatedAt = new Date();
      await product.save();
    }

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

// --------------- Purchase (reduce quantity) ----------------
router.post("/:productId/purchase", auth, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const { productId } = req.params;

    const product = await Product.findOne({ productId });
    if (!product)
      return res.status(404).json({ success: false, error: "Product not found" });

    if (product.quantityAvailable < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${product.quantityAvailable} item(s) left in stock`,
      });
    }

    // Decrease available quantity
    product.quantityAvailable -= quantity;
    if (product.quantityAvailable <= 0) product.quantityAvailable = 0;

    // Update sold quantity
    const soldQuantity = product.initialQuantity - product.quantityAvailable;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Purchase successful",
      updatedProduct: {
        ...product.toObject(),
        soldQuantity, // Include sold quantity
      },
    });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ success: false, error: "Server error processing purchase" });
  }
});



export default router;
