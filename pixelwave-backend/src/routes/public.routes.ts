import { Router } from 'express';
import { getPublicAlbums, getPublicArtists, globalSearch } from '../controllers/public.controller';

const router = Router();

router.get('/albums', getPublicAlbums as any);
router.get('/artists', getPublicArtists as any);
router.get('/search', globalSearch as any);

export default router;
