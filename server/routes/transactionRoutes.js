import express from "express";
import auth from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

const SERVICE_FEE_PERCENT = 5; // 5% from buyer and seller

// Create a purchase (buy a product)
router.post("/buy", auth, async (req, res) => {
  try {
    const { productId, quantity, deliveryAddress } = req.body;
    const buyerUserId = req.user.userId;

    if (!productId || !quantity || !deliveryAddress)
      return res.status(400).json({
        success: false,
        error: "Product ID, quantity, and delivery address are required",
      });

    // Fetch product
    const product = await Product.findOne({ productId });
    if (!product)
      return res.status(404).json({ success: false, error: "Product not found" });

    if (product.ownerUserId.toString() === buyerUserId)
      return res.status(400).json({ success: false, error: "Cannot buy your own product" });

    if (product.quantityAvailable < quantity)
      return res.status(400).json({ success: false, error: "Not enough quantity available" });

    const totalPrice = product.price * quantity;

    // Calculate service fees
    const buyerFee = (SERVICE_FEE_PERCENT / 100) * totalPrice;
    const sellerFee = (SERVICE_FEE_PERCENT / 100) * totalPrice;
    const totalChargeToBuyer = totalPrice + buyerFee;
    const netAmountToSeller = totalPrice - sellerFee;

    // Fetch buyer and seller
    const buyer = await User.findOne({ userId: buyerUserId });
    const seller = await User.findOne({ userId: product.ownerUserId });

    if (!buyer || !seller)
      return res.status(404).json({ success: false, error: "Buyer or seller not found" });

    if (buyer.balance < totalChargeToBuyer)
      return res.status(400).json({ success: false, error: "Insufficient balance (includes 5% fee)" });

    // Hold buyer funds
    buyer.balance -= totalChargeToBuyer;
    buyer.pendingBalance += totalChargeToBuyer;
    await buyer.save();

    // Update product stock
    product.quantityAvailable -= quantity;
    product.soldQuantity += quantity;
    if (product.quantityAvailable === 0) {
      product.status = "sold out";
    }
    await product.save();

    // Create transaction with fees
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

    // Update user relationships
    await User.updateOne(
      { userId: buyerUserId },
      { 
        $addToSet: { 
          boughtProducts: product._id, 
          closeCustomers: product.ownerUserId,
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
          closeCustomers: buyerUserId,
          transactionHistory: transaction._id,
        },
        $inc: { rank: 0.5 }
      }
    );

    res.json({
      success: true,
      message: "Purchase successful. Awaiting delivery confirmation.",
      transaction,
    });
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ success: false, error: "Server error during transaction" });
  }
});

export default router;
