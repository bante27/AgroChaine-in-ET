const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const { productImageUpload } = require('../middleware/upload');

// Utility to generate unique productId (10 digit)
const generateProductId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Add a product
router.post('/', auth, productImageUpload.array('images', 5), async (req, res) => {
  try {
    const {
      title, price, originAddress, type, quantity, description, comment,
    } = req.body;

    const images = req.files ? req.files.map(f => `/uploads/productImages/${f.filename}`) : [];

    const productId = generateProductId();

    const newProduct = new Product({
      productId,
      title,
      price,
      originAddress,
      type,
      quantity,
      description,
      comment,
      images,
      ownerUserId: req.user.userId,
    });

    await newProduct.save();

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error adding product' });
  }
});

// Get all products with pagination and optional search query
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', type } = req.query;

    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (type) filter.type = type;

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(filter);

    res.json({
      success: true,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      total: count,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error fetching products' });
  }
});

// Get single product by productId
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error fetching product' });
  }
});

module.exports = router;
