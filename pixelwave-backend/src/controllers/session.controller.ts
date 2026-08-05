import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const logSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { trackId, percentListened, totalTimeMs } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!trackId || typeof percentListened !== 'number' || typeof totalTimeMs !== 'number') {
      res.status(400).json({ success: false, message: 'Invalid payload' });
      return;
    }

    // Verify track exists
    const track = await prisma.track.findUnique({
      where: { id: trackId },
      include: { fandom: true }
    });

    if (!track) {
      res.status(404).json({ success: false, message: 'Track not found' });
      return;
    }

    // Calculate rewards (e.g., 1 pixel per 10% listened, max 10 pixels. 50 XP per session).
    const pixelsEarned = Math.floor(Math.min(100, percentListened) / 10);
    const xpEarned = 50;

    // Secure database transaction to prevent race conditions and ensure data consistency
    await prisma.$transaction(async (tx: any) => {
      // 1. Create Listening Session
      await tx.listeningSession.create({
        data: {
          userId,
          trackId,
          percentListened,
          totalTimeMs,
          pixelsEarned,
          xpEarned,
          status: 'completed',
          endedAt: new Date()
        }
      });

      // 2. Grant User Rewards
      await tx.user.update({
        where: { id: userId },
        data: {
          pixelBalance: { increment: pixelsEarned },
          totalPixelsEarned: { increment: pixelsEarned },
          xp: { increment: xpEarned }
        }
      });

      // 3. Update Track & Fandom Stats
      await tx.track.update({
        where: { id: trackId },
        data: { playCount: { increment: 1 } }
      });

      if (track.fandomId) {
        await tx.fandom.update({
          where: { id: track.fandomId },
          data: { totalStreams: { increment: 1 } }
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        pixelsEarned,
        xpEarned,
        message: `Logged session. Earned ${pixelsEarned} pixels and ${xpEarned} XP!`
      }
    });
  } catch (error) {
    console.error('logSession error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const saveProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { trackId, positionMs } = req.body;

    if (!userId || !trackId) {
      res.status(400).json({ success: false, message: 'Missing userId or trackId' });
      return;
    }

    await prisma.playbackState.upsert({
      where: {
        userId_trackId: {
          userId,
          trackId
        }
      },
      update: {
        positionMs: Math.floor(positionMs)
      },
      create: {
        userId,
        trackId,
        positionMs: Math.floor(positionMs)
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('saveProgress error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getResumePosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const trackId = req.params.trackId as string;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const state = await prisma.playbackState.findUnique({
      where: {
        userId_trackId: {
          userId,
          trackId
        }
      }
    });

    res.status(200).json({ success: true, data: { positionMs: state?.positionMs || 0 } });
  } catch (error) {
    console.error('getResumePosition error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
