// models/Product.js
import mongoose from "mongoose";

// Subdocument schema for reviews
const ReviewSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },               // Optional rating field
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user
  userName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true },  // custom unique product ID
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },

  type: { type: String, required: true },
  originAddress: { type: String, required: true },

  images: [String],  // array of image paths

  // Quantity Tracking
  initialQuantity: { type: Number, required: true },       // Total stock uploaded
  quantityAvailable: { type: Number, required: true },     // Current stock
  soldQuantity: { type: Number, default: 0 },

  // Ownership
  ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },

  // Reviews
  reviews: [ReviewSchema],
  averageRating: { type: Number, default: 0 },

  // Likes
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Optional Comment Field
  comment: { type: String },

  // Product Availability
  status: {
    type: String,
    enum: ['active', 'sold out', 'removed'],
    default: 'active',
  },
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

export default mongoose.model("Product", ProductSchema);
