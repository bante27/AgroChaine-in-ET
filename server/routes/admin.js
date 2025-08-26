// routes/adminRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// 🧑‍💼 Get all users
router.get("/users", auth, admin, async (req, res) => {
  const users = await User.find({}, "-password -otp");
  res.json({ success: true, users });
});

// 👤 Get a single user profile
router.get("/users/:userId", auth, admin, async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId }).populate([
    "boughtProducts",
    "soldProducts",
    "postedProducts",
    "transactionHistory",
    "closeCustomers",
  ]);

  if (!user) return res.status(404).json({ success: false, error: "User not found" });
  res.json({ success: true, user });
});

// 🔒 Restrict or unrestrict a user
router.post("/users/:userId/restrict", auth, admin, async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId });
  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  user.isRestricted = !user.isRestricted;
  await user.save();

  res.json({
    success: true,
    message: `User has been ${user.isRestricted ? "restricted" : "unrestricted"}`,
    user,
  });
});

// 📦 Get all products
router.get("/products", auth, admin, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, products });
});

// 💰 Get all transactions
router.get("/transactions", auth, admin, async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json({ success: true, transactions });
});

// 🚨 Suspicious users (basic filter example)
router.get("/users/suspicious", auth, admin, async (req, res) => {
  const suspiciousUsers = await User.find({
    $or: [
      { balance: { $gt: 100000 } },
      { rank: { $lt: -1 } },
    ],
  });

  res.json({ success: true, suspiciousUsers });
});

// 📝 GET pending government ID verifications
router.get("/verifications/pending", auth, admin, async (req, res) => {
  const pending = await User.find({ "governmentId.status": "pending" })
    .select("userId fullName email governmentId");
  res.json({ success: true, pending });
});

// ✅ Approve or ❌ Reject verification
router.patch("/verify/:userId", auth, admin, async (req, res) => {
  const { action } = req.body; // 'approve' or 'reject'
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, error: 'Action must be approve or reject' });
  }

  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  if (action === 'approve') {
    user.governmentId.status = 'verified';
    user.governmentId.verifiedAt = new Date();
    user.verified = true;
  } else {
    user.governmentId.status = 'rejected';
    user.governmentId.verifiedAt = null;
    user.verified = false;
  }

  await user.save();
  res.json({ success: true, user });
});

export default router;
