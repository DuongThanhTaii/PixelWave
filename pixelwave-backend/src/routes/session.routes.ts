import { Router } from 'express';
import { logSession, saveProgress, getResumePosition } from '../controllers/session.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Require authentication to log sessions
router.post('/log', authMiddleware, logSession);
router.post('/progress', authMiddleware, saveProgress);
router.get('/progress/:trackId', authMiddleware, getResumePosition);

export default router;
