import express from "express";
import auth from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

const SERVICE_FEE_PERCENT = 5; // 5% from buyer and seller

// ✅ Reusable email sender function
const sendNotificationEmail = async (to, subject, html) => {
  if (!to || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #22a45d; padding-bottom: 15px;">
              <h2 style="color: #22a45d; margin: 0;">🌿 Agrochain Ethiopia</h2>
              <p style="color: #666;">Empowering Farmers and Buyers Nationwide</p>
            </div>
            <div style="padding: 25px 0; color: #333;">
              ${html}
            </div>
            <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 15px; font-size: 13px; color: #999;">
              <p>© ${new Date().getFullYear()} Agrochain Ethiopia. All rights reserved.</p>
            </div>
          </div>
        </div>`,
    });
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

// Middleware to restrict unverified users
const restrictUnverifiedUsers = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (user.govIdStatus !== "verified") {
      return res.status(403).json({
        success: false,
        error:
          "Action restricted: Government ID verification pending or not completed",
      });
    }
    next();
  } catch (err) {
    console.error("Error checking verification status:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error checking verification status" });
  }
};

// ---------------------------- BUY PRODUCT ----------------------------

router.post("/buy", auth, restrictUnverifiedUsers, async (req, res) => {
  try {
    const buyer = await User.findOne({ userId: req.user.userId });
    if (buyer.isRestricted)
      return res
        .status(403)
        .json({ success: false, error: "Restricted users cannot make purchases" });

    const { productId, quantity, deliveryAddress } = req.body;
    const buyerUserId = req.user.userId;

    if (!productId || !quantity || !deliveryAddress)
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });

    const product = await Product.findOne({ productId });
    if (!product)
      return res.status(404).json({ success: false, error: "Product not found" });

    if (product.ownerUserId.toString() === buyerUserId)
      return res
        .status(400)
        .json({ success: false, error: "Cannot buy your own product" });

    if (product.quantityAvailable < quantity)
      return res
        .status(400)
        .json({ success: false, error: "Not enough quantity available" });

    const totalPrice = product.price * quantity;
    const buyerFee = (SERVICE_FEE_PERCENT / 100) * totalPrice;
    const sellerFee = (SERVICE_FEE_PERCENT / 100) * totalPrice;
    const totalChargeToBuyer = totalPrice + buyerFee;
    const netAmountToSeller = totalPrice - sellerFee;

    const seller = await User.findOne({ userId: product.ownerUserId });
    if (!seller)
      return res.status(404).json({ success: false, error: "Seller not found" });

    if (buyer.balance < totalChargeToBuyer)
      return res
        .status(400)
        .json({ success: false, error: "Insufficient balance (includes 5% fee)" });

    // Update buyer and product
    buyer.balance -= totalChargeToBuyer;
    buyer.pendingBalance += totalChargeToBuyer;
    await buyer.save();

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

    // Update user history
    await User.updateOne(
      { userId: buyerUserId },
      {
        $addToSet: {
          boughtProducts: product._id,
          closeCustomers: seller._id,
          transactionHistory: transaction._id,
        },
        $inc: { rank: 0.5 },
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
        $inc: { rank: 0.5 },
      }
    );

    // 📩 Notify Seller (New Order)
    await sendNotificationEmail(
      seller.email,
      "🎉 New Order Received!",
      `
        <p>Dear <strong>${seller.fullName}</strong>,</p>
        <p>You have received a new order from <strong>${buyer.fullName}</strong> for:</p>
        <p style="font-size:16px;"><strong>${quantity}</strong> × ${product.title}</p>
        <p>Total Price: <strong>${totalPrice.toFixed(2)} ETB</strong></p>
        <p>Please prepare the order and mark it as <b>Shipped</b> once ready.</p>
        <p>Order ID: <strong>${transaction._id}</strong></p>
      `
    );

    // 📩 Notify Buyer (Order Placed)
    await sendNotificationEmail(
      buyer.email,
      "✅ Order Successfully Placed!",
      `
        <p>Dear <strong>${buyer.fullName}</strong>,</p>
        <p>Your order for <strong>${quantity}</strong> × ${product.title} has been placed successfully.</p>
        <p>The seller <strong>${seller.fullName}</strong> will prepare and ship it soon.</p>
        <p>Order Total: <strong>${totalChargeToBuyer.toFixed(2)} ETB</strong> (including 5% fee)</p>
      `
    );

    res.json({
      success: true,
      message: "Purchase successful! Notifications sent to both parties.",
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
    if (seller.isRestricted)
      return res.status(403).json({ success: false, error: "Restricted users cannot mark shipped" });

    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) return res.status(404).json({ success: false, error: "Transaction not found" });

    if (transaction.sellerUserId !== seller.userId)
      return res.status(403).json({ success: false, error: "Unauthorized action" });

    transaction.status = "shipped";
    await transaction.save();

    const buyer = await User.findOne({ userId: transaction.buyerUserId });

    // 📩 Notify Buyer (Order Shipped)
    await sendNotificationEmail(
      buyer.email,
      "📦 Your Order is On the Way!",
      `
        <p>Hi <strong>${buyer.fullName}</strong>,</p>
        <p>Your order <strong>${transaction._id}</strong> has been marked as shipped by <strong>${seller.fullName}</strong>.</p>
        <p>Expected delivery: 2–3 business weeks.</p>
        <p>Stay tuned for confirmation updates.</p>
      `
    );

    res.json({
      success: true,
      message: "Transaction marked as shipped. Buyer notified via email.",
      transaction,
    });
  } catch (error) {
    console.error("Mark shipped error:", error);
    res.status(500).json({ success: false, error: "Server error during update" });
  }
});

// ---------------------------- CONFIRM DELIVERY ----------------------------

router.post("/confirm-delivery/:transactionId", auth, restrictUnverifiedUsers, async (req, res) => {
  try {
    const buyer = await User.findOne({ userId: req.user.userId });
    if (buyer.isRestricted)
      return res.status(403).json({ success: false, error: "Restricted users cannot confirm" });

    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction)
      return res.status(404).json({ success: false, error: "Transaction not found" });

    const seller = await User.findOne({ userId: transaction.sellerUserId });

    transaction.status = "completed";
    transaction.buyerConfirmed = true;
    transaction.paymentHeld = false;
    transaction.releaseDate = new Date();

    buyer.pendingBalance -= transaction.totalPrice + transaction.platformFeeBuyer;
    seller.balance += transaction.netSellerAmount;

    await transaction.save();
    await buyer.save();
    await seller.save();

    // 📩 Notify Seller (Delivery Confirmed)
    await sendNotificationEmail(
      seller.email,
      "🎉 Order Delivered Successfully!",
      `
        <p>Hi <strong>${seller.fullName}</strong>,</p>
        <p>Your product sold to <strong>${buyer.fullName}</strong> has been confirmed delivered.</p>
        <p><strong>${transaction.netSellerAmount.toFixed(2)} ETB</strong> has been released to your account.</p>
        <p>Keep up the great work!</p>
      `
    );

    // 📩 Notify Buyer (Delivery Confirmed)
    await sendNotificationEmail(
      buyer.email,
      "✅ Delivery Confirmed Successfully!",
      `
        <p>Hi <strong>${buyer.fullName}</strong>,</p>
        <p>Thank you for confirming delivery for your order <strong>${transaction._id}</strong>.</p>
        <p>Your seller <strong>${seller.fullName}</strong> has been credited accordingly.</p>
        <p>We hope to serve you again soon!</p>
      `
    );

    res.json({
      success: true,
      message: "Delivery confirmed. Both parties notified.",
      transaction,
    });
  } catch (error) {
    console.error("Confirm delivery error:", error);
    res.status(500).json({ success: false, error: "Server error during confirmation" });
  }
});

export default router;
