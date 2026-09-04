import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { sendNewOrderEmail, sendShippedEmail } from '../utils/emailService.js';
import { createNotification } from '../controllers/notificationController.js';
import AppError from '../utils/appError.js';

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

class TransactionService {
  async buyProduct(body, userAuth) {
    const { orders, deliveryAddress } = body;
    const authId = userAuth._id || userAuth.id || userAuth.userId;

    const buyer = await findUserByAnyId(authId);
    if (!buyer) throw new AppError("Buyer not found", 404);

    if (!buyer.transactionHistory) buyer.transactionHistory = [];
    buyer.balance = buyer.balance || 0;
    buyer.pendingBalance = buyer.pendingBalance || 0;

    let totalCost = 0;
    const itemsToProcess = [];

    for (const order of orders) {
      const product = await findProductByAnyId(order.productId);
      if (!product) throw new AppError(`Product ${order.productId} not found`, 400);
      
      const isOwner = compareIds(product.ownerUserId, buyer.userId) || compareIds(product.ownerUserId, buyer._id);
      if (isOwner) {
        throw new AppError(`Self-purchase forbidden: "${product.title}"`, 400);
      }

      if (product.quantityAvailable < order.quantity) {
        throw new AppError(`Insufficient stock for ${product.title}`, 400);
      }

      const seller = await findUserByAnyId(product.ownerUserId);
      if (!seller) throw new AppError(`Seller not found`, 400);

      const itemPrice = product.price * order.quantity;
      const fee = (SERVICE_FEE_PERCENT / 100) * itemPrice;
      totalCost += (itemPrice + fee);

      itemsToProcess.push({ product, seller, quantity: order.quantity, itemPrice, fee });
    }

    if (buyer.balance < totalCost) {
      throw new AppError("Insufficient wallet balance", 400);
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

      if (seller.email) {
        sendNewOrderEmail(seller.email, seller.fullName || "seller", product.title, quantity, itemPrice);
      }

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

    return transactionsCreated;
  }

  async markShipped(transactionId, userAuth) {
    const authId = userAuth._id || userAuth.id;
    const authUserId = userAuth.userId;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      throw new AppError("Invalid Order ID format", 400);
    }

    const transaction = await Transaction.findById(transactionId).populate("productId");
    if (!transaction) throw new AppError("Order not found", 404);

    const isSeller = compareIds(transaction.sellerId, authId) || compareIds(transaction.sellerUserId, authUserId);
    if (!isSeller) throw new AppError("Unauthorized", 403);

    transaction.status = "shipped";
    transaction.shippedAt = new Date();
    await transaction.save();

    const buyerUser = await findUserByAnyId(transaction.buyerId || transaction.buyerUserId);
    const productInfo = transaction.productId;

    if (buyerUser && buyerUser.email) {
      sendShippedEmail(buyerUser.email, buyerUser.fullName || "buyer", productInfo ? productInfo.title : "bought product", transaction._id);
    }

    if (buyerUser) {
      await createNotification(
        buyerUser._id,
        'order_shipped',
        'Your Order Has Been Shipped! 🚚',
        `The vendor has dispatched your item "${productInfo ? productInfo.title : 'ordered item'}". It is now on its way to your address.`,
        transaction._id
      );
    }

    return transaction;
  }

  async confirmDelivery(transactionId, userAuth) {
    const authId = userAuth._id || userAuth.id;
    const authUserId = userAuth.userId;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      throw new AppError("Invalid Order ID format", 400);
    }

    const transaction = await Transaction.findById(transactionId).populate("productId");
    if (!transaction) throw new AppError("Transaction not found", 404);

    const isBuyer = compareIds(transaction.buyerId, authId) || compareIds(transaction.buyerUserId, authUserId);
    if (!isBuyer) throw new AppError("Unauthorized", 403);

    if (transaction.status === 'delivered' || transaction.status === 'completed') {
      throw new AppError("Order already confirmed", 400);
    }

    transaction.status = "delivered";
    transaction.deliveredAt = new Date();
    transaction.paymentHeld = false;
    await transaction.save();

