
import express from "express";
import auth from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

const SERVICE_FEE_PERCENT = 5; // 5% from buyer and seller

// Middleware to restrict unverified users
const restrictUnverifiedUsers = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
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

// ---------------------------- BUY PRODUCT ----------------------------

router.post("/buy", auth, restrictUnverifiedUsers, async (req, res) => {
  try {
    const buyer = await User.findOne({ userId: req.user.userId });
    if (buyer.isRestricted) {
      return res.status(403).json({ success: false, error: "Restricted users cannot make purchases" });
    }

    const { productId, quantity, deliveryAddress } = req.body;
    const buyerUserId = req.user.userId;

    if (!productId || !quantity || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        error: "Product ID, quantity, and delivery address are required",
      });
    }

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    if (product.ownerUserId.toString() === buyerUserId) {
      return res.status(400).json({ success: false, error: "Cannot buy your own product" });
    }

    if (product.quantityAvailable < quantity) {
      return res.status(400).json({ success: false, error: "Not enough quantity available" });
    }

    const totalPrice = product.price * quantity;
    const buyerFee = (SERVICE_FEE_PERCENT / 100) * totalPrice;
    const sellerFee = (SERVICE_FEE_PERCENT / 100) * totalPrice;
    const totalChargeToBuyer = totalPrice + buyerFee;
    const netAmountToSeller = totalPrice - sellerFee;

    const seller = await User.findOne({ userId: product.ownerUserId });
    if (!seller) return res.status(404).json({ success: false, error: "Seller not found" });

    if (buyer.balance < totalChargeToBuyer) {
      return res.status(400).json({ success: false, error: "Insufficient balance (includes 5% fee)" });
    }

    // Hold buyer funds
    buyer.balance -= totalChargeToBuyer;
    buyer.pendingBalance += totalChargeToBuyer;
    await buyer.save();

    // Update product stock
    product.quantityAvailable -= quantity;
    product.soldQuantity += quantity;
    if (product.quantityAvailable === 0) product.status = "sold out";
    await product.save();

    // Create transaction
    const transaction = new Transaction({
      buyerUserId,
      sellerUserId: product.ownerUserId,
      productId: product._id,
      quantity,
      totalPrice,
      deliveryAddress,
      status: "pending",
      paymentHeld: true,
      platformFeeBuyer: buyerFee,
      platformFeeSeller: sellerFee,
      netSellerAmount: netAmountToSeller,
      serviceFeePercent: SERVICE_FEE_PERCENT,
    });

    await transaction.save();

    // Update buyer & seller relationships
    await User.updateOne(
      { userId: buyerUserId },
      { 
        $addToSet: { 
          boughtProducts: product._id, 
          closeCustomers: seller._id,
          transactionHistory: transaction._id,
        },
        $inc: { rank: 0.5 }
      }
    );

    await User.updateOne(
      { userId: product.ownerUserId },
      { 
        $addToSet: { 
          soldProducts: product._id, 
          closeCustomers: buyer._id,
          transactionHistory: transaction._id,
        },
        $inc: { rank: 0.5 }
      }
    );

    // Notify seller via email
    if (seller?.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
        to: seller.email,
        subject: "New Order Placed!",
        html: `<p>Hi ${seller.fullName || "Seller"},</p>
               <p>You have a new order <strong>${transaction._id}</strong> for <strong>${transaction.quantity} item(s)</strong>.</p>
               <p>Please mark the order as shipped once it is ready.</p>
               <p>Thank you for using Agrochain Ethiopia!</p>`,
      });
    }

    res.json({
      success: true,
      message: "Purchase successful. Seller has been notified. Awaiting delivery confirmation.",
      transaction,
    });

  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ success: false, error: "Server error during transaction" });
  }
});

// ---------------------------- MARK SHIPPED ----------------------------

