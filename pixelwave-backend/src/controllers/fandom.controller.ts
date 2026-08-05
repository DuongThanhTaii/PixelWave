import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getFandoms = async (req: Request, res: Response): Promise<void> => {
  try {
    const fandoms = await prisma.fandom.findMany({
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

    const serialized = fandoms.map(f => ({
      ...f,
      totalPixels: f.totalPixels.toString(),
      totalStreams: f.totalStreams.toString()
    }));

    res.status(200).json({ success: true, data: serialized });
  } catch (error) {
    console.error('getFandoms error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getFandomBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;

    const fandom = await prisma.fandom.findUnique({
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
  } catch (error) {
    console.error('getFandomBySlug error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
