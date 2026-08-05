import { Router } from 'express';
import { createArtist, createFandom, createTrack, updateTrackLyrics, updateRole, createAlbum, fetchYoutubeLyrics, getAdminStats, getArtists, getAlbums, getTracks, getFandoms } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Secure all admin routes
router.use(authMiddleware);

router.get('/stats', roleMiddleware([Role.ADMIN, Role.MODERATOR]), getAdminStats);
router.get('/artists', roleMiddleware([Role.ADMIN, Role.MODERATOR]), getArtists);
router.get('/albums', roleMiddleware([Role.ADMIN, Role.MODERATOR]), getAlbums);
router.get('/tracks', roleMiddleware([Role.ADMIN, Role.MODERATOR]), getTracks);
router.get('/fandoms', roleMiddleware([Role.ADMIN, Role.MODERATOR]), getFandoms);

router.post('/artists', roleMiddleware([Role.ADMIN, Role.MODERATOR]), createArtist);
router.post('/albums', roleMiddleware([Role.ADMIN, Role.MODERATOR]), createAlbum);
router.post('/fandoms', roleMiddleware([Role.ADMIN, Role.MODERATOR]), createFandom);
router.post('/tracks', roleMiddleware([Role.ADMIN, Role.MODERATOR], true), createTrack);
router.put('/tracks/:id/lyrics', roleMiddleware([Role.ADMIN, Role.MODERATOR], true), updateTrackLyrics);
router.post('/tracks/youtube-lyrics', roleMiddleware([Role.ADMIN, Role.MODERATOR]), fetchYoutubeLyrics);
router.put('/users/:userId/role', roleMiddleware([Role.ADMIN]), updateRole);

export default router;
