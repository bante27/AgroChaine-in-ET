import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import { profilePicUpload, govIdUpload } from '../middleware/upload.js';
import transporter from '../utils/mailer.js';

const router = express.Router();

// -------------------- Utilities --------------------
const generateUserId = () =>
  Math.floor(1000000000 + Math.random() * 9000000000).toString();

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Email transporter is now imported from ../utils/mailer.js
const pendingUsers = new Map();

transporter.verify((err, success) => {
  if (err) console.error('Email service error:', err);
  else console.log('Email service (Gmail) ready');
});

// Middleware to check email credentials
const checkEmailCredentials = (req, res, next) => {
  const emailUser = process.env.EMAIL_USER || process.env.NODEMAILER_EMAIL;
  const emailPass = process.env.EMAIL_PASS || process.env.NODEMAILER_PASS;

  if (!emailUser || !emailPass) {
    return res
      .status(500)
      .json({ success: false, error: 'Email service credentials missing' });
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
      .isLength({ min: 2, max: 100 })
      .matches(/^[a-zA-Z\u1200-\u137F\s-]+$/)
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

      // 📧 BACKGROUND PROCESS: Send email asynchronously
      (async () => {
        try {
          await transporter.sendMail({
            to: email,
            subject: 'Your OTP Code - Agrochain Ethiopia',
            html: `
                <p>Dear <strong>${fullName}</strong>,</p>
                <p>Welcome to AgroChain Ethiopia! Please use the following OTP to verify your account and get started:</p>
                <div style="background: #f4f4f4; padding: 25px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981; border: 1px dashed #10b981; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">This OTP will expire in 5 minutes for your security.</p>
            `,
          });
        } catch (emailErr) {
          const maskedEmail = email.replace(/^(..)(.*)(@.*)$/, "$1***$3");
          console.error(`Registration OTP email failed for ${maskedEmail}:`, emailErr.message);
        }
      })();

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

// -------------------- Resend OTP (Registration) --------------------
router.post(
  '/resend-otp',
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
      const pending = pendingUsers.get(email);

      if (!pending) {
        return res.status(400).json({
          success: false,
          error: 'No pending registration found for this email. Please register again.'
        });
      }

      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpires = Date.now() + 5 * 60 * 1000;

      // Update pending user with new OTP
      pending.otp = otpHash;
      pending.otpExpires = otpExpires;
      pendingUsers.set(email, pending);

      // 📧 BACKGROUND PROCESS: Send email asynchronously
      (async () => {
        try {
          await transporter.sendMail({
            to: email,
            subject: 'Your New OTP Code - Agrochain Ethiopia',
            html: `
                <p>Dear <strong>${pending.fullName}</strong>,</p>
                <p>You requested a new OTP code for your AgroChain Ethiopia registration. Please use the code below to complete your verification:</p>
                <div style="background: #f4f4f4; padding: 25px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981; border: 1px dashed #10b981; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">This OTP will expire in 5 minutes.</p>
            `,
          });
        } catch (emailErr) {
          const maskedEmail = email.replace(/^(..)(.*)(@.*)$/, "$1***$3");
          console.error(`Resend OTP email failed for ${maskedEmail}:`, emailErr.message);
        }
      })();

      res.status(200).json({
        success: true,
        message: 'A new OTP has been sent to your email.',
      });
    } catch (err) {
      console.error('Error resending OTP:', err);
      res.status(500).json({ success: false, error: 'Server error resending OTP' });
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
        { userId: newUser.userId, fullName: newUser.fullName, isAdmin: newUser.isAdmin },
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

      // 📧 BACKGROUND PROCESS
      (async () => {
        try {
          await transporter.sendMail({
            to: email,
            subject: 'Password Reset OTP - Agrochain Ethiopia',
            html: `
                <p>Dear <strong>${user.fullName}</strong>,</p>
                <p>We received a request to reset your password for your AgroChain account. Use the following OTP to proceed with the reset:</p>
                <div style="background: #fdf2f2; padding: 25px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #dc2626; border: 1px dashed #dc2626; margin: 20px 0;">
                  ${otp}
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">This OTP will expire in 5 minutes. If you did not request this, please ignore this email or contact support.</p>
            `,
          });
        } catch (emailErr) {
          const maskedEmail = email.replace(/^(..)(.*)(@.*)$/, "$1***$3");
          console.error(`Password reset OTP email failed for ${maskedEmail}:`, emailErr.message);
        }
      })();

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
        { userId: user.userId, fullName: user.fullName, isAdmin: user.isAdmin },
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
        { userId: user.userId, fullName: user.fullName, isAdmin: user.isAdmin },
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
    const allowedFields = ['fullName', 'phone', 'address', 'username', 'location'];
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
      console.error('Error uploading profile picture:', err.message);
      res
        .status(500)
        .json({
          success: false,
          error: 'Error uploading profile picture. Please check your file and try again.',
        });
    }
  }
);

