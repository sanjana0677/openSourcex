import { Router } from 'express';
import { listContributions } from '../controllers/contributionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/contributions', requireAuth, listContributions);

export default router;
