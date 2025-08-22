require('dotenv').config();
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { profilePicUpload, govIdUpload } = require('../middleware/upload');
const nodemailer = require('nodemailer');

// -------------------- Utilities --------------------
const generateUserId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) console.error('Nodemailer error:', err);
  else console.log('Nodemailer ready');
});

// Middleware to check email credentials
const checkEmailCredentials = (req, res, next) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ success: false, error: 'Email credentials missing' });
  }
  next();
};

// -------------------- Registration --------------------
router.post('/register', [
  checkEmailCredentials,
  body('fullName').isLength({ min: 2, max: 50 }).matches(/^[a-zA-Z\s-]+$/).withMessage('Invalid full name'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('phone').notEmpty().withMessage('Phone required'),
  body('address').notEmpty().withMessage('Address required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

  try {
    const { fullName, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, error: 'Email already registered' });

    const userId = generateUserId();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    const newUser = new User({
      userId,
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
      otp: otpHash,
      otpExpires,
      emailVerified: false,
      govIdStatus: 'none'
    });
    await newUser.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.status(201).json({ success: true, message: 'User registered. OTP sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// -------------------- Verify OTP --------------------
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Invalid email'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, error: errors.array()[0].msg });

  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (!user.otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, error: 'OTP expired or not generated' });
    }

    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) return res.status(400).json({ success: false, error: 'Invalid OTP' });

    user.emailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { userId: user.userId, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      success: true,
      token,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        emailVerified: user.emailVerified,
        govIdStatus: user.govIdStatus
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error verifying OTP' });
  }
});

// -------------------- Login --------------------
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
    if (!user.emailVerified) return res.status(403).json({ success: false, error: 'Verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.userId, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// -------------------- User Profile --------------------
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-password -_id -__v');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error fetching profile' });
  }
});

router.patch('/profile', auth, async (req, res) => {
  try {
    const allowedFields = ['username', 'location'];
    const updates = {};
    for (let key of allowedFields) if (req.body[key]) updates[key] = req.body[key];

    if (updates.username) {
      const exists = await User.findOne({ username: updates.username, userId: { $ne: req.user.userId } });
      if (exists) return res.status(400).json({ success: false, error: 'Username taken' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: updates },
      { new: true, select: '-password -_id -__v' }
    );

    res.json({ success: true, message: 'Profile updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error updating profile' });
  }
});

// -------------------- Upload Profile Pic --------------------
router.post('/profile-pic', auth, profilePicUpload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { profilePic: `/uploads/profilePics/${req.file.filename}` },
      { new: true, select: '-password -_id -__v' }
    );

    res.json({ success: true, message: 'Profile picture updated', profilePic: updatedUser.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error uploading profile picture' });
  }
});

// -------------------- Upload Government ID --------------------
router.post('/verify-id', auth, govIdUpload.fields([{ name: 'govIdFront', maxCount: 1 }, { name: 'govIdBack', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files?.govIdFront || !req.files?.govIdBack)
      return res.status(400).json({ success: false, error: 'Both ID images required' });

    const user = await User.findOne({ userId: req.user.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    user.govIdFront = `/uploads/govIds/${req.files.govIdFront[0].filename}`;
    user.govIdBack = `/uploads/govIds/${req.files.govIdBack[0].filename}`;
    user.govIdStatus = 'pending';
    await user.save();

    res.json({
      success: true,
      message: 'ID uploaded, pending review',
      govIdStatus: user.govIdStatus,
      govIdFront: user.govIdFront,
      govIdBack: user.govIdBack
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error uploading government ID' });
  }
});

module.exports = router;
