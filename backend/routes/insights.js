import { Router } from 'express';
import { getInsights } from '../controllers/insightController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/insights', requireAuth, getInsights);

export default router;
