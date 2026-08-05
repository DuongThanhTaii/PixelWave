import { Router } from 'express';
import { getFandoms, getFandomBySlug } from '../controllers/fandom.controller';

const router = Router();

router.get('/', getFandoms);
router.get('/:slug', getFandomBySlug);

export default router;
