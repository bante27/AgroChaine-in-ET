const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a purchase (buy a product)
router.post('/buy', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ success: false, error: 'Product ID and quantity required' });

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    if (product.availableQuantity < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient quantity available' });
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Create transaction
    const transaction = new Transaction({
      buyerUserId: req.user.userId,
      sellerUserId: product.ownerUserId,
      productId,
      quantity,
      totalPrice,
      status: 'completed',
    });

    await transaction.save();

    // Update product quantities
    product.soldQuantity += quantity;
    product.availableQuantity -= quantity;
    await product.save();

    // Update buyer and seller bought/sold products & close customers
    await User.updateOne(
      { userId: req.user.userId },
      { $addToSet: { boughtProducts: product._id, closeCustomers: product.ownerUserId } }
    );
    await User.updateOne(
      { userId: product.ownerUserId },
      { $addToSet: { soldProducts: product._id, closeCustomers: req.user.userId } }
    );

    res.json({ success: true, message: 'Purchase successful', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error creating transaction' });
  }
});

// Get transaction history for user (buyer and seller)
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.find({
      $or: [{ buyerUserId: userId }, { sellerUserId: userId }],
    }).sort({ date: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error fetching transactions' });
  }
});

module.exports = router;
