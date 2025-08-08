// routes/auth.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { parsePhoneNumber } = require('libphonenumber-js');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

dotenv.config();

const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // must exist

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------- Validation middleware ----------
const validateRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s-]{2,50}$/)
    .withMessage('Full name must be 2-50 characters and contain only letters, spaces, or hyphens')
    .custom((value) => {
      const words = value.trim().split(/\s+/);
      if (words.length < 2) throw new Error('Full name must contain at least two words');
      return true;
    }),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9._-]{3,30}$/)
    .withMessage('Username must be 3-30 chars and contain only letters, numbers, dot, underscore or hyphen'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
    .withMessage('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  body('phone')
    .optional()
    .custom(value => {
      try {
        const phone = parsePhoneNumber(value);
        if (!phone.isValid()) throw new Error();
        return true;
      } catch {
        throw new Error('Please enter a valid phone number');
      }
    }),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .matches(/^[a-zA-Z0-9\s,.-]{5,200}$/)
    .withMessage('Address must be 5-200 characters and contain valid characters'),
  body('agreeToTerms')
    .isBoolean()
    .custom(val => val === true || val === 'true')
    .withMessage('You must agree to the terms and conditions'),
  // optional profile picture and location fields validated loosely
  body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
  body('location').optional().custom(value => {
    // Expect object with latitude & longitude or coordinates array
    if (typeof value === 'string') {
      try { JSON.parse(value); } catch { throw new Error('Invalid location'); }
    } else if (typeof value === 'object') {
      return true;
    }
    return true;
  }),
];

// login validation
const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ---------- Helper utils ----------
function makePublicId() {
  return uuidv4(); // public id exposed to clients
}

function signToken(user) {
  return jwt.sign({ userId: user._id, publicId: user.publicId, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ---------- Routes ----------

// Register
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, error: errors.array()[0].msg, details: errors.array() });
    }

    const {
      fullName, email, password, phone, address, username, profilePicture, location,
    } = req.body;

    // unique checks
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) return res.status(400).json({ success: false, error: 'Email already registered' });

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ success: false, error: 'Username already taken' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const publicId = makePublicId();

    const newUser = new User({
      publicId,
      username,
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      profilePicture: profilePicture || '',
      address: address || '',
      location: location ? (typeof location === 'string' ? JSON.parse(location) : location) : {},
      balance: 0,
      rank: 'newbie',
      verified: false,
      registrationTime: Date.now(),
      friends: [],
      savedProducts: [],
      productsForSale: [],
      purchases: [],
      transactionHistory: [],
    });

    await newUser.save();

    // send welcome email (best-effort)
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: newUser.email,
        subject: 'Welcome to AgroChain Ethiopia!',
        html: `<h2>Welcome, ${newUser.fullName}!</h2><p>Your account has been successfully created. Username: ${newUser.username}</p><p>Best regards,<br>AgroChain Ethiopia Team</p>`,
      };
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.warn('Warning: failed to send welcome email', mailErr);
      // don't fail registration if mail fails
    }

    const token = signToken(newUser);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        publicId: newUser.publicId,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        profilePicture: newUser.profilePicture,
        address: newUser.address,
        location: newUser.location,
        balance: newUser.balance,
        rank: newUser.rank,
        verified: newUser.verified,
        registrationTime: newUser.registrationTime,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        publicId: user.publicId,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        balance: user.balance,
        rank: user.rank,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// Get profile (private)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // authMiddleware should attach userId to req (e.g., req.user.userId)
    const userId = req.user && req.user.userId ? req.user.userId : req.user;
    const user = await User.findById(userId).select('-password').populate('friends', 'username fullName profilePicture');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error', error);
    res.status(500).json({ success: false, error: 'Server error fetching profile' });
  }
});

// Add a transaction (credit or debit) and update balance
router.post('/transaction', authMiddleware, [
  body('type').isIn(['credit', 'debit']).withMessage('Type must be credit or debit'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('description').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

    const userId = req.user.userId;
    const { type, amount, description, counterparty } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // if debit, ensure balance sufficient
    if (type === 'debit' && user.balance < Number(amount)) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' });
    }

    const txId = uuidv4();
    const tx = {
      txId,
      type,
      amount: Number(amount),
      description,
      date: Date.now(),
      counterparty: counterparty ? mongoose.Types.ObjectId(counterparty) : null,
    };

    // update balance
    user.transactionHistory.push(tx);
    user.balance = type === 'credit' ? (user.balance + Number(amount)) : (user.balance - Number(amount));

    await user.save();

    res.json({ success: true, transaction: tx, newBalance: user.balance });
  } catch (error) {
    console.error('Transaction error', error);
    res.status(500).json({ success: false, error: 'Server error adding transaction' });
  }
});

// Save a product (to wishlist)
router.post('/save-product', authMiddleware, [
  body('title').isString().withMessage('Product title required'),
  body('price').isNumeric().withMessage('Product price required'),
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, title, price, meta } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const productRef = { productId: productId || null, title, price: Number(price), meta: meta || {} };
    user.savedProducts.push(productRef);
    await user.save();

    res.json({ success: true, savedProducts: user.savedProducts });
  } catch (error) {
    console.error('Save product error', error);
    res.status(500).json({ success: false, error: 'Server error saving product' });
  }
});

