"use client";
import React, { useEffect, useState } from "react";
import { HeroCarousel } from "@/components/music/HeroCarousel";
import { FandomCard } from "@/components/fandom/FandomCard";
import { SeasonWarBanner } from "@/components/gamification/SeasonWarBanner";
import { CanvasHighlights } from "@/components/canvas/CanvasHighlights";
import { TrackCard } from "@/components/music/TrackCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

const MOCK_HIGHLIGHTS = [
  { id: "h1", name: "The Great Duck", x: 420, y: 69, color: "#CCFF00" },
  { id: "h2", name: "Fandom-02 HQ", x: 128, y: 256, color: "#00F0FF" },
  { id: "h3", name: "Void Monster", x: 800, y: 900, color: "#FF0040" },
];

export default function DiscoverPage() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/tracks')
      .then((res: any) => setTracks(res))
      .catch(console.error);
    
    fetchApi('/public/albums')
      .then((res: any) => setAlbums(res))
      .catch(console.error);

    fetchApi('/public/artists')
      .then((res: any) => setArtists(res))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-10">
      
      <section>
        <HeroCarousel />
      </section>

      {/* Top Artists Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight">Top Artists</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
          {artists.map((artist) => (
            <div key={artist.id} className="min-w-fit">
              <ArtistCard
                id={artist.id}
                name={artist.name}
                avatarUrl={artist.avatarUrl}
              />
            </div>
          ))}
          {artists.length === 0 && (
            <p className="text-gray-500 font-bold">No artists found.</p>
          )}
        </div>
      </section>

      {/* Trending Albums Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight">Trending Albums</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              id={album.id}
              title={album.title}
              artist={album.artist?.name || 'Unknown'}
              coverArtUrl={album.artworkUrl}
            />
          ))}
          {albums.length === 0 && (
            <div className="col-span-full py-8 flex flex-col items-center justify-center text-gray-500 border-4 border-dashed border-gray-300 bg-white shadow-[4px_4px_0_0_#000]">
              <span className="font-display font-bold text-xl mb-2 text-black">No Albums Found</span>
            </div>
          )}
        </div>
      </section>

      <section className="pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight">Recommended For You</h2>
          <Link 
            href="#"
            className="text-sm font-body font-bold text-[var(--color-pw-deep-purple)] hover:text-[var(--color-pw-hot-pink)] hover:underline flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.isArray(tracks) && tracks.length > 0 ? tracks.map(track => (
            <TrackCard 
              key={track.id}
              id={track.id}
              title={track.title}
              artist={track.artist?.name || 'Unknown Artist'}
              pixels={track.playCount || 0}
              coverArtUrl={track.coverArtUrl}
            />
          )) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 border-4 border-dashed border-gray-300 bg-white shadow-[4px_4px_0_0_#000]">
              <span className="font-display font-bold text-xl mb-2 text-black">No Tracks Found</span>
              <span className="font-body text-sm font-bold">Go to the Admin Dashboard to upload some music! 🎵</span>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
