const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Register function
const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, address, password, confirmPassword, agreeToTerms } = req.body;

    // 1) Check if passwords match
    if (password !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400));
    }

    // 2) Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return next(new AppError('User with this email or phone already exists', 400));
    }

    // 3) Create new user
    const newUser = await User.create({
      fullName,
      email,
      phone,
      address,
      password,
      agreeToTerms
    });

    // 4) Log the user in
    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

// Login function
const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // 4) If remember me is checked, extend token expiration
    if (rememberMe) {
      process.env.JWT_EXPIRES_IN = '30d';
    } else {
      process.env.JWT_EXPIRES_IN = '1d';
    }

    // 5) Send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Protect middleware
const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Export all functions at once
module.exports = {
  register,
  login,
  protect
};