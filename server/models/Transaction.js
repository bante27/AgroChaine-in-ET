const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  buyerUserId: { type: String, required: true },
  sellerUserId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
