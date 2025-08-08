// models/User.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  txId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  counterparty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // optional
});

const ProductRefSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: false }, // optional reference if you store products in DB
  title: { type: String, required: true },
  price: { type: Number, required: true },
  meta: { type: mongoose.Schema.Types.Mixed }, // any extra metadata (images, desc, etc.)
  addedAt: { type: Date, default: Date.now },
});

const LocationSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
});

const UserSchema = new mongoose.Schema({
  // internal mongo _id exists by default
  publicId: { type: String, required: true, unique: true }, // uuid or short id
  username: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' }, // store URL
  location: { type: LocationSchema, default: {} },
  address: { type: String, default: '' }, // kept for backward compatibility
  // marketplace fields
  balance: { type: Number, default: 0 },
  rank: { type: String, default: 'newbie' }, // e.g. newbie, trusted, seller, vip
  verified: { type: Boolean, default: false },
  registrationTime: { type: Date, default: Date.now },
  // relations
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // close customers (friends)
  savedProducts: [ProductRefSchema],
  productsForSale: [ProductRefSchema],
  purchases: [ProductRefSchema], // products the user bought
  transactionHistory: [TransactionSchema],
  // admin / misc
  isAdmin: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Create text index on username & email for lookup convenience
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
