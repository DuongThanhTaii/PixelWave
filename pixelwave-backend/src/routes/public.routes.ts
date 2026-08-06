import { Router } from 'express';
import { getPublicAlbums, getPublicArtists, globalSearch, getPublicAlbumById, getPublicArtistById } from '../controllers/public.controller';

const router = Router();

router.get('/albums', getPublicAlbums as any);
router.get('/albums/:id', getPublicAlbumById as any);
router.get('/artists', getPublicArtists as any);
router.get('/artists/:id', getPublicArtistById as any);
router.get('/search', globalSearch as any);

export default router;
