import Notification from '../models/Notification.js';
import AppError from '../utils/appError.js';

class NotificationService {
    async createNotification(userId, type, title, message, transactionId = null) {
        try {
            const notification = new Notification({
                userId,
                type,
                title,
                message,
                relatedTransactionId: transactionId,
            });
            await notification.save();
            return notification;
        } catch (error) {
            console.error('Failed to create background notification record:', error.message);
            return null;
        }
    }

    async getMyNotifications(userId) {
        return await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);
    }

    async markAsRead(notificationId, userId) {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            throw new AppError('Notification not found', 404);
        }

        return notification;
    }

    async markAllAsRead(userId) {
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        return { message: "All notifications marked as read successfully" };
    }

    async getUnreadCount(userId) {
        return await Notification.countDocuments({ userId, isRead: false });
    }
}

export default new NotificationService();
