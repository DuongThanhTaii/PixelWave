import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { getSubtitles } from 'youtube-captions-scraper';

export const createArtist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, bio, avatarUrl } = req.body;

    if (!name || !slug) {
      res.status(400).json({ success: false, message: 'Name and slug are required' });
      return;
    }

    const artist = await prisma.artist.create({
      data: {
        name,
        slug,
        bio,
        avatarUrl
      }
    });

    res.status(201).json({ success: true, data: artist });
  } catch (error: any) {
    console.error('createArtist error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create artist' });
  }
};

export const createFandom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, artistId, color, iconUrl } = req.body;

    if (!name || !slug || !color) {
      res.status(400).json({ success: false, message: 'Name, slug, and color are required' });
      return;
    }

    const fandom = await prisma.fandom.create({
      data: {
        name,
        slug,
        color,
        artistId: artistId || null,
        iconUrl
      }
    });

    res.status(201).json({ success: true, data: fandom });
  } catch (error: any) {
    console.error('createFandom error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create fandom' });
  }
};

export const createTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, artistId, source, durationMs, fandomId, coverArtUrl, albumId, youtubeVideoId, audioUrl, lyrics } = req.body;

    if (!title || !slug || !artistId || !source || durationMs === undefined) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    const track = await prisma.track.create({
      data: {
        title,
        slug,
        artistId,
        source,
        durationMs: parseInt(durationMs, 10),
        fandomId: fandomId || null,
        coverArtUrl: coverArtUrl || null,
        albumId: albumId || null,
        youtubeVideoId: youtubeVideoId || null,
        audioUrl: audioUrl || null,
        lyrics: lyrics || null
      }
    });

    res.status(201).json({ success: true, data: { ...track, playCount: track.playCount.toString() } });
  } catch (error: any) {
    console.error('createTrack error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create track' });
  }
};

export const updateTrackLyrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { lyrics } = req.body;

    if (!lyrics) {
      res.status(400).json({ success: false, message: 'Lyrics content required' });
      return;
    }

    const track = await prisma.track.update({
      where: { id },
      data: { lyrics }
    });

    res.status(200).json({ success: true, data: { ...track, playCount: track.playCount.toString() } });
  } catch (error: any) {
    console.error('updateTrackLyrics error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update lyrics' });
  }
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const { role } = req.body;

    if (!role) {
      res.status(400).json({ success: false, message: 'Role required' });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    res.status(200).json({ success: true, data: { id: user.id, username: user.username, role: user.role } });
  } catch (error: any) {
    console.error('updateRole error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update role' });
  }
};

export const createAlbum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, artistId, artworkUrl, releaseDate, genre } = req.body;
    if (!title || !slug || !artistId) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }
    const album = await prisma.album.create({
      data: { 
        title, 
        slug, 
        artistId, 
        artworkUrl: artworkUrl || null, 
        releaseDate: releaseDate ? new Date(releaseDate) : null, 
        genre: genre || null 
      }
    });
    res.status(201).json({ success: true, data: album });
  } catch (error: any) {
    console.error('createAlbum error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create album' });
  }
};

export const fetchYoutubeLyrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      res.status(400).json({ success: false, message: 'videoId is required' });
      return;
    }

    const captions = await getSubtitles({
      videoID: videoId,
      lang: 'vi' // Default to Vietnamese, if not available it throws, we can try fallback.
    }).catch(() => getSubtitles({ videoID: videoId, lang: 'en' })); // fallback to English

    if (!captions || captions.length === 0) {
      res.status(404).json({ success: false, message: 'No lyrics/captions found for this video' });
      return;
    }

    // Format as .lrc
    const lrcLines = captions.map((caption: any) => {
      const start = parseFloat(caption.start);
      const minutes = Math.floor(start / 60);
      const seconds = Math.floor(start % 60);
      const hundredths = Math.floor((start % 1) * 100);
      
      const mm = minutes.toString().padStart(2, '0');
      const ss = seconds.toString().padStart(2, '0');
      const xx = hundredths.toString().padStart(2, '0');
      
      return `[${mm}:${ss}.${xx}]${caption.text.replace(/\n/g, ' ')}`;
    });

    const lrcContent = lrcLines.join('\n');

    res.status(200).json({ success: true, data: lrcContent });
  } catch (error: any) {
    console.error('fetchYoutubeLyrics error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch youtube lyrics' });
  }
};
