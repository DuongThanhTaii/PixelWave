"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicTrackById = exports.getPublicArtistById = exports.getPublicAlbumById = exports.globalSearch = exports.getPublicArtists = exports.getPublicAlbums = void 0;
const prisma_1 = require("../lib/prisma");
const getPublicAlbums = async (req, res) => {
    try {
        const albums = await prisma_1.prisma.album.findMany({
            include: {
                artist: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        res.json({ success: true, data: albums });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getPublicAlbums = getPublicAlbums;
const getPublicArtists = async (req, res) => {
    try {
        const artists = await prisma_1.prisma.artist.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        res.json({ success: true, data: artists });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getPublicArtists = getPublicArtists;
const globalSearch = async (req, res) => {
    try {
        const q = req.query.q || '';
        if (!q) {
            return res.json({ success: true, data: { tracks: [], albums: [], artists: [] } });
        }
        const [tracks, albums, artists] = await Promise.all([
            prisma_1.prisma.track.findMany({
                where: { title: { contains: q, mode: 'insensitive' } },
                include: { artist: true },
                take: 10
            }),
            prisma_1.prisma.album.findMany({
                where: { title: { contains: q, mode: 'insensitive' } },
                include: { artist: true },
                take: 10
            }),
            prisma_1.prisma.artist.findMany({
                where: { name: { contains: q, mode: 'insensitive' } },
                take: 10
            })
        ]);
        res.json({
            success: true,
            data: { tracks, albums, artists }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.globalSearch = globalSearch;
const getPublicAlbumById = async (req, res) => {
    try {
        const { id } = req.params;
        const album = await prisma_1.prisma.album.findUnique({
            where: { id },
            include: {
                artist: true,
                tracks: {
                    orderBy: { trackNumber: 'asc' }
                }
            }
        });
        if (!album) {
            res.status(404).json({ success: false, message: 'Album not found' });
            return;
        }
        const serialized = {
            ...album,
            tracks: album.tracks.map((t) => ({
                ...t,
                playCount: t.playCount.toString()
            }))
        };
        res.json({ success: true, data: serialized });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getPublicAlbumById = getPublicAlbumById;
const getPublicArtistById = async (req, res) => {
    try {
        const { id } = req.params;
        const artist = await prisma_1.prisma.artist.findUnique({
            where: { id },
            include: {
                albums: {
                    orderBy: { releaseDate: 'desc' }
                },
                tracks: {
                    orderBy: { playCount: 'desc' },
                    take: 10
                }
            }
        });
        if (!artist) {
            res.status(404).json({ success: false, message: 'Artist not found' });
            return;
        }
        // Convert bigints for JSON serialization
        const serialized = {
            ...artist,
            totalStreams: artist.totalStreams.toString(),
            totalPlays: artist.totalPlays.toString(),
            tracks: artist.tracks.map((t) => ({
                ...t,
                playCount: t.playCount.toString()
            }))
        };
        res.json({ success: true, data: serialized });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getPublicArtistById = getPublicArtistById;
const getPublicTrackById = async (req, res) => {
    try {
        const { id } = req.params;
        const track = await prisma_1.prisma.track.findUnique({
            where: { id },
            include: {
                artist: {
                    select: { id: true, name: true, slug: true, avatarUrl: true }
                },
                album: {
                    select: { id: true, title: true, artworkUrl: true }
                }
            }
        });
        if (!track) {
            res.status(404).json({ success: false, message: 'Track not found' });
            return;
        }
        const serialized = {
            ...track,
            playCount: track.playCount.toString()
        };
        res.json({ success: true, data: serialized });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getPublicTrackById = getPublicTrackById;
