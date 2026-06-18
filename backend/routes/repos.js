import { Router } from 'express';
import { listRepos, getRepo } from '../controllers/repoController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/repos', requireAuth, listRepos);
router.get('/repos/:id', requireAuth, getRepo);

export default router;
