import adminService from '../services/adminService.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllUsers = catchAsync(async (req, res) => {
    const users = await adminService.getAllUsers();
    res.json({ success: true, users });
});

export const toggleRestriction = catchAsync(async (req, res) => {
    const result = await adminService.toggleRestriction(req.params.userId);
    res.json({ success: true, ...result });
});

export const liftRestriction = catchAsync(async (req, res) => {
    const result = await adminService.liftRestriction(req.params.userId);
    res.json({ success: true, ...result });
});

export const toggleAdminStatus = catchAsync(async (req, res) => {
    const result = await adminService.toggleAdminStatus(req.params.userId);
    res.json({ success: true, ...result });
});

export const getPendingVerifications = catchAsync(async (req, res) => {
    const pending = await adminService.getPendingVerifications();
    res.json({ success: true, pending });
});

export const verifyUserId = catchAsync(async (req, res) => {
    const result = await adminService.verifyUserId(req.params.userId, req.body.status);
    res.json({ success: true, ...result });
});

export const deleteUser = catchAsync(async (req, res) => {
    const result = await adminService.deleteUser(req.params.userId);
    res.json({ success: true, ...result });
});

export const getAllProducts = catchAsync(async (req, res) => {
    const products = await adminService.getAllProducts();
    res.json({ success: true, products });
});

export const deleteProduct = catchAsync(async (req, res) => {
    const result = await adminService.deleteProduct(req.params.productId);
    res.json({ success: true, ...result });
});

export const getAllTransactionsForAdmin = catchAsync(async (req, res) => {
    const result = await adminService.getAllTransactionsForAdmin();
    res.status(200).json({ success: true, ...result });
});

export const getMessages = catchAsync(async (req, res) => {
    const messages = await adminService.getMessages();
    res.json({ success: true, messages });
});

export const replyToMessage = catchAsync(async (req, res) => {
    const result = await adminService.replyToMessage(req.params.messageId, req.body.reply);
    res.json({ success: true, ...result });
});

export const getPlatformFees = catchAsync(async (req, res) => {
    const result = await adminService.getPlatformFees();
    res.json({ success: true, ...result });
});
