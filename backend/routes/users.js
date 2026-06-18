import { Router } from 'express';
import { getProfile, getStats, syncGitHub, updateProfile } from '../controllers/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/users/profile', requireAuth, getProfile);
router.put('/users/profile', requireAuth, updateProfile);
router.get('/users/stats', requireAuth, getStats);
router.post('/users/sync', requireAuth, syncGitHub);

export default router;
