"use client";

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { parseSRT, SrtLine } from '@/utils/srtParser';

export default function TracksAdmin() {
  const [status, setStatus] = useState('');
  const [isFetchingLyrics, setIsFetchingLyrics] = useState(false);
  const [showLyricsPreview, setShowLyricsPreview] = useState(false);

  const [uploadMode, setUploadMode] = useState<'manual' | 'youtube' | null>(null);
  const [youtubeInput, setYoutubeInput] = useState('');
  const [isFetchingYoutubeInfo, setIsFetchingYoutubeInfo] = useState(false);

  const [trackData, setTrackData] = useState({
    title: '', slug: '', artistId: '', albumId: '', fandomId: '', youtubeVideoId: '', lyrics: '', durationMs: 0
  });
  const [trackAudioFile, setTrackAudioFile] = useState<File | null>(null);
  const [trackCoverFile, setTrackCoverFile] = useState<File | null>(null);
  const [trackCoverUrl, setTrackCoverUrl] = useState('');
  
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<{value: string, label: string}[]>([]);
  const [albums, setAlbums] = useState<{value: string, label: string}[]>([]);
  const [fandoms, setFandoms] = useState<{value: string, label: string}[]>([]);

  const loadData = async () => {
    try {
      const [tracksData, artistsData, albumsData, fandomsData] = await Promise.all([
        fetchApi('/admin/tracks'),
        fetchApi('/admin/artists'),
        fetchApi('/admin/albums'),
        fetchApi('/admin/fandoms')
      ]) as any[];
      if (tracksData) setTracks(tracksData);
      if (artistsData) setArtists(artistsData.map((a: any) => ({ value: a.id, label: a.name })));
      if (albumsData) setAlbums(albumsData.map((a: any) => ({ value: a.id, label: a.title })));
      if (fandomsData) setFandoms(fandomsData.map((a: any) => ({ value: a.id, label: a.name })));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const fetchYoutubeInfo = async () => {
    if (!youtubeInput) {
      setStatus('Please enter a YouTube Video URL or ID.');
      return;
    }
    
    // Extract ID
    let videoId = youtubeInput;
    if (youtubeInput.includes('v=')) {
      videoId = youtubeInput.split('v=')[1].split('&')[0];
    } else if (youtubeInput.includes('youtu.be/')) {
      videoId = youtubeInput.split('youtu.be/')[1].split('?')[0];
    }
    
    setIsFetchingYoutubeInfo(true);
    setStatus('Fetching YouTube info...');
    try {
      // Using noembed to avoid direct CORS block on some environments, or fallback to manual
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
      const data = await res.json();
      
      if (data.error) {
        setStatus(`Error fetching info: ${data.error}`);
      } else {
        setTrackData(prev => ({ 
          ...prev, 
          title: data.title, 
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          youtubeVideoId: videoId 
        }));
        setTrackCoverUrl(data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
        setStatus('YouTube info fetched successfully!');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('Failed to fetch info, but you can still proceed manually.');
      setTrackData(prev => ({ ...prev, youtubeVideoId: videoId }));
      setTrackCoverUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    } finally {
      setIsFetchingYoutubeInfo(false);
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
      const data: any = await fetchApi('/admin/tracks/youtube-lyrics', {
        method: 'POST',
        body: JSON.stringify({ videoId: trackData.youtubeVideoId })
      });
      if (data) {
        setTrackData({ ...trackData, lyrics: data });
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
      loadData();
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-2xl font-bold uppercase">Create Track</h2>
          {uploadMode && (
            <button onClick={() => setUploadMode(null)} className="text-sm underline font-bold">Change Mode</button>
          )}
        </div>

        {!uploadMode && (
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button onClick={() => setUploadMode('manual')} className="flex-1 border-4 border-black p-6 bg-[var(--color-pw-vibrant-blue)] text-white hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all font-bold uppercase text-lg text-center">
              📁 Manual Upload
              <p className="text-xs font-normal mt-2 normal-case">Upload MP3/WAV files directly</p>
            </button>
            <button onClick={() => setUploadMode('youtube')} className="flex-1 border-4 border-black p-6 bg-[var(--color-pw-hot-pink)] text-white hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] transition-all font-bold uppercase text-lg text-center">
              ▶️ YouTube Link
              <p className="text-xs font-normal mt-2 normal-case">Stream via YouTube, auto-fetch info</p>
            </button>
          </div>
        )}

        {uploadMode === 'youtube' && !trackData.title && (
          <div className="flex flex-col gap-4 font-data text-sm mt-4">
            <div className="border-2 border-dashed border-black p-6 bg-gray-50 flex flex-col gap-3">
              <span className="font-bold text-lg">Enter YouTube Link</span>
              <input type="text" placeholder="https://www.youtube.com/watch?v=..." className="border-2 border-black p-3 outline-none focus:bg-white text-base" value={youtubeInput} onChange={e => setYoutubeInput(e.target.value)} />
              <button type="button" onClick={fetchYoutubeInfo} disabled={isFetchingYoutubeInfo} className="bg-[var(--color-pw-surface-100)] border-2 border-black px-6 py-2 font-bold shadow-[4px_4px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none self-start disabled:opacity-50 text-base">
                {isFetchingYoutubeInfo ? 'Fetching...' : 'Fetch Info & Proceed'}
              </button>
            </div>
          </div>
        )}

        {uploadMode && (uploadMode === 'manual' || (uploadMode === 'youtube' && trackData.title)) && (
          <form onSubmit={handleCreateTrack} className="flex flex-col gap-4 font-data text-sm mt-4">
            
            <div className="flex gap-4">
              {uploadMode === 'youtube' && trackCoverUrl && (
                <img src={trackCoverUrl} alt="Cover Preview" className="w-24 h-24 object-cover border-2 border-black shadow-[2px_2px_0_0_#000]" />
              )}
              <div className="flex-1 flex flex-col gap-4">
                <input type="text" placeholder="Title" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.title} onChange={e => setTrackData({...trackData, title: e.target.value})} />
                <input type="text" placeholder="Slug" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.slug} onChange={e => setTrackData({...trackData, slug: e.target.value})} />
              </div>
            </div>

            <div>
              <span className="font-bold block mb-1">Artist <span className="text-red-500">*</span></span>
              <SearchableSelect 
                options={artists}
                value={trackData.artistId}
                onChange={(val) => setTrackData({...trackData, artistId: val})}
                placeholder="Select Artist..."
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <span className="font-bold block mb-1">Album (Optional)</span>
                <SearchableSelect 
                  options={albums}
                  value={trackData.albumId}
                  onChange={(val) => setTrackData({...trackData, albumId: val})}
                  placeholder="Select Album..."
                />
              </div>
              <div className="flex-1">
                <span className="font-bold block mb-1">Fandom (Optional)</span>
                <SearchableSelect 
                  options={fandoms}
                  value={trackData.fandomId}
                  onChange={(val) => setTrackData({...trackData, fandomId: val})}
                  placeholder="Select Fandom..."
                />
              </div>
            </div>
            
            {uploadMode === 'manual' && (
              <div className="border-2 border-dashed border-black p-4 bg-gray-50 flex flex-col gap-2">
                <span className="font-bold">Audio Upload (.mp3 / .wav)</span>
                <input type="file" accept="audio/*" required className="file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-pw-vibrant-blue)] file:text-white file:cursor-pointer hover:file:opacity-90" onChange={e => setTrackAudioFile(e.target.files?.[0] || null)} />
              </div>
            )}

            <div className="border-2 border-dashed border-black p-4 bg-gray-50 flex flex-col gap-2">
              <span className="font-bold">Cover Art</span>
              {uploadMode === 'manual' && (
                <input type="text" placeholder="Cover Art URL (Optional)" className="border-2 border-black p-2 outline-none focus:bg-white mb-2" value={trackCoverUrl} onChange={e => setTrackCoverUrl(e.target.value)} />
              )}
              <span className="text-xs text-gray-500">{uploadMode === 'youtube' ? 'Override Auto-fetched Cover File (Optional)' : 'Upload Cover File (Optional)'}</span>
              <input type="file" accept="image/*" className="file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-[var(--color-pw-neon-lime)] file:text-black file:cursor-pointer hover:file:opacity-90" onChange={e => setTrackCoverFile(e.target.files?.[0] || null)} />
            </div>

            <input type="number" placeholder="Duration (ms)" required className="border-2 border-black p-2 outline-none focus:bg-gray-100" value={trackData.durationMs || ''} onChange={e => setTrackData({...trackData, durationMs: parseInt(e.target.value) || 0})} />
            
            <div className="border-2 border-dashed border-black p-4 bg-gray-50 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-bold">Lyrics (.srt format)</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowLyricsPreview(!showLyricsPreview)} className="bg-white border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                    {showLyricsPreview ? 'Hide Preview' : 'Preview Lyrics'}
                  </button>
                  {uploadMode === 'youtube' && (
                    <button type="button" onClick={handleFetchYoutubeLyrics} disabled={isFetchingLyrics} className="bg-gray-200 border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none disabled:opacity-50">
                      {isFetchingLyrics ? 'Fetching...' : 'Fetch from YouTube'}
                    </button>
                  )}
                  <label className="bg-[var(--color-pw-vibrant-blue)] text-white border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0_0_#000] cursor-pointer active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                    Upload .srt File
                    <input type="file" accept=".srt,.txt" className="hidden" onChange={handleLrcFileUpload} />
                  </label>
                </div>
              </div>
              <textarea placeholder="1&#10;00:00:28,606 --> 00:00:34,706&#10;thôi, cứ như vậy đi, đã đến lúc dừng lại..." rows={6} className="border-2 border-black p-2 outline-none focus:bg-gray-100 w-full font-mono text-xs" value={trackData.lyrics} onChange={e => setTrackData({...trackData, lyrics: e.target.value})} />
              
              {showLyricsPreview && (
                <div className="mt-2 border-2 border-black bg-white shadow-[4px_4px_0_0_#000] p-4 max-h-64 overflow-y-auto">
                  <h4 className="font-bold text-lg mb-2 uppercase border-b-2 border-black pb-2">Lyrics Preview</h4>
                  {trackData.lyrics ? (
                    <div className="flex flex-col gap-2">
                      {parseSRT(trackData.lyrics).map((line: SrtLine, i: number) => (
                        <div key={i} className="flex gap-4 border-b border-gray-200 pb-1 last:border-b-0">
                          <div className="text-gray-500 font-mono text-[10px] w-24 shrink-0 mt-0.5 flex flex-col">
                            <span>{new Date(line.startTime).toISOString().substr(11, 12)}</span>
                            <span>{new Date(line.endTime).toISOString().substr(11, 12)}</span>
                          </div>
                          <div className="font-bold text-sm leading-tight">{line.text}</div>
                        </div>
                      ))}
                      {parseSRT(trackData.lyrics).length === 0 && (
                        <p className="text-red-500 font-bold">Invalid SRT format or no lyrics found.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 font-bold italic">No lyrics provided yet.</p>
                  )}
                </div>
              )}
            </div>
            
            <button type="submit" className="bg-[var(--color-pw-hot-pink)] text-white border-2 border-black p-3 font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none mt-2 text-lg">Submit Track</button>
          </form>
        )}
      </section>

      <section className="mt-8 border-2 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0_0_#000]">
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">Existing Tracks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-data text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-pw-neon-lime)] border-b-2 border-black">
                <th className="p-2 border-r-2 border-black">Cover</th>
                <th className="p-2 border-r-2 border-black">Title</th>
                <th className="p-2 border-r-2 border-black">Artist</th>
                <th className="p-2 border-r-2 border-black">Album</th>
                <th className="p-2 border-r-2 border-black">Source</th>
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {tracks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">No tracks found.</td>
                </tr>
              ) : (
                tracks.map((track: any) => (
                  <tr key={track.id} className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="p-2 border-r border-gray-300">
                      {track.coverArtUrl ? <img src={track.coverArtUrl} alt={track.title} className="w-10 h-10 object-cover border-2 border-black rounded" /> : '-'}
                    </td>
                    <td className="p-2 border-r border-gray-300 font-bold">{track.title}</td>
                    <td className="p-2 border-r border-gray-300">{track.artist?.name || 'Unknown'}</td>
                    <td className="p-2 border-r border-gray-300">{track.album?.title || '-'}</td>
                    <td className="p-2 border-r border-gray-300 uppercase text-xs">{track.source}</td>
                    <td className="p-2">{new Date(track.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
