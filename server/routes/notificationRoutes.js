import express from 'express';
import auth from '../middleware/auth.js';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from '../controllers/notificationController.js';

const router = express.Router();

// Middleware security layer
router.use(auth);

// 1. STATIC PATHS (Express processes these explicitly first)
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead); // 🔥 FIXED: Safe from wildcard route intercept loops!
router.get('/', getMyNotifications);

// 2. DYNAMIC PATHS (Must live at the absolute bottom line)
router.patch('/:notificationId/read', markAsRead);

export default router;