const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { profilePicUpload, govIdUpload } = require('../middleware/upload');

// Utility to generate random 10-digit userId
const generateUserId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Registration
router.post('/register', [
  body('fullName').isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z\s-]+$/).withMessage('Invalid full name'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('phone').notEmpty().withMessage('Phone required'),
  body('address').notEmpty().withMessage('Address required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

  try {
    let { fullName, email, password, phone, address } = req.body;

    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, error: 'Email already registered' });

    const userId = generateUserId();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ userId, fullName, email, password: hashedPassword, phone, address });
    await user.save();

    const token = jwt.sign({ userId: user.userId, fullName: user.fullName }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, token, user: {
      userId, fullName, email, phone, address,
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.userId, fullName: user.fullName }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, token, user: {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      username: user.username,
      location: user.location,
      profilePic: user.profilePic,
      verified: user.verified,
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// Get user profile (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-password -_id -__v');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error fetching profile' });
  }
});

// Update user profile (username, location)
router.patch('/profile', auth, async (req, res) => {
  try {
    const allowedFields = ['username', 'location'];
    const updates = {};
    for (let key of allowedFields) {
      if (req.body[key]) updates[key] = req.body[key];
    }

    if (updates.username) {
      const userExists = await User.findOne({ username: updates.username, userId: { $ne: req.user.userId } });
      if (userExists) return res.status(400).json({ success: false, error: 'Username already taken' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: updates },
      { new: true, select: '-password -_id -__v' }
    );

    res.json({ success: true, message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error updating profile' });
  }
});

// Upload profile pic
router.post('/profile-pic', auth, profilePicUpload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { profilePic: `/uploads/profilePics/${req.file.filename}` },
      { new: true, select: '-password -_id -__v' }
    );

    res.json({ success: true, message: 'Profile picture updated', profilePic: updatedUser.profilePic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error uploading profile picture' });
  }
});

// Upload government ID for verification
router.post('/verify-id', auth, govIdUpload.single('govId'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { governmentIdPic: `/uploads/govIds/${req.file.filename}`, verified: false }
    );

    res.json({ success: true, message: 'Government ID uploaded, pending verification' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error uploading government ID' });
  }
});

module.exports = router;
