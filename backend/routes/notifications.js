import { Router } from 'express';
import { listNotifications, markRead, markAllRead } from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/notifications', requireAuth, listNotifications);
router.patch('/notifications/:id/read', requireAuth, markRead);
router.post('/notifications/read-all', requireAuth, markAllRead);

export default router;
