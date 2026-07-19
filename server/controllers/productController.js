import Product from "../models/Product.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js"; // 🌟 Injected your transaction schema

import mongoose from "mongoose";

const generateProductId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

// Helper to find product by MongoDB _id or custom productId
const findProductByIdOrCode = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const product = await Product.findById(id);
    if (product) return product;
  }
  return await Product.findOne({ productId: id });
};


export const getAllProducts = async (req, res) => {
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
    res.json({ success: true, page: parseInt(page), pages: Math.ceil(count / limit), total: count, products });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching products" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).populate('postedProducts');
    res.json({ success: true, products: user?.postedProducts || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching your products" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await findProductByIdOrCode(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching product" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ success: false, error: "Comment required" });

    const product = await findProductByIdOrCode(req.params.productId);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    product.reviews.push({ comment, userId: req.user.userId, userName: req.user.fullName, createdAt: new Date() });
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error adding review" });
  }
};

export const likeProduct = async (req, res) => {
  try {
    const product = await findProductByIdOrCode(req.params.productId);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    product.likesCount += 1;
    await product.save();
    await User.findOneAndUpdate({ userId: req.user.userId }, { $addToSet: { savedProducts: product._id } });
    res.json({ success: true, likesCount: product.likesCount });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error liking product" });
  }
};

export const unlikeProduct = async (req, res) => {
  try {
    const product = await findProductByIdOrCode(req.params.productId);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    if (product.likesCount > 0) product.likesCount -= 1;
    await product.save();
    await User.findOneAndUpdate({ userId: req.user.userId }, { $pull: { savedProducts: product._id } });
    res.json({ success: true, likesCount: product.likesCount });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error unliking product" });
  }
};

// ... existing imports ...

export const addProduct = async (req, res) => {
    try {
        const { title, price, originAddress, type, quantity, description, comment } = req.body;
        
        if (!title || !price || !originAddress || !type || !quantity) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const images = req.files ? req.files.map(f => f.path) : [];
        
        const newProduct = new Product({
            productId: generateProductId(), // Your 10-digit code
            title, 
            price: Number(price), 
            originAddress, 
            type,
            initialQuantity: Number(quantity),
            quantityAvailable: Number(quantity),
            description, 
            comment, 
            images,
            ownerUserId: req.user.userId, // Stored as string to match your Auth
            ownerName: req.user.fullName,
        });

        await newProduct.save();

        // Update user profile
        await User.findOneAndUpdate(
            { userId: req.user.userId }, 
            { $push: { postedProducts: newProduct._id } }
        );

        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(500).json({ success: false, error: "Failed to create product" });
    }
};

// Use this for single-click purchases if not using the cart
export const purchaseProduct = async (req, res) => {
    try {
        const quantity = parseInt(req.body.quantity || 1);
        const product = await findProductByIdOrCode(req.params.productId);

        if (!product) return res.status(404).json({ success: false, error: "Product not found" });
        if (product.quantityAvailable < quantity) return res.status(400).json({ success: false, error: "Out of stock" });

        // Note: For a real payment, redirect to the buyProduct controller above.
        // This is just a simple stock deduction helper.
        product.quantityAvailable -= quantity;
        await product.save();

        res.json({ success: true, newQuantity: product.quantityAvailable });
    } catch (error) {
        res.status(500).json({ success: false, error: "Purchase failed" });
    }
};

export const getMySoldProducts = async (req, res) => {
  try {
    // 1. Get the logged-in user's custom ID string (e.g., matching sellerUserId)
    // Depending on your auth middleware setup, use req.user.id or req.user.userId
    const sellerId = req.user.userId || req.user.id; 

    // 2. Query the transactions collection
    const salesHistory = await Transaction.find({
      sellerUserId: sellerId,
      status: { $in: ['delivered', 'completed'] } // 🔥 Filters down ONLY to delivered or finalized sales
    })
    .populate("productId") // Joins the product information (title, images, price)
    .sort({ date: -1 });   // Newest sales first

    // 3. Clean up the response payload for your frontend
    // Filters out records if the linked product was deleted from the system entirely
    const soldProducts = salesHistory
      .filter(item => item.productId !== null)
      .map(item => ({
        transactionId: item._id,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        status: item.status,
        date: item.date,
        deliveryAddress: item.deliveryAddress,
        netSellerAmount: item.netSellerAmount,
        // Spreads out the underlying product info (title, images, etc)
        productDetails: item.productId 
      }));

    return res.status(200).json({
      success: true,
      count: soldProducts.length,
      data: soldProducts
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load sold transaction history.",
      error: error.message
    });
  }
};