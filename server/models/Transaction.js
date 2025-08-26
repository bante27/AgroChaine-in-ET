// models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  buyerUserId: { type: String, required: true },               // User.userId of buyer
  sellerUserId: { type: String, required: true },              // User.userId of seller
  productId: { type: String, required: true },                 // Product._id or custom product ID
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },

  date: { type: Date, default: Date.now },

  // Transaction status
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Escrow-specific fields
  paymentHeld: { type: Boolean, default: true },               // true if money is in escrow
  releaseDate: { type: Date },                                 // when money is released to seller
  buyerConfirmed: { type: Boolean, default: false },           // buyer confirms delivery
  cancelledReason: { type: String },    
  deliveryAddress: { type: String, required: true },
platformFeeBuyer: { type: Number },       // 5% of totalPrice
platformFeeSeller: { type: Number },      // 5% of totalPrice
netSellerAmount: { type: Number },        // totalPrice - sellerFee
serviceFeePercent: { type: Number, default: 5 },
                       // optional cancellation notes
});

export default mongoose.model("Transaction", TransactionSchema);
