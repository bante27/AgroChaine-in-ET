const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { parsePhoneNumber } = require('libphonenumber-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import necessary models and middleware
const User = require('../models/User'); // ✅ correct relative path
const authMiddleware = require('../middleware/authMiddleware'); // Correct file name

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Validation Middleware for Registration
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
        .matches(/^[a-zA-Z0-9.]+@gmail\.com$/)
        .withMessage('Please enter a valid Gmail address'),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
        .withMessage('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
    body('phone')
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
        .trim()
        .isLength({ min: 5, max: 100 })
        .matches(/^[a-zA-Z0-9\s,.-]{5,100}$/)
        .withMessage('Address must be 5-100 characters and contain valid characters'),
    body('agreeToTerms')
        .isBoolean()
        .equals('true')
        .withMessage('You must agree to the terms and conditions'),
];

// Validation Middleware for Login
const validateLogin = [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

// @route   POST /api/auth/register
// @desc    Register a new user and send a welcome email
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ success: false, error: errors.array()[0].msg });
        }

        const { fullName, email, password, phone, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ fullName, email, password: hashedPassword, phone, address });
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to AgroChain Ethiopia!',
            html: `<h2>Welcome, ${fullName}!</h2><p>Your account has been successfully created. Email: ${email}</p><p>Best regards,<br>AgroChain Ethiopia Team</p>`,
        };

        await transporter.sendMail(mailOptions);

        const token = jwt.sign({ userId: user._id, fullName: user.fullName }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, fullName, email, phone, address },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, error: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, fullName: user.fullName }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error during login' });
    }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error fetching profile' });
    }
});

module.exports = router;