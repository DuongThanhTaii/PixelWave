import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, limit = '20' } = req.query;

    const tracks = await prisma.track.findMany({
      where: search ? {
        title: { contains: search as string, mode: 'insensitive' }
      } : undefined,
      take: parseInt(limit as string, 10),
      orderBy: { playCount: 'desc' },
      include: {
        artist: {
          select: { name: true, slug: true, avatarUrl: true }
        }
      }
    });

    const serialized = tracks.map((t: any) => ({
      ...t,
      playCount: t.playCount.toString()
    }));

    res.status(200).json({ success: true, data: serialized });
  } catch (error) {
    console.error('getTracks error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getTrackById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const track = await prisma.track.findUnique({
      where: { id },
      include: {
        artist: {
          select: { name: true, slug: true, avatarUrl: true }
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

    res.status(200).json({ success: true, data: serialized });
  } catch (error) {
    console.error('getTrackById error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
