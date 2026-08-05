"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const prisma_1 = require("../lib/prisma");
const getUserProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await prisma_1.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                waveLevel: true,
                totalPixelsEarned: true,
                longestStreak: true,
                activeFandom: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        color: true,
                        iconUrl: true
                    }
                },
                badges: {
                    select: {
                        progressCurrent: true,
                        progressTarget: true,
                        percentComplete: true,
                        unlockedAt: true,
                        badge: true
                    }
                },
                createdAt: true
            }
        });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        // Convert BigInt to string for JSON serialization
        const serializedUser = {
            ...user,
            totalPixelsEarned: user.totalPixelsEarned.toString(),
            badges: user.badges.map((b) => ({
                ...b,
                progressCurrent: b.progressCurrent.toString(),
                progressTarget: b.progressTarget.toString(),
                badge: {
                    ...b.badge,
                    conditionTarget: b.badge.conditionTarget.toString(),
                    conditionTimeWindowMs: b.badge.conditionTimeWindowMs?.toString()
                }
            }))
        };
        res.status(200).json({
            success: true,
            data: serializedUser
        });
    }
    catch (error) {
        console.error('GetUserProfile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getUserProfile = getUserProfile;