// Add product for sale
router.post('/add-product', authMiddleware, [
  body('title').isString().withMessage('Product title required'),
  body('price').isNumeric().withMessage('Product price required'),
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, title, price, meta } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const productRef = { productId: productId || null, title, price: Number(price), meta: meta || {} };
    user.productsForSale.push(productRef);
    await user.save();

    res.json({ success: true, productsForSale: user.productsForSale });
  } catch (error) {
    console.error('Add product error', error);
    res.status(500).json({ success: false, error: 'Server error adding product' });
  }
});

// Buy a product (simple flow): debit buyer, add to purchases, optionally credit seller's balance
router.post('/buy-product', authMiddleware, [
  body('sellerId').optional().isMongoId(),
  body('title').isString().withMessage('Product title required'),
  body('price').isNumeric().withMessage('Product price required'),
], async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { sellerId, title, price, meta } = req.body;
    const amount = Number(price);

    const buyer = await User.findById(buyerId);
    if (!buyer) return res.status(404).json({ success: false, error: 'Buyer not found' });

    if (buyer.balance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' });
    }

    // perform debit transaction for buyer
    const buyerTxId = uuidv4();
    buyer.transactionHistory.push({
      txId: buyerTxId,
      type: 'debit',
      amount,
      description: `Purchase: ${title}`,
      date: Date.now(),
      counterparty: sellerId ? mongoose.Types.ObjectId(sellerId) : null,
    });
    buyer.balance -= amount;
    buyer.purchases.push({ productId: null, title, price: amount, meta: meta || {} });

    // credit seller if provided
    let seller;
    if (sellerId) {
      seller = await User.findById(sellerId);
      if (seller) {
        const sellerTxId = uuidv4();
        seller.transactionHistory.push({
          txId: sellerTxId,
          type: 'credit',
          amount,
          description: `Sale: ${title}`,
          date: Date.now(),
          counterparty: buyer._id,
        });
        seller.balance += amount;
        // Optionally remove from seller.productsForSale where title matches (you may want a productId in real app)
        seller.productsForSale = seller.productsForSale.filter(p => !(p.title === title && p.price === amount));
        await seller.save();
      }
    }

    await buyer.save();

    res.json({
      success: true,
      message: 'Purchase completed',
      buyer: { id: buyer._id, balance: buyer.balance, purchases: buyer.purchases.slice(-5) },
      seller: seller ? { id: seller._id, balance: seller.balance } : null,
    });
  } catch (error) {
    console.error('Buy product error', error);
    res.status(500).json({ success: false, error: 'Server error during purchase' });
  }
});

// Add friend (close customer)
router.post('/friends/add', authMiddleware, [
  body('friendId').isMongoId().withMessage('friendId must be a valid user id'),
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.body;

    if (userId === friendId) return res.status(400).json({ success: false, error: 'Cannot add yourself as friend' });

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ success: false, error: 'User or friend not found' });

    if (!user.friends.includes(friend._id)) user.friends.push(friend._id);
    if (!friend.friends.includes(user._id)) friend.friends.push(user._id);

    await user.save();
    await friend.save();

    res.json({ success: true, friends: user.friends });
  } catch (error) {
    console.error('Add friend error', error);
    res.status(500).json({ success: false, error: 'Server error adding friend' });
  }
});

// Remove friend
router.post('/friends/remove', authMiddleware, [
  body('friendId').isMongoId().withMessage('friendId must be a valid user id'),
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const { friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ success: false, error: 'User or friend not found' });

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ success: true, friends: user.friends });
  } catch (error) {
    console.error('Remove friend error', error);
    res.status(500).json({ success: false, error: 'Server error removing friend' });
  }
});

// Update profile (partial)
router.patch('/profile', authMiddleware, [
  body('fullName').optional().isString(),
  body('profilePicture').optional().isURL(),
  body('address').optional().isString(),
  body('location').optional(),
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const allowed = ['fullName', 'profilePicture', 'address', 'location', 'phone'];
    const toSet = {};
    allowed.forEach(k => {
      if (typeof updates[k] !== 'undefined') toSet[k] = updates[k];
    });

    const user = await User.findByIdAndUpdate(userId, { $set: toSet }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Update profile error', error);
    res.status(500).json({ success: false, error: 'Server error updating profile' });
  }
});

// Get transaction history (paginated)
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;
    const user = await User.findById(userId).select('transactionHistory');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // simple pagination on array
    const start = (page - 1) * limit;
    const paged = user.transactionHistory.slice().reverse().slice(start, start + Number(limit));

    res.json({ success: true, transactions: paged });
  } catch (error) {
    console.error('Transactions error', error);
    res.status(500).json({ success: false, error: 'Server error fetching transactions' });
  }
});

module.exports = router;
