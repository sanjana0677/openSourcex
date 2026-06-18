import { Router } from 'express';
import { githubRedirect, githubCallback, getMe, logout, refreshToken } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/auth/github', githubRedirect);
router.get('/auth/callback', githubCallback);
router.get('/auth/me', requireAuth, getMe);
router.post('/auth/logout', requireAuth, logout);
router.post('/auth/refresh', refreshToken);

export default router;
