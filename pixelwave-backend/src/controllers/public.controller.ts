import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getPublicAlbums = async (req: Request, res: Response) => {
  try {
    const albums = await prisma.album.findMany({
      include: {
        artist: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.json({ success: true, data: albums });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPublicArtists = async (req: Request, res: Response) => {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.json({ success: true, data: artists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    if (!q) {
      return res.json({ success: true, data: { tracks: [], albums: [], artists: [] } });
    }

    const [tracks, albums, artists] = await Promise.all([
      prisma.track.findMany({
        where: { title: { contains: q, mode: 'insensitive' } },
        include: { artist: true },
        take: 10
      }),
      prisma.album.findMany({
        where: { title: { contains: q, mode: 'insensitive' } },
        include: { artist: true },
        take: 10
      }),
      prisma.artist.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: 10
      })
    ]);

    res.json({
      success: true,
      data: { tracks, albums, artists }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPublicAlbumById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const album: any = await prisma.album.findUnique({
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
      tracks: album.tracks.map((t: any) => ({
        ...t,
        playCount: t.playCount.toString()
      }))
    };

    res.json({ success: true, data: serialized });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPublicArtistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const artist: any = await prisma.artist.findUnique({
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
      tracks: artist.tracks.map((t: any) => ({
        ...t,
        playCount: t.playCount.toString()
      }))
    };

    res.json({ success: true, data: serialized });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
