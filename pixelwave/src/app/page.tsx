"use client";
import React, { useEffect, useState } from "react";
import { HeroCarousel } from "@/components/music/HeroCarousel";
import { FandomCard } from "@/components/fandom/FandomCard";
import { SeasonWarBanner } from "@/components/gamification/SeasonWarBanner";
import { CanvasHighlights } from "@/components/canvas/CanvasHighlights";
import { TrackCard } from "@/components/music/TrackCard";
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
  const [fandoms, setFandoms] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/tracks')
      .then(res => setTracks(res.data))
      .catch(console.error);
    
    fetchApi('/fandoms')
      .then(res => setFandoms(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-10">
      
      <section>
        <HeroCarousel />
      </section>

      {/* Render top fandom if any exist */}
      {fandoms && fandoms.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fandoms.slice(0, 3).map((fandom) => (
             <FandomCard 
               key={fandom.id}
               id={fandom.id}
               name={fandom.name}
               members={fandom._count?.members || 0}
               territorySize={fandom.territorySize || 0}
               color={fandom.color || 'var(--color-pw-cyan-glow)'}
             />
          ))}
        </section>
      )}

      {/* 
        SeasonWarBanner and CanvasHighlights have been temporarily hidden 
        to remove mock data until their APIs are implemented in future phases.
      */}

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