// -------------------- Upload Government ID --------------------
// Request OTP for Government ID Verification
router.post('/request-verification-otp', auth, checkEmailCredentials, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // 📧 BACKGROUND PROCESS
    (async () => {
      try {
        await transporter.sendMail({
          to: user.email,
          subject: 'AgroChain - National ID Verification Code',
          html: `
                <p>Hello <strong>${user.fullName}</strong>,</p>
                <p>You are requesting to verify your National ID for your AgroChain Ethiopia account. Use the following 6-digit code to complete the identity verification process:</p>
                <div style="text-align: center; margin: 30px 0; background: #f4f7ff; padding: 25px; border-radius: 8px; border: 1px dashed #4B6BFB;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e293b;">${otp}</span>
                </div>
                <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. Please keep your National ID document ready for the next step.</p>
            `,
        });
      } catch (emailErr) {
        console.error('Error sending verification OTP email:', emailErr.message);
      }
    })();

    res.json({ success: true, message: 'Verification code sent to your email' });
  } catch (err) {
    console.error('Error requesting verification OTP:', err);
    res.status(500).json({ success: false, error: 'Failed to send verification code' });
  }
});

router.post(
  '/verify-id',
  auth,
  govIdUpload.fields([
    { name: 'govIdFront', maxCount: 1 },
    { name: 'govIdBack', maxCount: 1 },
    { name: 'govIdSelfie', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { nationalIdNumber, name, otpCode } = req.body;

      if (!req.files?.govIdFront || !req.files?.govIdBack || !req.files?.govIdSelfie) {
        console.error('❌ Missing required verification files');
        return res
          .status(400)
          .json({ success: false, error: 'All 3 images (Front, Back, Selfie) are required' });
      }

      const user = await User.findOne({ userId: req.user.userId });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      if (name) user.fullName = name;

      console.log(`👤 User [${req.user.userId.slice(0, 4)}***] multi-step verification submission.`);

      // --- Security Logic 1: National ID (Fayda) Formatting ---
      // Ethiopian Fayda ID is exactly 12 digits
      const isIdValid = nationalIdNumber && /^\d{12}$/.test(nationalIdNumber);

      // --- Security Logic 2: OTP Verification (DB Check) ---
      let isOtpValid = false;
      if (user.otp === otpCode && user.otpExpires && user.otpExpires > Date.now()) {
        isOtpValid = true;
        // Clear OTP after use
        user.otp = null;
        user.otpExpires = null;
      }

      // --- Security Logic 3: Face Match (AI Simulation) ---
      const isFaceMatch = true; // Simulating successful AI Face Match

      // Save files to User record
      user.govIdFront = req.files.govIdFront[0].path;
      user.govIdBack = req.files.govIdBack[0].path;
      user.govIdSelfie = req.files.govIdSelfie[0].path;
      user.nationalIdNumber = nationalIdNumber;

      // ALL VERIFICATIONS NOW REQUIRE ADMIN APPROVAL
      // Even if OTP is correct, we send to admin for manual review
      user.govIdStatus = 'pending';
      user.verified = false;
      console.log(`⏳ Verification submitted for admin review - User: ${user.fullName}, ID: ${nationalIdNumber}`);

      await user.save();

      res.json({
        success: true,
        message: 'Verification documents submitted successfully. Our team will review your identity within 24 hours.',
        govIdStatus: user.govIdStatus,
        verified: user.verified
      });
    } catch (err) {
      console.error('❌ Error uploading government ID:', err.message);

      // Provide more detailed error message
      let errorMessage = 'Server error uploading government ID';
      if (err.name === 'ValidationError') {
        errorMessage = 'Validation error: ' + Object.values(err.errors).map(e => e.message).join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }

      res
        .status(500)
        .json({
          success: false,
          error: errorMessage
        });
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