    const sellerUser = await findUserByAnyId(transaction.sellerId || transaction.sellerUserId);
    const buyerUser = await findUserByAnyId(transaction.buyerId || transaction.buyerUserId);
    const productInfo = transaction.productId;

    if (sellerUser) {
      sellerUser.balance = (sellerUser.balance || 0) + transaction.netSellerAmount;
      sellerUser.pendingBalance = Math.max(0, (sellerUser.pendingBalance || 0) - transaction.totalPrice);
      await sellerUser.save();

      await createNotification(
        sellerUser._id,
        'payment_released',
        'Payment Released! 💰',
        `Delivery confirmed for "${productInfo ? productInfo.title : 'order'}". Funds ($${transaction.netSellerAmount}) have been credited to your balance.`,
        transaction._id
      );
    }

    if (buyerUser) {
      buyerUser.pendingBalance = Math.max(0, (buyerUser.pendingBalance || 0) - transaction.totalPrice);
      await buyerUser.save();

      await createNotification(
        buyerUser._id,
        'delivery_confirmed',
        'Order Completed ✅',
        `Your delivery for "${productInfo ? productInfo.title : 'order'}" has been confirmed. Thank you for using AgroChain!`,
        transaction._id
      );
    }

    return transaction;
  }

  async cancelOrder(transactionId, userAuth) {
    const authId = userAuth._id || userAuth.id;
    const authUserId = userAuth.userId;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      throw new AppError("Invalid Order ID format", 400);
    }

    const transaction = await Transaction.findById(transactionId).populate("productId");
    if (!transaction) throw new AppError("Transaction not found", 404);

    const isBuyer = compareIds(transaction.buyerId, authId) || compareIds(transaction.buyerUserId, authUserId);
    const isSeller = compareIds(transaction.sellerId, authId) || compareIds(transaction.sellerUserId, authUserId);

    if (!isBuyer && !isSeller) throw new AppError("Unauthorized", 403);
    if (transaction.status === 'shipped' || transaction.status === 'delivered') {
      throw new AppError("Cannot cancel an order that is already shipped or delivered", 400);
    }

    transaction.status = "cancelled";
    await transaction.save();

    if (transaction.productId) {
      const product = await Product.findById(transaction.productId._id);
      if (product) {
        product.quantityAvailable += transaction.quantity;
        if (product.status === "sold out") product.status = "available";
        await product.save();
      }
    }

    const buyerUser = await findUserByAnyId(transaction.buyerId || transaction.buyerUserId);
    const sellerUser = await findUserByAnyId(transaction.sellerId || transaction.sellerUserId);

    if (buyerUser) {
      buyerUser.balance += (transaction.totalPrice + transaction.platformFeeBuyer);
      buyerUser.pendingBalance = Math.max(0, (buyerUser.pendingBalance || 0) - (transaction.totalPrice + transaction.platformFeeBuyer));
      await buyerUser.save();

      await createNotification(
        buyerUser._id,
        'order_cancelled',
        'Order Cancelled & Refunded 🔄',
        `Your order #${transaction._id.toString().slice(-6)} has been cancelled and funds have been refunded to your wallet.`,
        transaction._id
      );
    }

    if (sellerUser && isBuyer) {
      await createNotification(
        sellerUser._id,
        'order_cancelled',
        'Order Cancelled by Buyer ⚠️',
        `Order #${transaction._id.toString().slice(-6)} was cancelled by the buyer.`,
        transaction._id
      );
    }

    return transaction;
  }

  async getMyTransactions(userAuth) {
    const authId = userAuth._id || userAuth.id;
    const authUserId = userAuth.userId;

    const user = await findUserByAnyId(authId || authUserId);
    if (!user) throw new AppError("User not found", 404);

    const transactions = await Transaction.find({
      $or: [
        { buyerId: user._id },
        { sellerId: user._id },
        { buyerUserId: String(user.userId) },
        { sellerUserId: String(user.userId) }
      ]
    })
    .populate("productId", "title price images type")
    .sort({ date: -1 });

    return transactions;
  }
}

export default new TransactionService();
