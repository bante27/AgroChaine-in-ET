import express from 'express';
import auth from '../middleware/auth.js';
import { isAdmin, isSuperAdmin } from '../middleware/roleCheck.js';
import * as adminController from '../controllers/adminController.js';
import { getAllTransactions } from "../controllers/transactionController.js";
const router = express.Router();

// --- General Admin Routes ---
router.get('/users', auth, adminController.getAllUsers);
router.get('/messages', auth, isAdmin, adminController.getMessages);
router.post('/messages/:messageId/reply', auth, isAdmin, adminController.replyToMessage);
router.get('/platform-fees', auth, isAdmin, adminController.getPlatformFees);
router.get('/verifications/pending', auth, isAdmin, adminController.getPendingVerifications);

// --- User Restriction ---
router.post('/users/:userId/restrict', auth, isAdmin, adminController.toggleRestriction);
router.post('/users/:userId/lift-restriction', auth, isAdmin, adminController.liftRestriction);

// --- Verification (FIXED: Now allowed for both Admin and SuperAdmin) ---
router.patch('/verify/:userId', auth, isAdmin, adminController.verifyUserId);
router.patch('/verify/:userId', auth, isSuperAdmin, adminController.verifyUserId);

// --- Super Admin Only (Strictly for SuperAdmin) ---
router.post('/make-admin/:userId', auth, isSuperAdmin, adminController.toggleAdminStatus);
router.delete('/users/:userId', auth, isSuperAdmin, adminController.deleteUser);
router.get('/products', auth, isAdmin, adminController.getAllProducts);
router.delete('/products/:productId', auth, isSuperAdmin, adminController.deleteProduct);
// Add this to your router if you want to manage the orders we just coded
router.get("/transactions", auth,  getAllTransactions);
export default router;