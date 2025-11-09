import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import auth from '../middleware/auth.js';
import User from '../models/User.js';
import { profilePicUpload, govIdUpload } from '../middleware/upload.js';

const router = express.Router();

// -------------------- Utilities --------------------
const generateUserId = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const pendingUsers = new Map();

transporter.verify((err, success) => {
  if (err) console.error('Nodemailer error:', err);
  else console.log('Nodemailer ready');
});

// Middleware to check email credentials
const checkEmailCredentials = (req, res, next) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res
      .status(500)
      .json({ success: false, error: 'Email credentials missing' });
  }
  next();
};

// Middleware to restrict unverified users
const restrictUnverifiedUsers = async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    if (user.govIdStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        error: 'Action restricted: Government ID verification pending or not completed',
      });
    }
    next();
  } catch (err) {
    console.error('Error checking verification status:', err);
    res.status(500).json({ success: false, error: 'Server error checking verification status' });
  }
};

// -------------------- Registration --------------------
router.post(
  '/register',
  [
    checkEmailCredentials,
    body('fullName')
      .isLength({ min: 2, max: 50 })
      .matches(/^[a-zA-Z\s-]+$/)
      .withMessage('Invalid full name'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
    body('phone').notEmpty().withMessage('Phone required'),
    body('address').notEmpty().withMessage('Address required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ success: false, error: errors.array()[0].msg });

    try {
      const { fullName, email, password, phone, address } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res
          .status(400)
          .json({ success: false, error: 'Email already registered' });

      const userId = generateUserId();
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpires = Date.now() + 5 * 60 * 1000;

      // Store in temporary memory
      pendingUsers.set(email, {
        fullName,
        email,
        password: hashedPassword,
        phone,
        address,
        userId,
        otp: otpHash,
        otpExpires,
      });

      await transporter.sendMail({
        from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <p>Dear  ${fullName},</p>
          <p>Well Come to Agrochain Ethiopia</p>
          <p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>
          <p>Best regards,<br/>Agrochain Ethiopia Team</p>
        `,
      });

      res.status(200).json({
        success: true,
        message: 'OTP sent to email. Please verify to complete registration.',
      });
    } catch (err) {
      console.error('Error during registration:', err);
      res
        .status(500)
        .json({ success: false, error: 'Server error during registration' });
    }
  }
);

// -------------------- Verify OTP (Registration) --------------------
router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ success: false, error: errors.array()[0].msg });

    try {
      const { email, otp } = req.body;
      const pending = pendingUsers.get(email);
      if (!pending)
        return res
          .status(400)
          .json({ success: false, error: 'No OTP request found for this email' });

      if (Date.now() > pending.otpExpires) {
        pendingUsers.delete(email);
        return res.status(400).json({ success: false, error: 'OTP expired' });
      }

      const isValidOtp = await bcrypt.compare(otp, pending.otp);
      if (!isValidOtp)
        return res.status(400).json({ success: false, error: 'Invalid OTP' });

      // Save the user to DB
      const newUser = new User({
        userId: pending.userId,
        fullName: pending.fullName,
        email: pending.email,
        password: pending.password,
        phone: pending.phone,
        address: pending.address,
        verified: false,
      });
      await newUser.save();
      pendingUsers.delete(email);

      const token = jwt.sign(
        { userId: newUser.userId, fullName: newUser.fullName },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Registration complete. Please upload government ID for verification.',
        token,
        user: {
          userId: newUser.userId,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
          verified: newUser.verified,
        },
      });
    } catch (err) {
      console.error('Error verifying OTP:', err);
      res
        .status(500)
        .json({ success: false, error: 'Server error verifying OTP' });
    }
  }
);

// -------------------- Forgot Password --------------------
router.post(
  '/forgot-password',
  [
    checkEmailCredentials,
    body('email').isEmail().withMessage('Invalid email'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ success: false, error: errors.array()[0].msg });

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: 'No user found with this email' });

      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpires = Date.now() + 5 * 60 * 1000;

      // Store OTP in User document
      user.otp = otpHash;
      user.otpExpires = otpExpires;
      await user.save();

      await transporter.sendMail({
        from: `"Agrochain Ethiopia" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset OTP',
        html: `
          <p>Dear ${user.fullName},</p>
          <p>Your OTP for password reset is <strong>${otp}</strong>. It expires in 5 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br/>Agrochain Ethiopia Team</p>
        `,
      });

      res.status(200).json({
        success: true,
        message: 'OTP sent to email for password reset.',
      });
    } catch (err) {
      console.error('Error during forgot password:', err);
      res
        .status(500)
        .json({ success: false, error: 'Server error sending OTP' });
    }
  }
);

// -------------------- Reset Password --------------------
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ success: false, error: errors.array()[0].msg });

    try {
      const { email, otp, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: 'No user found with this email' });

      if (!user.otp || !user.otpExpires || Date.now() > user.otpExpires) {
        return res.status(400).json({ success: false, error: 'OTP expired or invalid' });
      }

      const isValidOtp = await bcrypt.compare(otp, user.otp);
      if (!isValidOtp)
        return res.status(400).json({ success: false, error: 'Invalid OTP' });

      // Update password and clear OTP
      user.password = await bcrypt.hash(password, 10);
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
        message: 'Password reset successfully. You are now logged in.',
        token,
        user: {
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          verified: user.verified,
        },
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      res
        .status(500)
        .json({ success: false, error: 'Server error resetting password' });
    }
  }
);

