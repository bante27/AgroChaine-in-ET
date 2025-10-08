import express from "express";
import auth from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();
const SERVICE_FEE_PERCENT = 5; // 5% from buyer and seller

// -----------------------------
// Reusable modern email sender
// -----------------------------
const sendEmail = async (to, subject, htmlBody) => {
  if (!to || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; background:#f4f7f9; padding:20px;">
        <div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
          <div style="background:#22a45d;color:#fff;padding:16px;text-align:center;">
            <h2 style="margin:0;">🌿 Agrochain Ethiopia</h2>
            <p style="margin:0;font-size:14px;">Empowering Farmers & Buyers Nationwide</p>
          </div>
          <div style="padding:25px;color:#333;line-height:1.6;">
            ${htmlBody}
          </div>
          <div style="text-align:center;padding:10px 0;background:#f9fafb;font-size:12px;color:#888;">
            © ${new Date().getFullYear()} Agrochain Ethiopia. All rights reserved.
          </div>
        </div>
      </div>`;

    await transporter.sendMail({
      from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
};

// -----------------------------
// Middleware: Restrict Unverified Users
// -----------------------------
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
      .json({ success: false, error: "Server error checking verification" });
  }
};

// -----------------------------
// BUY PRODUCT
// -----------------------------
router.post("/buy", auth, restrictUnverifiedUsers, async (req, res) => {
  try {
    const buyer = await User.findOne({ userId: req.user.userId });
    if (buyer.isRestricted)
      return res
        .status(403)
        .json({ success: false, error: "Restricted users cannot buy" });

    const { productId, quantity, deliveryAddress } = req.body;
    const buyerUserId = req.user.userId;

    if (!productId || !quantity || !deliveryAddress)
      return res.status(400).json({
        success: false,
        error: "Product ID, quantity, and delivery address required",
      });

    const product = await Product.findOne({ productId });
    if (!product)
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });

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
      return res
        .status(404)
        .json({ success: false, error: "Seller not found" });

    if (buyer.balance < totalChargeToBuyer)
      return res.status(400).json({
        success: false,
        error: "Insufficient balance (includes 5% fee)",
      });

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

    // Update buyer & seller relations
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

    // ✅ Record Recent Activity
    await User.updateOne(
      { userId: buyerUserId },
      {
        $push: {
          recentActivity: {
            type: "purchase",
            message: `You purchased ${quantity}x ${product.title}`,
            date: new Date(),
          },
        },
      }
    );

    await User.updateOne(
      { userId: seller.userId },
      {
        $push: {
          recentActivity: {
            type: "order-received",
            message: `You received a new order for ${product.title} (${quantity}x)`,
            date: new Date(),
          },
        },
      }
    );

    // ---------- Notifications (modern HTML emails) ----------
    // Seller email: full order + delivery address
    await sendEmail(
      seller.email,
      "🎉 New Order Received – Delivery Details Included",
      `
        <p>Dear <strong>${seller.fullName}</strong>,</p>
        <p>You received a new order from <strong>${buyer.fullName}</strong>.</p>

        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <tr><td style="padding:6px 8px;"><strong>Product</strong></td><td style="padding:6px 8px;">${product.title}</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Quantity</strong></td><td style="padding:6px 8px;">${quantity}</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Unit Price</strong></td><td style="padding:6px 8px;">${product.price.toFixed(2)} ETB</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Total Price</strong></td><td style="padding:6px 8px;">${totalPrice.toFixed(2)} ETB</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Service Fee (seller)</strong></td><td style="padding:6px 8px;">${sellerFee.toFixed(2)} ETB</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Net to you</strong></td><td style="padding:6px 8px;">${netAmountToSeller.toFixed(2)} ETB</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Order ID</strong></td><td style="padding:6px 8px;">${transaction._id}</td></tr>
        </table>

        <div style="margin-top:12px;background:#eefaf6;padding:12px;border-left:4px solid #22a45d;">
          <h4 style="margin:0 0 6px 0;color:#22a45d;">📍 Delivery Address</h4>
          <p style="margin:0;line-height:1.4;">${deliveryAddress}</p>
        </div>

        <p style="margin-top:14px;">Please prepare the order and mark it as <strong>Shipped</strong> once it is ready.</p>
      `
    ).catch(err => {
      // sendEmail already logs errors; catch here to avoid failing response
      console.error("Seller email send failed:", err);
    });

    // Buyer email: order summary (includes fee)
    await sendEmail(
      buyer.email,
      "Order Placed Successfully – Summary",
      `
        <p>Hi <strong>${buyer.fullName}</strong>,</p>
        <p>Your order has been placed successfully. Below is a summary:</p>

        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <tr><td style="padding:6px 8px;"><strong>Product</strong></td><td style="padding:6px 8px;">${product.title}</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Quantity</strong></td><td style="padding:6px 8px;">${quantity}</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Unit Price</strong></td><td style="padding:6px 8px;">${product.price.toFixed(2)} ETB</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Subtotal</strong></td><td style="padding:6px 8px;">${totalPrice.toFixed(2)} ETB</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Service Fee (5%)</strong></td><td style="padding:6px 8px;">${buyerFee.toFixed(2)} ETB</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Total Charged</strong></td><td style="padding:6px 8px;">${totalChargeToBuyer.toFixed(2)} ETB</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Seller</strong></td><td style="padding:6px 8px;">${seller.fullName}</td></tr>
          <tr><td style="padding:6px 8px;"><strong>Order ID</strong></td><td style="padding:6px 8px;">${transaction._id}</td></tr>
        </table>

        <div style="margin-top:12px;background:#eefaf6;padding:12px;border-left:4px solid #22a45d;">
          <h4 style="margin:0 0 6px 0;color:#22a45d;">📍 Delivery Address</h4>
          <p style="margin:0;line-height:1.4;">${deliveryAddress}</p>
        </div>

        <p style="margin-top:14px;">Thank you for choosing Agrochain Ethiopia. We will notify you when the seller ships your order.</p>
      `
    ).catch(err => {
      console.error("Buyer email send failed:", err);
    });

    // ---------- end notifications ----------

    res.json({
      success: true,
      message:
        "Purchase successful. Seller notified. Awaiting delivery confirmation.",
      transaction,
    });
  } catch (error) {
    console.error("Transaction error:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error during transaction" });
  }
});

// -----------------------------
// MARK SHIPPED
// -----------------------------
router.post(
  "/mark-shipped/:transactionId",
  auth,
  restrictUnverifiedUsers,
  async (req, res) => {
    try {
      const seller = await User.findOne({ userId: req.user.userId });
      if (seller.isRestricted)
        return res
          .status(403)
          .json({ success: false, error: "Restricted users cannot mark shipped" });

      const { transactionId } = req.params;
      const transaction = await Transaction.findById(transactionId);
      if (!transaction)
        return res
          .status(404)
          .json({ success: false, error: "Transaction not found" });
      if (transaction.sellerUserId !== seller.userId)
        return res
          .status(403)
          .json({ success: false, error: "Only the seller can mark shipped" });
      if (transaction.status !== "pending")
        return res.status(400).json({
          success: false,
          error: "Transaction cannot be marked as shipped",
        });

      transaction.status = "shipped";
      await transaction.save();

      const buyer = await User.findOne({ userId: transaction.buyerUserId });
      const product = await Product.findById(transaction.productId);

      // Record Recent Activity
      await User.updateOne(
        { userId: seller.userId },
        {
          $push: {
            recentActivity: {
              type: "order-shipped",
              message: `You marked order ${transaction._id} as shipped.`,
              date: new Date(),
            },
          },
        }
      );

      await User.updateOne(
        { userId: buyer.userId },
        {
          $push: {
            recentActivity: {
              type: "order-shipped-notice",
              message: `Your order ${transaction._id} has been shipped.`,
              date: new Date(),
            },
          },
        }
      );

      // Notify buyer via modern email
      await sendEmail(
        buyer.email,
        "📦 Your Order Has Been Shipped!",
        `
          <p>Hi <strong>${buyer.fullName}</strong>,</p>
          <p>Your order <strong>${transaction._id}</strong> has been marked as <strong>Shipped</strong> by <strong>${seller.fullName}</strong>.</p>

          <table style="width:100%;border-collapse:collapse;margin:12px 0;">
            <tr><td style="padding:6px 8px;"><strong>Product</strong></td><td style="padding:6px 8px;">${product?.title || "Product"}</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Quantity</strong></td><td style="padding:6px 8px;">${transaction.quantity}</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Delivery Address</strong></td><td style="padding:6px 8px;">${transaction.deliveryAddress}</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Estimated Delivery</strong></td><td style="padding:6px 8px;">2–3 business weeks</td></tr>
          </table>

          <p style="margin-top:12px;">Thank you for using Agrochain Ethiopia. Track your order using Order ID: <strong>${transaction._id}</strong>.</p>
        `
      ).catch(err => {
        console.error("Buyer shipped email failed:", err);
      });

      res.json({
        success: true,
        message: "Transaction marked as shipped. Buyer notified.",
        transaction,
      });
    } catch (error) {
      console.error("Mark shipped error:", error);
      res
        .status(500)
        .json({ success: false, error: "Server error during update" });
    }
  }
);

// -----------------------------
// CONFIRM DELIVERY
// -----------------------------
router.post(
  "/confirm-delivery/:transactionId",
  auth,
  restrictUnverifiedUsers,
  async (req, res) => {
    try {
      const buyer = await User.findOne({ userId: req.user.userId });
      if (buyer.isRestricted)
        return res
          .status(403)
          .json({ success: false, error: "Restricted users cannot confirm" });

      const { transactionId } = req.params;
      const transaction = await Transaction.findById(transactionId);
      if (!transaction)
        return res
          .status(404)
          .json({ success: false, error: "Transaction not found" });
      if (transaction.buyerUserId !== buyer.userId)
        return res
          .status(403)
          .json({ success: false, error: "Only buyer can confirm delivery" });
      if (!["pending", "shipped"].includes(transaction.status))
        return res.status(400).json({
          success: false,
          error: "Transaction cannot be confirmed now",
        });

      const seller = await User.findOne({ userId: transaction.sellerUserId });
      if (!seller)
        return res
          .status(404)
          .json({ success: false, error: "Seller not found" });

      const product = await Product.findById(transaction.productId);

      transaction.status = "completed";
      transaction.buyerConfirmed = true;
      transaction.paymentHeld = false;
      transaction.releaseDate = new Date();

      buyer.pendingBalance -=
        transaction.totalPrice + transaction.platformFeeBuyer;
      seller.balance += transaction.netSellerAmount;

      await transaction.save();
      await buyer.save();
      await seller.save();

      //  Record Recent Activity
      await User.updateOne(
        { userId: buyer.userId },
        {
          $push: {
            recentActivity: {
              type: "delivery-confirmed",
              message: `You confirmed delivery for order ${transaction._id}`,
              date: new Date(),
            },
          },
        }
      );

      await User.updateOne(
        { userId: seller.userId },
        {
          $push: {
            recentActivity: {
              type: "payment-released",
              message: `Funds released for completed order ${transaction._id}`,
              date: new Date(),
            },
          },
        }
      );

      // Notify seller (delivery confirmed + funds released)
      await sendEmail(
        seller.email,
        "🎉 Delivery Confirmed – Payment Released",
        `
          <p>Hi <strong>${seller.fullName}</strong>,</p>
          <p>Buyer <strong>${buyer.fullName}</strong> confirmed delivery for order <strong>${transaction._id}</strong>.</p>

          <table style="width:100%;border-collapse:collapse;margin:12px 0;">
            <tr><td style="padding:6px 8px;"><strong>Product</strong></td><td style="padding:6px 8px;">${product?.title || "Product"}</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Quantity</strong></td><td style="padding:6px 8px;">${transaction.quantity}</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Order Total Price</strong></td><td style="padding:6px 8px;">${transaction.totalPrice.toFixed(2)} ETB</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Net Released</strong></td><td style="padding:6px 8px;">${transaction.netSellerAmount.toFixed(2)} ETB</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Order ID</strong></td><td style="padding:6px 8px;">${transaction._id}</td></tr>
          </table>

          <p style="margin-top:12px;">Funds have been released to your account. Thank you for selling with Agrochain Ethiopia.</p>
        `
      ).catch(err => {
        console.error("Seller delivery-confirm email failed:", err);
      });

      // Notify buyer (confirmation receipt)
      await sendEmail(
        buyer.email,
        "✅ Delivery Confirmed – Thank You!",
        `
          <p>Hi <strong>${buyer.fullName}</strong>,</p>
          <p>Thanks for confirming delivery for order <strong>${transaction._id}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:12px 0;">
            <tr><td style="padding:6px 8px;"><strong>Product</strong></td><td style="padding:6px 8px;">${product?.title || "Product"}</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Quantity</strong></td><td style="padding:6px 8px;">${transaction.quantity}</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Total Paid</strong></td><td style="padding:6px 8px;">${(transaction.totalPrice + transaction.platformFeeBuyer).toFixed(2)} ETB</td></tr>
            <tr><td style="padding:6px 8px;"><strong>Seller</strong></td><td style="padding:6px 8px;">${seller.fullName}</td></tr>
          </table>
          <p style="margin-top:12px;">We hope you enjoyed your purchase. We look forward to serving you again!</p>
        `
      ).catch(err => {
        console.error("Buyer delivery-confirm email failed:", err);
      });

      res.json({
        success: true,
        message: "Delivery confirmed. Seller notified and funds released.",
        transaction,
      });
    } catch (error) {
      console.error("Confirm delivery error:", error);
      res
        .status(500)
        .json({ success: false, error: "Server error confirming delivery" });
    }
  }
);

// -----------------------------
// GET USER TRANSACTIONS
// -----------------------------
router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.find({
      $or: [{ buyerUserId: userId }, { sellerUserId: userId }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (error) {
    console.error("Get user transactions error:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error fetching transactions" });
  }
});

// -----------------------------
// GET TRANSACTION DETAIL
// -----------------------------
router.get("/:transactionId", auth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.userId;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction)
      return res
        .status(404)
        .json({ success: false, error: "Transaction not found" });

    if (
      transaction.buyerUserId !== userId &&
      transaction.sellerUserId !== userId
    ) {
      return res
        .status(403)
        .json({ success: false, error: "Access denied to this transaction" });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    console.error("Get transaction detail error:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error fetching details" });
  }
});

export default router;
