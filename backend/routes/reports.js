import { Router } from 'express';
import { generateReport, listReports, downloadReport } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/reports/generate', requireAuth, generateReport);
router.get('/reports', requireAuth, listReports);
router.get('/reports/:id/download', requireAuth, downloadReport);

export default router;
