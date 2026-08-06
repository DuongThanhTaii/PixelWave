"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { TrackCard } from "@/components/music/TrackCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";

export default function ArtistDetailPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { fetchAndPlayTrack } = usePlayerStore();

  useEffect(() => {
    if (id) {
      fetchApi(`/public/artists/${id}`)
        .then((res: any) => setArtist(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-bold animate-pulse text-xl">
        Loading Artist...
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="font-display font-bold text-4xl mb-4">Artist Not Found</h1>
        <p className="font-body text-gray-500 font-bold">This artist might have been deleted or is unavailable.</p>
      </div>
    );
  }

  const handlePlayTopTracks = () => {
    if (artist.tracks && artist.tracks.length > 0) {
      fetchAndPlayTrack(artist.tracks[0].id);
    }
  };

  return (
    <div className="w-full min-h-screen pb-24">
      {/* Header Section */}
      <div className="relative w-full h-[350px] md:h-[450px] bg-black overflow-hidden flex items-end justify-center md:justify-start">
        {artist.avatarUrl && (
          <div 
            className="absolute inset-0 opacity-40 blur-xl scale-110"
            style={{ backgroundImage: `url(${artist.avatarUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-pw-surface-100)] via-transparent to-transparent z-10" />
        
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 pb-8 relative z-20 flex flex-col items-center md:items-start gap-4">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-black shadow-[6px_6px_0_0_#000] bg-[var(--color-pw-neon-lime)] overflow-hidden">
            {artist.avatarUrl ? (
              <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-display font-black text-black">
                {artist.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
              {artist.name}
            </h1>
            <p className="font-body font-bold text-lg md:text-xl text-[var(--color-pw-neon-lime)] drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
              {Number(artist.totalPlays).toLocaleString()} Monthly Plays
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center gap-4">
        <button 
          onClick={handlePlayTopTracks}
          disabled={!artist.tracks || artist.tracks.length === 0}
          className="flex items-center gap-3 bg-[var(--color-pw-neon-lime)] text-black px-8 py-4 rounded-full font-black uppercase tracking-wider border-4 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play fill="black" className="w-6 h-6" />
          Play
        </button>
        <button className="px-6 py-4 rounded-full font-bold uppercase tracking-wider border-4 border-black hover:bg-black hover:text-white transition-colors">
          Follow
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 gap-12 mt-8">
        
        {/* Popular Tracks */}
        <section>
          <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Popular Tracks</h2>
          {artist.tracks && artist.tracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {artist.tracks.map((track: any) => (
                <TrackCard 
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={artist.name}
                  pixels={track.playCount || 0}
                  coverArtUrl={track.coverArtUrl}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 font-bold">No tracks available.</p>
          )}
        </section>

        {/* Albums */}
        {artist.albums && artist.albums.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-3xl uppercase tracking-tight mb-6">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {artist.albums.map((album: any) => (
                <AlbumCard
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  artist={artist.name}
                  coverArtUrl={album.artworkUrl}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
