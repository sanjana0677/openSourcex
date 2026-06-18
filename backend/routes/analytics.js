import { Router } from 'express';
import { getHeatmap, getMonthly, getLanguages, getActivity, getStreaks } from '../controllers/analyticsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/analytics/heatmap', requireAuth, getHeatmap);
router.get('/analytics/monthly', requireAuth, getMonthly);
router.get('/analytics/languages', requireAuth, getLanguages);
router.get('/analytics/activity', requireAuth, getActivity);
router.get('/analytics/streaks', requireAuth, getStreaks);

export default router;
