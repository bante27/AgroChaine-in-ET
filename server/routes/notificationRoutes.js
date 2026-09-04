import express from 'express';
import {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
} from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { notificationIdSchema } from '../validation/notificationValidation.js';

const router = express.Router();

router.use(auth);

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:notificationId/read', validate(notificationIdSchema), markAsRead);

export default router;
