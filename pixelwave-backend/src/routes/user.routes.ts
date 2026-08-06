import { Router } from 'express';
import { getUserProfile, getMeStats, getMeBadges } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me/stats', authMiddleware, getMeStats);
router.get('/me/badges', authMiddleware, getMeBadges);

router.get('/:username', getUserProfile);

export default router;
