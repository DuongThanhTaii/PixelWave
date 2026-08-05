"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTracks = void 0;
const prisma_1 = require("../lib/prisma");
const getTracks = async (req, res) => {
    try {
        const { search, limit = '20' } = req.query;
        const tracks = await prisma_1.prisma.track.findMany({
            where: search ? {
                title: { contains: search, mode: 'insensitive' }
            } : undefined,
            take: parseInt(limit, 10),
            orderBy: { playCount: 'desc' },
            include: {
                artist: {
                    select: { name: true, slug: true, avatarUrl: true }
                }
            }
        });
        const serialized = tracks.map(t => ({
            ...t,
            playCount: t.playCount.toString()
        }));
        res.status(200).json({ success: true, data: serialized });
    }
    catch (error) {
        console.error('getTracks error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getTracks = getTracks;
