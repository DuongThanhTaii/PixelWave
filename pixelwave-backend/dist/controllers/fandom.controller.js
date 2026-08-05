"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFandomBySlug = exports.getFandoms = void 0;
const prisma_1 = require("../lib/prisma");
const getFandoms = async (req, res) => {
    try {
        const fandoms = await prisma_1.prisma.fandom.findMany({
            orderBy: { memberCount: 'desc' },
            take: 50,
            select: {
                id: true,
                name: true,
                slug: true,
                iconUrl: true,
                color: true,
                memberCount: true,
                totalPixels: true,
                totalStreams: true
            }
        });
        const serialized = fandoms.map((f) => ({
            ...f,
            totalPixels: f.totalPixels.toString(),
            totalStreams: f.totalStreams.toString()
        }));
        res.status(200).json({ success: true, data: serialized });
    }
    catch (error) {
        console.error('getFandoms error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getFandoms = getFandoms;
const getFandomBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const fandom = await prisma_1.prisma.fandom.findUnique({
            where: { slug },
            include: {
                artist: true,
                territories: true
            }
        });
        if (!fandom) {
            res.status(404).json({ success: false, message: 'Fandom not found' });
            return;
        }
        const serialized = {
            ...fandom,
            totalPixels: fandom.totalPixels.toString(),
            totalStreams: fandom.totalStreams.toString(),
            artist: fandom.artist ? {
                ...fandom.artist,
                totalStreams: fandom.artist.totalStreams.toString(),
                totalPlays: fandom.artist.totalPlays.toString()
            } : null
        };
        res.status(200).json({ success: true, data: serialized });
    }
    catch (error) {
        console.error('getFandomBySlug error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getFandomBySlug = getFandomBySlug;
