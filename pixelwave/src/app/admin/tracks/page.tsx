"use client";

import React, { useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function TracksAdmin() {
  const [status, setStatus] = useState('');
  const [isFetchingLyrics, setIsFetchingLyrics] = useState(false);

  const [trackData, setTrackData] = useState({
    title: '', slug: '', artistId: '', albumId: '', fandomId: '', youtubeVideoId: '', lyrics: '', durationMs: 0
  });
  const [trackAudioFile, setTrackAudioFile] = useState<File | null>(null);
  const [trackCoverFile, setTrackCoverFile] = useState<File | null>(null);
  const [trackCoverUrl, setTrackCoverUrl] = useState('');

  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('pixelwave_token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error(data.message || 'Upload failed');
  };

  const generateYoutubeCover = () => {
    if (trackData.youtubeVideoId) {
      setTrackCoverUrl(`https://img.youtube.com/vi/${trackData.youtubeVideoId}/maxresdefault.jpg`);
    }
  };

  const handleFetchYoutubeLyrics = async () => {
    if (!trackData.youtubeVideoId) {
      setStatus('Please enter a YouTube Video ID first.');
      return;
    }
    setIsFetchingLyrics(true);
    setStatus('Fetching lyrics from YouTube...');
    try {
      const res: any = await fetchApi('/admin/tracks/youtube-lyrics', {
        method: 'POST',
        body: JSON.stringify({ videoId: trackData.youtubeVideoId })
      });
      if (res.data) {
        setTrackData({ ...trackData, lyrics: res.data });
        setStatus('Lyrics fetched successfully!');
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`Failed to fetch lyrics: ${err.message}`);
    } finally {
      setIsFetchingLyrics(false);
    }
  };

  const handleLrcFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTrackData({ ...trackData, lyrics: text });
      setStatus('LRC file loaded successfully!');
    };
    reader.readAsText(file);
  };


  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creating track... Uploading files if any...');
    try {
      let audioUrl = '';
      if (trackAudioFile) {
        audioUrl = await handleUploadFile(trackAudioFile);
      }

      let finalCoverArtUrl = trackCoverUrl;
      if (trackCoverFile) {
        finalCoverArtUrl = await handleUploadFile(trackCoverFile);
      }

      const payload: any = {
        title: trackData.title,
        slug: trackData.slug,
        artistId: trackData.artistId,
        source: trackData.youtubeVideoId ? 'youtube' : 'upload',
        durationMs: Number(trackData.durationMs)
      };

      if (trackData.albumId) payload.albumId = trackData.albumId;
      if (trackData.fandomId) payload.fandomId = trackData.fandomId;
      if (trackData.youtubeVideoId) payload.youtubeVideoId = trackData.youtubeVideoId;
      if (trackData.lyrics) payload.lyrics = trackData.lyrics;
      if (audioUrl) payload.audioUrl = audioUrl;
      if (finalCoverArtUrl) payload.coverArtUrl = finalCoverArtUrl;

      await fetchApi('/admin/tracks', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setStatus('Track created successfully!');
      setTrackData({ title: '', slug: '', artistId: '', albumId: '', fandomId: '', youtubeVideoId: '', lyrics: '', durationMs: 0 });
      setTrackAudioFile(null);
      setTrackCoverFile(null);
      setTrackCoverUrl('');
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase mb-6">Manage Tracks 🎵</h1>
      {status && (
        <div className="mb-6 bg-yellow-200 border-2 border-black p-4 font-bold shadow-[4px_4px_0_0_#000]">
          {status}
        </div>
      )}

      <section className="border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000] max-w-2xl">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Create Track</h2>
        <form onSubmit={handleCreateTrack} className="flex flex-col gap-4 font-data text-sm">
          <input type="text" placeholder="Title" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.title} onChange={e => setTrackData({...trackData, title: e.target.value})} />
          <input type="text" placeholder="Slug" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.slug} onChange={e => setTrackData({...trackData, slug: e.target.value})} />
          <input type="text" placeholder="Artist ID (Required)" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.artistId} onChange={e => setTrackData({...trackData, artistId: e.target.value})} />
          <input type="text" placeholder="Album ID (Optional)" className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.albumId} onChange={e => setTrackData({...trackData, albumId: e.target.value})} />
          <input type="text" placeholder="Fandom ID (Optional)" className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.fandomId} onChange={e => setTrackData({...trackData, fandomId: e.target.value})} />
          
          <div className="border-2 border-dashed border-black p-4 bg-gray-50 flex flex-col gap-2">
            <span className="font-bold">Source: Audio Upload</span>
            <input type="file" accept="audio/mpeg" className="file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-pw-vibrant-blue)] file:text-white file:cursor-pointer hover:file:opacity-90" onChange={e => setTrackAudioFile(e.target.files?.[0] || null)} />
          </div>

          <div className="border-2 border-dashed border-black p-4 bg-gray-50 flex flex-col gap-2">
            <span className="font-bold">Source: YouTube</span>
            <input type="text" placeholder="YouTube Video ID (e.g. dQw4w9WgXcQ)" className="border-2 border-black p-2 outline-none focus:bg-white" value={trackData.youtubeVideoId} onChange={e => setTrackData({...trackData, youtubeVideoId: e.target.value})} />
            <button type="button" onClick={generateYoutubeCover} className="self-start bg-[var(--color-pw-surface-100)] border-2 border-black px-4 py-1 font-bold shadow-[2px_2px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">Generate Cover Art</button>
          </div>

          <div className="border-2 border-dashed border-black p-4 bg-gray-50 flex flex-col gap-2">
            <span className="font-bold">Cover Art</span>
            <input type="text" placeholder="Cover Art URL (Generated/Manual)" className="border-2 border-black p-2 outline-none focus:bg-white" value={trackCoverUrl} onChange={e => setTrackCoverUrl(e.target.value)} />
            <span className="text-xs text-gray-500">OR Upload Cover File</span>
            <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-pw-neon-lime)] file:text-black file:cursor-pointer hover:file:opacity-90" onChange={e => setTrackCoverFile(e.target.files?.[0] || null)} />
          </div>

          <input type="number" placeholder="Duration (ms)" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.durationMs || ''} onChange={e => setTrackData({...trackData, durationMs: parseInt(e.target.value) || 0})} />
          
          <div className="border-2 border-dashed border-black p-4 bg-gray-50 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">Lyrics (.lrc format)</span>
              <div className="flex gap-2">
                <button type="button" onClick={handleFetchYoutubeLyrics} disabled={isFetchingLyrics} className="bg-gray-200 border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none disabled:opacity-50">
                  {isFetchingLyrics ? 'Fetching...' : 'Fetch from YouTube'}
                </button>
                <label className="bg-[var(--color-pw-vibrant-blue)] text-white border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0_0_#000] cursor-pointer active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                  Upload .lrc File
                  <input type="file" accept=".lrc,.txt" className="hidden" onChange={handleLrcFileUpload} />
                </label>
              </div>
            </div>
            <textarea placeholder="[00:15.30] Example lyrics line..." rows={6} className="border-2 border-black p-2 outline-none focus:bg-gray-100 w-full font-mono text-xs" value={trackData.lyrics} onChange={e => setTrackData({...trackData, lyrics: e.target.value})} />
          </div>
          
          <button type="submit" className="bg-[var(--color-pw-hot-pink)] text-white border-2 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none mt-2 text-lg">Submit Track</button>
        </form>
      </section>
    </div>
  );
}
