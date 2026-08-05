"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrackLyrics = exports.createTrack = exports.createFandom = exports.createArtist = void 0;
const prisma_1 = require("../lib/prisma");
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
        const { title, slug, artistId, source, durationMs, fandomId } = req.body;
        if (!title || !slug || !artistId || !source || !durationMs) {
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
                fandomId: fandomId || null
            }
        });
        // We don't have BigInt to string here, but track doesn't return BigInt fields normally except maybe playCount which is 0
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
