import express from "express";
import auth from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const router = express.Router();

const SERVICE_FEE_PERCENT = 5; // 5% from buyer and seller

// Create a purchase (buy a product)
// Create a purchase (buy a product) using custom productId
                router.post("/buy", auth, async (req, res) => {
                  try {
                    const { productId, quantity, deliveryAddress } = req.body;
                    const buyerUserId = req.user.userId;

                    // Validate request
                    if (!productId || !quantity || !deliveryAddress) {
                      return res.status(400).json({
                        success: false,
                        error: "Product ID, quantity, and delivery address are required",
                      });
                    }

                    // Find product by custom productId instead of Mongo _id
                    const product = await Product.findOne({ productId });
                    if (!product) {
                      return res.status(404).json({ success: false, error: "Product not found" });
                    }

                    // Prevent buying your own product
                    if (product.ownerUserId.toString() === buyerUserId) {
                      return res.status(400).json({ success: false, error: "Cannot buy your own product" });
                    }

                    // Check quantity availability
                    if (product.quantityAvailable < quantity) {
                      return res.status(400).json({ success: false, error: "Not enough quantity available" });
                    }

                    const totalPrice = product.price * quantity;

                    // Calculate service fees
                    const buyerFee = (SERVICE_FEE_PERCENT / 100) * totalPrice;
                    const sellerFee = (SERVICE_FEE_PERCENT / 100) * totalPrice;
                    const totalChargeToBuyer = totalPrice + buyerFee;
                    const netAmountToSeller = totalPrice - sellerFee;

                    // Fetch buyer and seller
                    const buyer = await User.findOne({ userId: buyerUserId });
                    const seller = await User.findOne({ userId: product.ownerUserId });

                    if (!buyer || !seller) {
                      return res.status(404).json({ success: false, error: "Buyer or seller not found" });
                    }

                    // Check buyer balance
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
                      productId: product._id, // still store Mongo _id for internal tracking
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

                    // Update buyer and seller relationships
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

                    res.json({
                      success: true,
                      message: "Purchase successful. Awaiting delivery confirmation.",
                      transaction,
                    });

                  } catch (error) {
                    console.error("Transaction error:", error); // log full error
                    res.status(500).json({ success: false, error: "Server error during transaction" });
                  }
                });


// Mark transaction as shipped (seller action)
router.post("/mark-shipped/:transactionId", auth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const sellerUserId = req.user.userId;

    // Find the transactionz
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, error: "Transaction not found" });
    }

    // Verify the seller is the one updating
    if (transaction.sellerUserId !== sellerUserId) {
      return res.status(403).json({ success: false, error: "Only the seller can mark as shipped" });
    }

    // Check if transaction is in a valid state
    if (transaction.status !== "pending") {
      return res.status(400).json({ success: false, error: "Transaction cannot be marked as shipped in current status" });
    }

    // Update transaction status
    transaction.status = "shipped";
    await transaction.save();

    res.json({
      success: true,
      message: "Transaction marked as shipped. Awaiting buyer confirmation.",
      transaction,
    });
  } catch (error) {
    console.error("Mark shipped error:", error);
    res.status(500).json({ success: false, error: "Server error during status update" });
  }
});

// Confirm delivery of a transaction (buyer action)
router.post("/confirm-delivery/:transactionId", auth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const buyerUserId = req.user.userId;

    // Find the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, error: "Transaction not found" });
    }

    // Verify the buyer is the one confirming
    if (transaction.buyerUserId !== buyerUserId) {
      return res.status(403).json({ success: false, error: "Only the buyer can confirm delivery" });
    }

    // Check if transaction is in a valid state
    if (transaction.status !== "pending" && transaction.status !== "shipped") {
      return res.status(400).json({ success: false, error: "Transaction cannot be confirmed in current status" });
    }

    // Fetch buyer and seller
    const buyer = await User.findOne({ userId: transaction.buyerUserId });
    const seller = await User.findOne({ userId: transaction.sellerUserId });

    if (!buyer || !seller) {
      return res.status(404).json({ success: false, error: "Buyer or seller not found" });
    }

    // Update transaction
    transaction.status = "completed";
    transaction.buyerConfirmed = true;
    transaction.paymentHeld = false;
    transaction.releaseDate = new Date();

    // Release funds: deduct from buyer's pending balance, credit seller
    buyer.pendingBalance -= (transaction.totalPrice + transaction.platformFeeBuyer);
    seller.balance += transaction.netSellerAmount;

    // Save changes
    await transaction.save();
    await buyer.save();
    await seller.save();

    res.json({
      success: true,
      message: "Delivery confirmed. Funds released to seller.",
      transaction,
    });
  } catch (error) {
    console.error("Confirm delivery error:", error);
    res.status(500).json({ success: false, error: "Server error during delivery confirmation" });
  }
});

export default router;