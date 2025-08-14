const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// buy a product (no wallet — assume external payment succeeded)
router.post('/buy', auth, async (req,res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ success:false, error:'productId required' });
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ success:false, error:'Product not available' });
    if (product.quantity < Number(quantity)) return res.status(400).json({ success:false, error:'Not enough quantity' });

    const buyer = await User.findById(req.user.userId);
    const seller = await User.findById(product.owner);

    const total = Number(product.price) * Number(quantity);
    const transactionId = uuidv4();

    const tx = new Transaction({
      transactionId, buyer: buyer._id, seller: seller._id, product: product._id,
      productSnapshot: { title: product.title, price: product.price },
      quantity: Number(quantity), total, status: 'completed'
    });
    await tx.save();

    product.quantity -= Number(quantity);
    if (product.quantity <= 0) product.isActive = false;
    await product.save();

    buyer.purchases.push({ productId: product._id, title: product.title, price: product.price, quantity: Number(quantity), addedAt: new Date() });
    buyer.totalSpent = (buyer.totalSpent||0) + total;
    buyer.transactions.push({ transactionId, productId: product._id, amount: total, date: new Date(), type: 'purchase' });
    await buyer.save();

    seller.sold.push({ productId: product._id, title: product.title, price: product.price, quantity: Number(quantity), addedAt: new Date() });
    seller.transactions.push({ transactionId, productId: product._id, amount: total, date: new Date(), type: 'sale' });
    await seller.save();

    res.json({ success:true, transaction: tx });
  } catch(err){ console.error(err); res.status(500).json({ success:false, error:'Server error' }); }
});

// get my transactions
router.get('/me', auth, async (req,res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page-1)*limit;
  const txs = await Transaction.find({ $or:[{ buyer: req.user.userId }, { seller: req.user.userId }] })
    .sort({ createdAt: -1 }).skip(Number(skip)).limit(Number(limit))
    .populate('product','title productId').populate('buyer','userId10 username fullName').populate('seller','userId10 username fullName');
  res.json({ success:true, transactions: txs });
});

module.exports = router;

