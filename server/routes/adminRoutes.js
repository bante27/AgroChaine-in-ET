import express from 'express';
import {
    getAllUsers,
    toggleRestriction,
    liftRestriction,
    toggleAdminStatus,
    getPendingVerifications,
    verifyUserId,
    deleteUser,
    getAllProducts,
    deleteProduct,
    getAllTransactionsForAdmin,
    getMessages,
    replyToMessage,
    getPlatformFees
} from '../controllers/adminController.js';

import auth from '../middleware/auth.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import validate from '../middleware/validate.js';
import { verifyUserIdSchema, replyToMessageSchema } from '../validation/adminValidation.js';

const router = express.Router();

router.use(auth, adminMiddleware);

router.get('/users', getAllUsers);
router.put('/users/:userId/restrict', toggleRestriction);
router.put('/users/:userId/lift-restriction', liftRestriction);
router.put('/users/:userId/toggle-admin', toggleAdminStatus);
router.delete('/users/:userId', deleteUser);

router.get('/verifications/pending', getPendingVerifications);
router.put('/verifications/:userId', validate(verifyUserIdSchema), verifyUserId);

router.get('/products', getAllProducts);
router.delete('/products/:productId', deleteProduct);

router.get('/transactions', getAllTransactionsForAdmin);

router.get('/messages', getMessages);
router.post('/messages/:messageId/reply', validate(replyToMessageSchema), replyToMessage);

router.get('/fees/total', getPlatformFees);

export default router;
