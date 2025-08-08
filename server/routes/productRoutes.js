const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route POST /api/products
 * @desc Upload a new product
 * @access Private (requires a verified user)
 */
router.post('/', upload.single('productImage'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.verificationStatus !== 'verified') {
            return res.status(403).json({ msg: 'User is not verified to sell products.' });
        }

        const { name, price, origin, quantity, type, description } = req.body;
        const productImage = req.file;

        if (!productImage) {
            return res.status(400).json({ msg: 'Product image is required.' });
        }

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(`data:image/jpeg;base64,${productImage.buffer.toString('base64')}`, { folder: 'products' });

        // Create a new product document in MongoDB
        const newProduct = new Product({
            seller: req.user.id,
            name,
            price,
            origin,
            quantity,
            type,
            description,
            imageUrl: imageUpload.secure_url,
        });

        await newProduct.save();
        res.status(201).json(newProduct);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route GET /api/marketplace
 * @desc Get all products for the public marketplace
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        // Fetch all products from the database and populate seller info
        const products = await Product.find().populate('seller', 'name');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;