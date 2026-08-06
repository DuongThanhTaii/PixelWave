"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { TrackCard } from "@/components/music/TrackCard";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";

export default function AlbumDetailPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { fetchAndPlayTrack } = usePlayerStore();

  useEffect(() => {
    if (id) {
      fetchApi(`/public/albums/${id}`)
        .then((res: any) => setAlbum(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold animate-pulse text-xl">
        Loading Album...
      </div>
    );
  }

  if (!album) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="font-display font-bold text-4xl mb-4">Album Not Found</h1>
        <p className="font-body text-gray-500 font-bold">This album might have been deleted or is unavailable.</p>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (album.tracks && album.tracks.length > 0) {
      // Just play the first track for now, ideally queue the rest
      fetchAndPlayTrack(album.tracks[0].id);
    }
  };

  return (
    <div className="w-full min-h-screen pb-24">
      {/* Header Section */}
      <div className="w-full bg-[var(--color-pw-surface-200)] border-b-4 border-black p-6 md:p-12 relative overflow-hidden">
        {/* Background Blur (optional) */}
        {album.artworkUrl && (
          <div 
            className="absolute inset-0 opacity-10 blur-3xl scale-110"
            style={{ backgroundImage: `url(${album.artworkUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
          />
        )}
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end relative z-10">
          <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 border-4 border-black shadow-[8px_8px_0_0_#000] bg-white overflow-hidden">
            {album.artworkUrl ? (
              <img src={album.artworkUrl} alt={album.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">No Cover</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold uppercase text-sm tracking-widest text-[var(--color-pw-vibrant-blue)]">Album</span>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-2">
              {album.title}
            </h1>
            <div className="flex items-center gap-2 font-body font-bold text-lg">
              <span className="text-[var(--color-pw-hot-pink)]">{album.artist?.name}</span>
              <span>•</span>
              <span>{new Date(album.createdAt).getFullYear()}</span>
              <span>•</span>
              <span>{album.tracks?.length || 0} tracks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <button 
          onClick={handlePlayAll}
          disabled={!album.tracks || album.tracks.length === 0}
          className="flex items-center gap-3 bg-[var(--color-pw-hot-pink)] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play fill="white" className="w-6 h-6" />
          Play All
        </button>
      </div>

      {/* Tracklist */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">Tracks</h2>
        {album.tracks && album.tracks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {album.tracks.map((track: any) => (
              <TrackCard 
                key={track.id}
                id={track.id}
                title={track.title}
                artist={album.artist?.name || 'Unknown'}
                pixels={track.playCount || 0}
                coverArtUrl={track.coverArtUrl || album.artworkUrl}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 border-4 border-dashed border-gray-300 text-center font-bold text-gray-500">
            No tracks in this album yet.
          </div>
        )}
      </div>
    </div>
  );
}
