import transactionService from '../services/transactionService.js';
import catchAsync from '../utils/catchAsync.js';

export const buyProduct = catchAsync(async (req, res) => {
    const transactions = await transactionService.buyProduct(req.body, req.user);
    res.json({ success: true, transactions });
});

export const markShipped = catchAsync(async (req, res) => {
    const transaction = await transactionService.markShipped(req.params.transactionId, req.user);
    res.json({ success: true, transaction });
});

export const confirmDelivery = catchAsync(async (req, res) => {
    const transaction = await transactionService.confirmDelivery(req.params.transactionId, req.user);
    res.json({ success: true, transaction });
});

export const cancelOrder = catchAsync(async (req, res) => {
    const transaction = await transactionService.cancelOrder(req.params.transactionId, req.user);
    res.json({ success: true, transaction });
});

export const getMyTransactions = catchAsync(async (req, res) => {
    const transactions = await transactionService.getMyTransactions(req.user);
    res.json({ success: true, transactions });
});
