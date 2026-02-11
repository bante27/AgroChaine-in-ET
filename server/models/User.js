import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true }, // 10-digit public ID
  fullName: { type: String, required: true, trim: true },
  fullNameAmharic: { type: String, trim: true }, // Amharic full name support
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  username: { type: String, unique: true, sparse: true }, // optional, unique if set
  location: { type: String },
  profilePic: { type: String }, // Cloudinary URL for profile picture
  govIdFront: { type: String }, // Cloudinary URL for front government ID
  govIdBack: { type: String }, // Cloudinary URL for back government ID
  govIdStatus: { type: String, default: 'unverified' }, // 'not_uploaded', 'pending', 'approved', 'rejected'
  verified: { type: Boolean, default: false }, // gov id verified
  registrationDate: { type: Date, default: Date.now },
  rank: { type: Number, default: 0 }, // can be used for reputation
  transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  closeCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  soldProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  postedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  customerRating: { type: Number, default: 0 }, // average rating
  isAdmin: { type: Boolean, default: false },
  isRestricted: { type: Boolean, default: false }, // to restrict usage
  balance: { type: Number, default: 0 }, // total available balance
  pendingBalance: { type: Number, default: 0 }, // amount on hold during transactions
  otp: { type: String, default: null }, // one-time password
  otpExpires: { type: Date, default: null }, // OTP expiration
});

export default mongoose.model("User", UserSchema);