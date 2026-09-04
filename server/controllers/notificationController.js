import notificationService from '../services/notificationService.js';
import catchAsync from '../utils/catchAsync.js';

export const createNotification = async (userId, type, title, message, transactionId = null) => {
    return await notificationService.createNotification(userId, type, title, message, transactionId);
};

export const getMyNotifications = catchAsync(async (req, res) => {
    const userId = req.user._id || req.user.id;
    const notifications = await notificationService.getMyNotifications(userId);
    res.json({ success: true, notifications });
});

export const markAsRead = catchAsync(async (req, res) => {
    const userId = req.user._id || req.user.id;
    const notification = await notificationService.markAsRead(req.params.notificationId, userId);
    res.json({ success: true, notification });
});

export const markAllAsRead = catchAsync(async (req, res) => {
    const userId = req.user._id || req.user.id;
    const result = await notificationService.markAllAsRead(userId);
    res.json({ success: true, ...result });
});

export const getUnreadCount = catchAsync(async (req, res) => {
    const userId = req.user._id || req.user.id;
    const count = await notificationService.getUnreadCount(userId);
    res.json({ success: true, count });
});
