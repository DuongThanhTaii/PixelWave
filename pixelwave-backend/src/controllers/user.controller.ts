import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getMeStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        pixelBalance: true,
        currentStreak: true,
        _count: {
          select: { badges: true }
        }
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Tracks listened to
    const listenedCount = await prisma.listeningSession.count({
      where: { userId }
    });

    // Total streams received (if artist)
    const tracks = await prisma.track.aggregate({
      where: { uploadedBy: userId },
      _sum: { playCount: true }
    });
    
    const receivedCount = tracks._sum.playCount ? Number(tracks._sum.playCount) : 0;

    res.status(200).json({
      success: true,
      data: {
        streamsListened: listenedCount,
        streamsReceived: receivedCount,
        pixels: user.pixelBalance,
        badges: user._count.badges,
        streak: user.currentStreak
      }
    });
  } catch (error) {
    console.error('getMeStats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMeBadges = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const badges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const serializedBadges = badges.map((b: any) => ({
      ...b,
      progressCurrent: b.progressCurrent.toString(),
      progressTarget: b.progressTarget.toString(),
      badge: {
        ...b.badge,
        conditionTarget: b.badge.conditionTarget.toString(),
        conditionTimeWindowMs: b.badge.conditionTimeWindowMs?.toString()
      }
    }));

    res.status(200).json({
      success: true,
      data: serializedBadges
    });
  } catch (error) {
    console.error('getMeBadges error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = req.params.username as string;

    const user = await prisma.user.findUnique({
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
      badges: user.badges.map((b: any) => ({
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
  } catch (error) {
    console.error('GetUserProfile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
