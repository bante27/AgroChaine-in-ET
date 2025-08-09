const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },  // 10-digit public ID
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },  // optional, unique if set
  location: { type: String },
  profilePic: { type: String },  // path to image
  governmentIdPic: { type: String }, // path to gov id image
  verified: { type: Boolean, default: false },  // gov id verified
  registrationDate: { type: Date, default: Date.now },
  rank: { type: Number, default: 0 },  // can be used for reputation
  transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],  // optional
  savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  closeCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  soldProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  customerRating: { type: Number, default: 0 }, // average rating
});

module.exports = mongoose.model('User', UserSchema);