router.post("/mark-shipped/:transactionId", auth, restrictUnverifiedUsers, async (req, res) => {
  try {
    const seller = await User.findOne({ userId: req.user.userId });
    if (seller.isRestricted) return res.status(403).json({ success: false, error: "Restricted users cannot mark transactions as shipped" });

    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ success: false, error: "Transaction not found" });
    if (transaction.sellerUserId !== seller.userId) return res.status(403).json({ success: false, error: "Only the seller can mark as shipped" });
    if (transaction.status !== "pending") return res.status(400).json({ success: false, error: "Transaction cannot be marked as shipped in current status" });

    transaction.status = "shipped";
    await transaction.save();

    // Notify buyer
    const buyer = await User.findOne({ userId: transaction.buyerUserId });
    if (buyer?.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
        to: buyer.email,
        subject: "Your order has been shipped!",
        html: `<p>Hi ${buyer.fullName || "Customer"},</p>
               <p>Your order <strong>${transaction._id}</strong> for <strong>${transaction.quantity} item(s)</strong> has been shipped.</p>
               <p>Estimated delivery: 2-3 business weeks.</p>
               <p>Thank you for using Agrochain Ethiopia!</p>`,
      });
    }

    res.json({ success: true, message: "Transaction marked as shipped. Buyer notified via email.", transaction });

  } catch (error) {
    console.error("Mark shipped error:", error);
    res.status(500).json({ success: false, error: "Server error during status update" });
  }
});

// ---------------------------- CONFIRM DELIVERY ----------------------------

router.post("/confirm-delivery/:transactionId", auth, restrictUnverifiedUsers, async (req, res) => {
  try {
    const buyer = await User.findOne({ userId: req.user.userId });
    if (buyer.isRestricted) return res.status(403).json({ success: false, error: "Restricted users cannot confirm delivery" });

    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ success: false, error: "Transaction not found" });
    if (transaction.buyerUserId !== buyer.userId) return res.status(403).json({ success: false, error: "Only the buyer can confirm delivery" });
    if (!["pending", "shipped"].includes(transaction.status)) return res.status(400).json({ success: false, error: "Transaction cannot be confirmed in current status" });

    const seller = await User.findOne({ userId: transaction.sellerUserId });
    if (!seller) return res.status(404).json({ success: false, error: "Seller not found" });

    // Complete transaction
    transaction.status = "completed";
    transaction.buyerConfirmed = true;
    transaction.paymentHeld = false;
    transaction.releaseDate = new Date();

    buyer.pendingBalance -= (transaction.totalPrice + transaction.platformFeeBuyer);
    seller.balance += transaction.netSellerAmount;

    await transaction.save();
    await buyer.save();
    await seller.save();

    // Notify seller
    if (seller?.email && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
        to: seller.email,
        subject: "Your product has been delivered!",
        html: `<p>Hi ${seller.fullName || "Seller"},</p>
               <p>Your product <strong>${transaction._id}</strong> sold to <strong>${buyer.fullName || "Buyer"}</strong> has been confirmed delivered.</p>
               <p>Funds have been released to your balance: ${transaction.netSellerAmount}.</p>
               <p>Thank you for using Agrochain Ethiopia!</p>`,
      });
    }

    res.json({ success: true, message: "Delivery confirmed. Seller notified via email.", transaction });

  } catch (error) {
    console.error("Confirm delivery error:", error);
    res.status(500).json({ success: false, error: "Server error during delivery confirmation" });
  }
});

// ---------------------------- GET USER TRANSACTIONS ----------------------------

router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactions = await Transaction.find({
      $or: [{ buyerUserId: userId }, { sellerUserId: userId }],
    }).sort({ createdAt: -1 });

    res.json({ success: true, transactions });

  } catch (error) {
    console.error("Get user transactions error:", error);
    res.status(500).json({ success: false, error: "Server error fetching transactions" });
  }
});

// ---------------------------- GET TRANSACTION DETAIL ----------------------------

router.get("/:transactionId", auth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.userId;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ success: false, error: "Transaction not found" });

    if (transaction.buyerUserId !== userId && transaction.sellerUserId !== userId) {
      return res.status(403).json({ success: false, error: "Access denied to this transaction" });
    }

    res.json({ success: true, transaction });

  } catch (error) {
    console.error("Get transaction detail error:", error);
    res.status(500).json({ success: false, error: "Server error fetching transaction details" });
  }
});

export default router;
