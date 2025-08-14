const mongoose = require('mongoose');

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
  ownerUserId: { type: String, required: true }, // link to User.userId
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
soldQuantity: { type: Number, default: 0 },


});

module.exports = mongoose.model('Product', ProductSchema);
