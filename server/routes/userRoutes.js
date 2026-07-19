import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import { profilePicUpload, govIdUpload } from '../middleware/upload.js';
import * as userCtrl from '../controllers/userController.js';
import { checkEmailCredentials, restrictUnverifiedUsers } from '../middleware/userMiddleware.js';
import { apiLimiter, loginLimiter } from '../middleware/rateLimiter.js';
import isNotRestricted from '../middleware/isNotRestricted.js';
const router = express.Router();

// --- Registration & Login ---
router.post('/register', apiLimiter, checkEmailCredentials, body('email').isEmail(), body('password').isLength({ min: 8 }), userCtrl.registerUser);
router.post('/resend-otp', apiLimiter, checkEmailCredentials, userCtrl.resendOtp);
router.post('/verify-otp', apiLimiter, userCtrl.verifyOtp);

// Use loginLimiter for smarter blocking on the login route
router.post('/login', loginLimiter, userCtrl.loginUser);

// --- Profile ---
router.get('/profile', auth, userCtrl.getProfile);
router.patch('/profile', auth, userCtrl.updateProfile);
router.post('/profile-pic', auth, profilePicUpload.single('profilePic'), userCtrl.uploadProfilePic);

// --- Verification ---
router.post('/request-verification-otp', auth, checkEmailCredentials, userCtrl.requestVerificationOtp);
router.post('/verify-id', auth, govIdUpload.fields([
    { name: 'govIdFront', maxCount: 1 },
    { name: 'govIdBack', maxCount: 1 },
    { name: 'govIdSelfie', maxCount: 1 }
]), userCtrl.verifyId);

// --- Wallet ---
router.post('/add-balance', auth, isNotRestricted, userCtrl.addBalance);
router.post("/google", userCtrl.googleLogin);
// --- Password Reset ---
router.post('/forgot-password', apiLimiter, userCtrl.forgotPassword); // Add this
router.post('/reset-password', apiLimiter, userCtrl.resetPassword);   // Add this
// routes/userRoutes.js
router.get("/profile-summary/:userId", auth, async (req, res) => {
    try {
        // Only select public info for safety
        const user = await User.findOne({ userId: req.params.userId })
                               .select("fullName profilePicture phoneNumber location");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;