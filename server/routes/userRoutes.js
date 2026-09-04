
import express from 'express';
const router = express.Router();

import {
    registerUser,
    resendOtp,
    verifyOtp,
    loginUser,
    googleLogin,
    getProfile,
    updateProfile,
    uploadProfilePic,
    requestVerificationOtp,
    verifyId,
    addBalance,
    forgotPassword,
    resetPassword
} from '../controllers/userController.js';

import validate from '../middleware/validate.js';
import {
    registerSchema,
    resendOtpSchema,
    verifyOtpSchema,
    loginSchema,
    googleLoginSchema,
    updateProfileSchema,
    verifyIdSchema,
    addBalanceSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} from '../validation/userValidation.js';

import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Public Auth Routes with Comprehensive Validation
router.post('/register', validate(registerSchema), registerUser);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.post('/login', validate(loginSchema), loginUser);
router.post('/google-login', validate(googleLoginSchema), googleLogin);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// Protected User Profile & Action Routes with Validation
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validate(updateProfileSchema), updateProfile);
router.post('/profile-pic', auth, upload.single('image'), uploadProfilePic);
router.post('/request-verification-otp', auth, requestVerificationOtp);
router.post('/verify-id', auth, validate(verifyIdSchema), upload.fields([
    { name: 'govIdFront', maxCount: 1 },
    { name: 'govIdBack', maxCount: 1 },
    { name: 'govIdSelfie', maxCount: 1 }
]), verifyId);
router.post('/add-balance', auth, validate(addBalanceSchema), addBalance);

export default router;
