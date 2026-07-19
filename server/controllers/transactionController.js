import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { sendNewOrderEmail, sendShippedEmail } from "../utils/emailService.js";

// 🔔 Injected your notification helper function here
import { createNotification } from "./notificationController.js"; 

const SERVICE_FEE_PERCENT = 5;

const compareIds = (id1, id2) => {
  if (!id1 || !id2) return false;
  return String(id1) === String(id2);
};

const findUserByAnyId = async (id) => {
  if (!id) return null;
  const query = [{ userId: String(id) }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    query.push({ _id: id });
  }
  return await User.findOne({ $or: query });
};

const findProductByAnyId = async (id) => {
  if (!id) return null;
  const query = [{ productId: String(id) }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    query.push({ _id: id });
  }
  return await Product.findOne({ $or: query });
};

export const buyProduct = async (req, res) => {
  try {
    const { orders, deliveryAddress } = req.body;
    const authId = req.user._id || req.user.id || req.user.userId;

    const buyer = await findUserByAnyId(authId);
    if (!buyer) return res.status(404).json({ success: false, error: "Buyer not found" });

    if (!buyer.transactionHistory) buyer.transactionHistory = [];
    buyer.balance = buyer.balance || 0;
    buyer.pendingBalance = buyer.pendingBalance || 0;

    let totalCost = 0;
    const itemsToProcess = [];

    for (const order of orders) {
      const product = await findProductByAnyId(order.productId);
      if (!product) return res.status(400).json({ success: false, error: `Product ${order.productId} not found` });
      
      const isOwner = compareIds(product.ownerUserId, buyer.userId) || compareIds(product.ownerUserId, buyer._id);
      if (isOwner) {
        return res.status(400).json({ success: false, error: `Self-purchase forbidden: "${product.title}"` });
      }

      if (product.quantityAvailable < order.quantity) {
        return res.status(400).json({ success: false, error: `Insufficient stock for ${product.title}` });
      }

      const seller = await findUserByAnyId(product.ownerUserId);
      if (!seller) return res.status(400).json({ success: false, error: `Seller not found` });

      const itemPrice = product.price * order.quantity;
      const fee = (SERVICE_FEE_PERCENT / 100) * itemPrice;
      totalCost += (itemPrice + fee);

      itemsToProcess.push({ product, seller, quantity: order.quantity, itemPrice, fee });
    }

    if (buyer.balance < totalCost) {
      return res.status(400).json({ success: false, error: "Insufficient wallet balance" });
    }

    const transactionsCreated = [];
    for (const item of itemsToProcess) {
      const { product, seller, quantity, itemPrice, fee } = item;

      const transaction = new Transaction({
        buyerId: buyer._id,
        sellerId: seller._id,
        buyerUserId: String(buyer.userId),
        sellerUserId: String(seller.userId),
        productId: product._id,
        quantity,
        totalPrice: itemPrice,
        deliveryAddress,
        status: "pending",
        paymentHeld: true,
        platformFeeBuyer: fee,
        netSellerAmount: itemPrice - fee
      });

      product.quantityAvailable -= quantity;
      product.soldQuantity = (product.soldQuantity || 0) + quantity;
      if (product.quantityAvailable <= 0) product.status = "sold out";

      await product.save();
      const savedTx = await transaction.save();
      transactionsCreated.push(savedTx);
      buyer.transactionHistory.push(savedTx._id);

      // 📧 [ኢሜይል ቁጥር 1] 
      if (seller.email) {
        sendNewOrderEmail(
          seller.email, 
          seller.fullName || "ሻጭ", 
          product.title, 
          quantity, 
          itemPrice
        );
      }

      // 🔔 ⚡ REAL-TIME IN-APP NOTIFICATION FOR SELLER
      await createNotification(
        seller._id,
        'order_created',
        'New Product Order Received! 🎉',
        `${buyer.fullName || 'A buyer'} bought ${quantity} unit(s) of your product "${product.title}". Total payout value: $${itemPrice - fee}.`,
        savedTx._id
      );
    }

    buyer.balance -= totalCost;
    buyer.pendingBalance += totalCost;
    await buyer.save();

    res.json({ success: true, transactions: transactionsCreated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const markShipped = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const authId = req.user._id || req.user.id;
    const authUserId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ success: false, error: "Invalid Order ID format" });
    }

    const transaction = await Transaction.findById(transactionId).populate("productId");
    if (!transaction) return res.status(404).json({ success: false, error: "Order not found" });

    const isSeller = compareIds(transaction.sellerId, authId) || compareIds(transaction.sellerUserId, authUserId);
    if (!isSeller) return res.status(403).json({ success: false, error: "Unauthorized" });

    transaction.status = "shipped";
    transaction.shippedAt = new Date();
    await transaction.save();

    const buyerUser = await findUserByAnyId(transaction.buyerId || transaction.buyerUserId);
    const productInfo = transaction.productId;

    if (buyerUser && buyerUser.email) {
      sendShippedEmail(
        buyerUser.email, 
        buyerUser.fullName || "ገዢ", 
        productInfo ? productInfo.title : "የገዙት ምርት", 
        transaction._id
      );
    }

    // 🔔 ⚡ REAL-TIME IN-APP NOTIFICATION FOR BUYER
    if (buyerUser) {
      await createNotification(
        buyerUser._id,
        'order_shipped',
        'Your Order Has Been Shipped! 🚚',
        `The vendor has dispatched your item "${productInfo ? productInfo.title : 'ordered item'}". It is now on its way to your address.`,
        transaction._id
      );
    }

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const confirmDelivery = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const authId = req.user._id || req.user.id;
    const authUserId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ success: false, error: "Invalid Order ID format" });
    }

    const transaction = await Transaction.findById(transactionId).populate("productId");
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const isBuyer = compareIds(transaction.buyerId, authId) || compareIds(transaction.buyerUserId, authUserId);
    if (!isBuyer) {
      return res.status(403).json({ success: false, message: "Only the buyer can confirm delivery" });
    }

    if (transaction.status !== 'shipped') {
      return res.status(400).json({ success: false, message: "Item must be marked as shipped first" });
    }

    const buyer = await User.findOne({
      $or: [{ _id: transaction.buyerId }, { userId: String(transaction.buyerUserId) }]
    });

    const seller = await User.findOne({
      $or: [{ _id: transaction.sellerId }, { userId: String(transaction.sellerUserId) }]
    });

    if (!buyer || !seller) {
      return res.status(404).json({ success: false, message: "Buyer or Seller account could not be located" });
    }

    const totalHeldCost = transaction.netSellerAmount + transaction.platformFeeBuyer;
    buyer.pendingBalance = Math.max(0, (buyer.pendingBalance || 0) - totalHeldCost);
    await buyer.save();

    seller.balance = (seller.balance || 0) + transaction.netSellerAmount;
    await seller.save();

    transaction.status = 'delivered';
    transaction.buyerConfirmed = true;
    transaction.paymentHeld = false; 
    transaction.deliveredAt = new Date();
    await transaction.save();

    // 🔔 ⚡ REAL-TIME IN-APP NOTIFICATION FOR SELLER (Escrow Released)
    await createNotification(
      seller._id,
      'order_delivered',
      'Escrow Payout Released! 💰',
      `The buyer confirmed delivery for "${transaction.productId ? transaction.productId.title : 'your item'}". $${transaction.netSellerAmount} was moved to your clear balance.`,
      transaction._id
    );

    res.status(200).json({ 
      success: true, 
      message: "Order completed successfully. Balance transferred to seller.", 
      transaction 
    });

  } catch (error) {
    console.error("Delivery Confirmation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const authId = req.user._id || req.user.id || req.user.userId;
    const user = await findUserByAnyId(authId);

    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const transactions = await Transaction.find({
      $or: [
        { buyerUserId: String(user.userId) },
        { sellerUserId: String(user.userId) },
        { buyerId: user._id },
        { sellerId: user._id }
      ]
    })
    .populate("productId", "title images price")
    .lean()
    .sort({ createdAt: -1 });

    const transactionsWithSellers = await Promise.all(
      transactions.map(async (txn) => {
        const sellerInfo = await User.findOne({ 
          $or: [{ userId: String(txn.sellerUserId) }, { _id: txn.sellerId }] 
        }).select("fullName profilePic");
        
        return {
          ...txn,
          sellerDetails: sellerInfo || { fullName: "Unknown Seller", profilePic: "" }
        };
      })
    );

    res.json({ success: true, transactions: transactionsWithSellers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getTransactionDetail = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ success: false, error: "Invalid ID format" });
    }

    const transaction = await Transaction.findById(transactionId).populate("productId");
    if (!transaction) return res.status(404).json({ success: false, error: "Transaction not found" });
    
    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// ➕ አድሚን ሁሉንም ኦርደሮች ማየት እንዲችል የሚያደርግ ፈንክሽን

export const getAllTransactions = async (req, res) => {
  try {
    // 1. መጀመሪያ ትራንዛክሽኑን እና ምርቱን ብቻ እናምጣ
    const transactions = await Transaction.find({})
      .populate("productId", "title price images")
      .sort({ createdAt: -1 });


    const detailedTransactions = await Promise.all(
      transactions.map(async (txn) => {
        const orderObj = txn.toObject ? txn.toObject() : txn;

        // የገዢውን መረጃ መፈለጊያ (buyerId ወይም buyerUserId በመጠቀም)
        let buyerInfo = null;
        if (orderObj.buyerId) {
          buyerInfo = await mongoose.model("User").findById(orderObj.buyerId).select("fullName email");
        } else if (orderObj.buyerUserId) {
          buyerInfo = await mongoose.model("User").findOne({ userId: String(orderObj.buyerUserId) }).select("fullName email");
        }

        // የሻጩን መረጃ መፈለጊያ (sellerId ወይም sellerUserId በመጠቀም)
        let sellerInfo = null;
        if (orderObj.sellerId) {
          sellerInfo = await mongoose.model("User").findById(orderObj.sellerId).select("fullName email");
        } else if (orderObj.sellerUserId) {
          sellerInfo = await mongoose.model("User").findOne({ userId: String(orderObj.sellerUserId) }).select("fullName email");
        }

        return {
          ...orderObj,
          buyerId: buyerInfo || { fullName: "Unknown Buyer", email: "" },
          sellerId: sellerInfo || { fullName: "Unknown Seller", email: "" }
        };
      })
    );

    res.json({ success: true, transactions: detailedTransactions });
  } catch (err) {
    console.error("Error in getAllTransactions Admin Controller:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};