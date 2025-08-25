import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  userId: { type: String },  // optional: track who made the comment
  userName: { type: String },  // optional: store user name
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true },  // custom unique product id
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originAddress: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
  comment: { type: String },
  images: [String],  // array of image paths
  ownerUserId: { type: String, required: true },
  soldQuantity: { type: Number, default: 0 },
  ownerName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // ✅ New Fields
  reviews: [ReviewSchema],         // Array of review comments
  likesCount: { type: Number, default: 0 },  // Total number of likes
});

export default mongoose.model("Product", ProductSchema);
