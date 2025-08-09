const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const Product = require('../models/Product');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// create product with images
router.post('/', auth, upload.array('images', 6), async (req,res) => {
  try {
    const { title, price, originAddress, type, quantity = 1, description = '', comment = '' } = req.body;
    if (!title || !price || !originAddress) return res.status(400).json({ success:false, error:'title, price, originAddress required' });
    const images = (req.files||[]).map(f => `/uploads/${f.filename}`);
    const product = new Product({
      productId: uuidv4(),
      owner: req.user.userId,
      title, description, comment, price: Number(price),
      originAddress, type, quantity: Number(quantity), images
    });
    await product.save();
    await User.findByIdAndUpdate(req.user.userId, { $push: { productsForSale: { productId: product._id, title: product.title, price: product.price, quantity: product.quantity } }});
    res.status(201).json({ success:true, product });
  } catch(err){ console.error(err); res.status(500).json({ success:false, error:'Server error' }); }
});

// list active products (marketplace) with filters and pagination
router.get('/', async (req,res) => {
  try {
    const { q, type, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (type) filter.type = type;
    if (minPrice) filter.price = { ...(filter.price||{}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price||{}), $lte: Number(maxPrice) };
    const skip = (page-1)*limit;
    const items = await Product.find(filter).populate('owner','username userId10 fullName profilePicture').skip(Number(skip)).limit(Number(limit));
    res.json({ success:true, items });
  } catch(err){ console.error(err); res.status(500).json({ success:false, error:'Server error' }); }
});

// single product
router.get('/:id', async (req,res) => {
  try {
    const p = await Product.findById(req.params.id).populate('owner','username userId10 fullName profilePicture');
    if (!p) return res.status(404).json({ success:false, error:'Product not found' });
    res.json({ success:true, product: p });
  } catch(err){ console.error(err); res.status(500).json({ success:false, error:'Server error' }); }
});

// deactivate (owner only)
router.delete('/:id', auth, async (req,res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ success:false, error:'Product not found' });
  if (String(p.owner) !== String(req.user.userId) && !req.user.isAdmin) return res.status(403).json({ success:false, error:'Not allowed' });
  p.isActive = false; await p.save();
  res.json({ success:true, message:'Product deactivated' });
});

module.exports = router;