// -------------------- Login --------------------
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ success: false, error: errors.array()[0].msg });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ success: false, error: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ success: false, error: 'Invalid credentials' });

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
          verified: user.verified,
          isAdmin: user.isAdmin,
        },
      });
    } catch (err) {
      console.error('Error during login:', err);
      res
        .status(500)
        .json({ success: false, error: 'Server error during login' });
    }
  }
);

// -------------------- User Profile (populated) --------------------
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId })
      .select('-password -_id -__v -otp -otpExpires')
      .populate('postedProducts', 'productId title price images createdAt')
      .populate('soldProducts', 'productId title price images createdAt')
      .populate('boughtProducts', 'productId title price images createdAt')
      .populate('savedProducts', 'productId title price images createdAt')
      .populate('transactionHistory')
      .populate('closeCustomers', 'userId fullName profilePic rank customerRating');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, error: 'Server error fetching profile' });
  }
});

// -------------------- Update Profile --------------------
router.patch('/profile', auth, async (req, res) => {
  try {
    const allowedFields = ['username', 'location'];
    const updates = {};
    for (let key of allowedFields) if (req.body[key]) updates[key] = req.body[key];

    if (updates.username) {
      const exists = await User.findOne({
        username: updates.username,
        userId: { $ne: req.user.userId },
      });
      if (exists)
        return res.status(400).json({ success: false, error: 'Username taken' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: updates },
      { new: true, select: '-password -_id -__v -otp -otpExpires' }
    );

    res.json({
      success: true,
      message: 'Profile updated',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res
      .status(500)
      .json({ success: false, error: 'Server error updating profile' });
  }
});

// -------------------- Upload Profile Pic --------------------
router.post(
  '/profile-pic',
  auth,
  profilePicUpload.single('profilePic'),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, error: 'No file uploaded' });

      const updatedUser = await User.findOneAndUpdate(
        { userId: req.user.userId },
        { profilePic: req.file.path },
        { new: true, select: '-password -_id -__v -otp -otpExpires' }
      );

      res.json({
        success: true,
        message: 'Profile picture updated',
        profilePic: updatedUser.profilePic,
      });
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      res
        .status(500)
        .json({ success: false, error: 'Error uploading profile picture' });
    }
  }
);

// -------------------- Upload Government ID --------------------
router.post(
  '/verify-id',
  auth,
  govIdUpload.fields([
    { name: 'govIdFront', maxCount: 1 },
    { name: 'govIdBack', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files?.govIdFront || !req.files?.govIdBack)
        return res
          .status(400)
          .json({ success: false, error: 'Both ID images required' });

      const user = await User.findOne({ userId: req.user.userId });
      if (!user)
        return res.status(404).json({ success: false, error: 'User not found' });

      user.govIdFront = req.files.govIdFront[0].path;
      user.govIdBack = req.files.govIdBack[0].path;
      user.govIdStatus = 'pending';
      user.verified = false;

      await user.save();
      res.json({
        success: true,
        message: 'ID uploaded, pending admin review',
        govIdFront: user.govIdFront,
        govIdBack: user.govIdBack,
      });
    } catch (err) {
      console.error('Error uploading government ID:', err);
      res
        .status(500)
        .json({ success: false, error: 'Server error uploading government ID' });
    }
  }
);

// -------------------- Get User Profile by ID --------------------
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId })
      .select('-password -email -otp -otpExpires -govIdFront -govIdBack')
      .populate('postedProducts')
      .populate('soldProducts')
      .populate('boughtProducts')
      .populate('savedProducts')
      .populate('transactionHistory')
      .populate('closeCustomers', 'userId fullName profilePic rank customerRating');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ success: false, error: 'Server error fetching user profile' });
  }
});

// -------------------- Rate User --------------------
router.post('/:userId/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (!user.customerRating || user.customerRating === 0) {
      user.customerRating = rating;
      user.rank += 0.5;
    } else {
      user.customerRating = (user.customerRating + rating) / 2;
      user.rank += 0.5;
    }

    await user.save();
    res.json({ success: true, message: 'User rated successfully', user });
  } catch (err) {
    console.error('Error rating user:', err);
    res.status(500).json({ success: false, error: 'Server error rating user' });
  }
});

// -------------------- Add Balance (Restricted) --------------------
router.post(
  '/add-balance',
  auth,
  restrictUnverifiedUsers,
  [body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, error: errors.array()[0].msg });
    }  

    
    try {
      const { amount } = req.body;
      const user = await User.findOne({ userId: req.user.userId });

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      user.balance += parseFloat(amount);
      await user.save();

      res.json({
        success: true,
        message: 'Balance added successfully',
        balance: user.balance,
      });
    } catch (err) {
      console.error('Error adding balance:', err);
      res
        .status(500)
        .json({ success: false, error: 'Server error adding balance' });
    }
  }
);

export default router;