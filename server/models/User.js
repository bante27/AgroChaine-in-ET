import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true }, // 10-digit public ID
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: false, default: "" },
  address: { type: String, required: false, default: "" },
  username: { type: String, unique: true, sparse: true }, 
  location: { type: String },
  profilePic: { type: String }, 
  nationalIdNumber: { type: String, unique: true, sparse: true }, 
  govIdFront: { type: String }, 
  govIdBack: { type: String }, 
  govIdSelfie: { type: String }, 
  govIdStatus: { 
    type: String, 
    // Simplify this: use 'approved' to match your dashboard display logic
    enum: ['unverified', 'pending', 'approved', 'rejected'],
    default: 'unverified' 
  },
  verified: { type: Boolean, default: false }, 
  registrationDate: { type: Date, default: Date.now },
  rank: { type: Number, default: 0 }, 
  
  // --- AUTH TYPE IDENTIFIER (✨ NEWLY ADDED) ---
  isGoogleUser: { type: Boolean, default: false }, // 👈 የጉግል ተጠቃሚዎች የይለፍ ቃል ሲቀይሩ ወይም ፕሮፋይል ሲያድሱ መለያ ፍላግ
  
  // --- ROLE & PERMISSION FIELDS ---
  isAdmin: { type: Boolean, default: false },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'superadmin'], 
    default: 'user' 
  },
  isRestricted: { type: Boolean, default: false }, 
  
  // --- FINANCIALS ---
  balance: { type: Number, default: 0 }, 
  pendingBalance: { type: Number, default: 0 }, 
  
  // --- RELATIONSHIPS ---
  transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  closeCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  boughtProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  soldProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  postedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  customerRating: { type: Number, default: 0 },
  
  // --- SECURITY ---
  otp: { type: String, default: null }, 
  otpExpires: { type: Date, default: null }, 
  recentActivity: [
    {
      type: { type: String },
      message: { type: String },
      date: { type: Date, default: Date.now },
    }
  ],
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Middleware to keep isAdmin and role in sync
UserSchema.pre('save', function(next) {
  if (this.role === 'admin' || this.role === 'superadmin') {
    this.isAdmin = true;
  } else {
    this.isAdmin = false;
  }
  next();
});

export default mongoose.model("User", UserSchema);