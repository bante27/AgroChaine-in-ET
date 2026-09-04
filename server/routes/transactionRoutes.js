import express from 'express';
import {
    buyProduct,
    markShipped,
    confirmDelivery,
    cancelOrder,
    getMyTransactions
} from '../controllers/transactionController.js';

import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { buyProductSchema, transactionIdParamSchema } from '../validation/transactionValidation.js';

const router = express.Router();

router.use(auth);

router.post('/buy', validate(buyProductSchema), buyProduct);
router.get('/', getMyTransactions);
router.put('/:transactionId/ship', validate(transactionIdParamSchema), markShipped);
router.put('/:transactionId/deliver', validate(transactionIdParamSchema), confirmDelivery);
router.put('/:transactionId/cancel', validate(transactionIdParamSchema), cancelOrder);

export default router;
