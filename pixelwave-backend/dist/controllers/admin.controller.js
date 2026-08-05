"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFandoms = exports.getTracks = exports.getAlbums = exports.getArtists = exports.getAdminStats = exports.fetchYoutubeLyrics = exports.createAlbum = exports.updateRole = exports.updateTrackLyrics = exports.createTrack = exports.createFandom = exports.createArtist = void 0;
const prisma_1 = require("../lib/prisma");
const youtube_captions_scraper_1 = require("youtube-captions-scraper");
const createArtist = async (req, res) => {
    try {
        const { name, slug, bio, avatarUrl } = req.body;
        if (!name || !slug) {
            res.status(400).json({ success: false, message: 'Name and slug are required' });
            return;
        }
        const artist = await prisma_1.prisma.artist.create({
            data: {
                name,
                slug,
                bio,
                avatarUrl
            }
        });
        res.status(201).json({ success: true, data: artist });
    }
    catch (error) {
        console.error('createArtist error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create artist' });
    }
};
exports.createArtist = createArtist;
const createFandom = async (req, res) => {
    try {
        const { name, slug, artistId, color, iconUrl } = req.body;
        if (!name || !slug || !color) {
            res.status(400).json({ success: false, message: 'Name, slug, and color are required' });
            return;
        }
        const fandom = await prisma_1.prisma.fandom.create({
            data: {
                name,
                slug,
                color,
                artistId: artistId || null,
                iconUrl
            }
        });
        res.status(201).json({ success: true, data: fandom });
    }
    catch (error) {
        console.error('createFandom error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create fandom' });
    }
};
exports.createFandom = createFandom;
const createTrack = async (req, res) => {
    try {
        const { title, slug, artistId, source, durationMs, fandomId, coverArtUrl, albumId, youtubeVideoId, audioUrl, lyrics } = req.body;
        if (!title || !slug || !artistId || !source || durationMs === undefined) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        const track = await prisma_1.prisma.track.create({
            data: {
                title,
                slug,
                artistId,
                source,
                durationMs: parseInt(durationMs, 10),
                fandomId: fandomId || null,
                coverArtUrl: coverArtUrl || null,
                albumId: albumId || null,
                youtubeVideoId: youtubeVideoId || null,
                audioUrl: audioUrl || null,
                lyrics: lyrics || null
            }
        });
        res.status(201).json({ success: true, data: { ...track, playCount: track.playCount.toString() } });
    }
    catch (error) {
        console.error('createTrack error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create track' });
    }
};
exports.createTrack = createTrack;
const updateTrackLyrics = async (req, res) => {
    try {
        const id = req.params.id;
        const { lyrics } = req.body;
        if (!lyrics) {
            res.status(400).json({ success: false, message: 'Lyrics content required' });
            return;
        }
        const track = await prisma_1.prisma.track.update({
            where: { id },
            data: { lyrics }
        });
        res.status(200).json({ success: true, data: { ...track, playCount: track.playCount.toString() } });
    }
    catch (error) {
        console.error('updateTrackLyrics error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to update lyrics' });
    }
};
exports.updateTrackLyrics = updateTrackLyrics;
const updateRole = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { role } = req.body;
        if (!role) {
            res.status(400).json({ success: false, message: 'Role required' });
            return;
        }
        const user = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { role }
        });
        res.status(200).json({ success: true, data: { id: user.id, username: user.username, role: user.role } });
    }
    catch (error) {
        console.error('updateRole error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to update role' });
    }
};
exports.updateRole = updateRole;
const createAlbum = async (req, res) => {
    try {
        const { title, slug, artistId, artworkUrl, releaseDate, genre } = req.body;
        if (!title || !slug || !artistId) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        const album = await prisma_1.prisma.album.create({
            data: {
                title,
                slug,
                artistId,
                artworkUrl: artworkUrl || null,
                releaseDate: releaseDate ? new Date(releaseDate) : null,
                genre: genre || null
            }
        });
        res.status(201).json({ success: true, data: album });
    }
    catch (error) {
        console.error('createAlbum error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create album' });
    }
};
exports.createAlbum = createAlbum;
const fetchYoutubeLyrics = async (req, res) => {
    try {
        const { videoId } = req.body;
        if (!videoId) {
            res.status(400).json({ success: false, message: 'videoId is required' });
            return;
        }
        const captions = await (0, youtube_captions_scraper_1.getSubtitles)({
            videoID: videoId,
            lang: 'vi' // Default to Vietnamese, if not available it throws, we can try fallback.
        }).catch(() => (0, youtube_captions_scraper_1.getSubtitles)({ videoID: videoId, lang: 'en' })); // fallback to English
        if (!captions || captions.length === 0) {
            res.status(404).json({ success: false, message: 'No lyrics/captions found for this video' });
            return;
        }
        // Format as .lrc
        const lrcLines = captions.map((caption) => {
            const start = parseFloat(caption.start);
            const minutes = Math.floor(start / 60);
            const seconds = Math.floor(start % 60);
            const hundredths = Math.floor((start % 1) * 100);
            const mm = minutes.toString().padStart(2, '0');
            const ss = seconds.toString().padStart(2, '0');
            const xx = hundredths.toString().padStart(2, '0');
            return `[${mm}:${ss}.${xx}]${caption.text.replace(/\n/g, ' ')}`;
        });
        const lrcContent = lrcLines.join('\n');
        res.status(200).json({ success: true, data: lrcContent });
    }
    catch (error) {
        console.error('fetchYoutubeLyrics error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch youtube lyrics' });
    }
};
exports.fetchYoutubeLyrics = fetchYoutubeLyrics;
const getAdminStats = async (req, res) => {
    try {
        const trackCount = await prisma_1.prisma.track.count();
        const artistCount = await prisma_1.prisma.artist.count();
        const fandomCount = await prisma_1.prisma.fandom.count();
        res.status(200).json({ success: true, data: { tracks: trackCount, artists: artistCount, fandoms: fandomCount } });
    }
    catch (error) {
        console.error('getAdminStats error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch admin stats' });
    }
};
exports.getAdminStats = getAdminStats;
const getArtists = async (req, res) => {
    try {
        const artists = await prisma_1.prisma.artist.findMany({ orderBy: { createdAt: 'desc' } });
        res.status(200).json({ success: true, data: artists });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch artists' });
    }
};
exports.getArtists = getArtists;
const getAlbums = async (req, res) => {
    try {
        const albums = await prisma_1.prisma.album.findMany({
            orderBy: { createdAt: 'desc' },
            include: { artist: { select: { name: true } } }
        });
        res.status(200).json({ success: true, data: albums });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch albums' });
    }
};
exports.getAlbums = getAlbums;
const getTracks = async (req, res) => {
    try {
        const tracks = await prisma_1.prisma.track.findMany({
            orderBy: { createdAt: 'desc' },
            include: { artist: { select: { name: true } }, album: { select: { title: true } } }
        });
        res.status(200).json({ success: true, data: tracks });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch tracks' });
    }
};
exports.getTracks = getTracks;
const getFandoms = async (req, res) => {
    try {
        const fandoms = await prisma_1.prisma.fandom.findMany({ orderBy: { createdAt: 'desc' } });
        res.status(200).json({ success: true, data: fandoms });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch fandoms' });
    }
};
exports.getFandoms = getFandoms;
