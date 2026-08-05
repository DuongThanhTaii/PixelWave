"use client";

import React from "react";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";

interface TrackCardProps {
  id: string;
  title: string;
  artist: string;
  pixels: number;
}

export function TrackCard({ id, title, artist, pixels }: TrackCardProps) {
  const { play } = usePlayerStore();

  return (
    <div className="group relative w-full bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-4 shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 flex flex-col">
      {/* Art Placeholder */}
      <div className="w-full aspect-square bg-[var(--color-pw-surface-200)] border-2 border-black rounded-lg mb-4 relative overflow-hidden">
        {/* Hover overlay with play button */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => play(id)}
            className="w-14 h-14 bg-[var(--color-pw-hot-pink)] border-2 border-black rounded-full flex items-center justify-center shadow-brutal hover:scale-110 transition-transform"
          >
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </button>
        </div>
      </div>
      
      {/* Track Info */}
      <div className="flex-1 flex flex-col min-w-0">
        <h3 className="font-display font-bold text-lg truncate text-black">{title}</h3>
        <p className="font-body text-sm text-[var(--color-on-surface-variant)] truncate hover:underline hover:text-[var(--color-pw-deep-purple)] cursor-pointer">
          {artist}
        </p>
      </div>

      {/* Pixel Reward */}
      <div className="mt-4 flex items-center gap-1.5">
        <div className="w-4 h-4 bg-[var(--color-pw-neon-lime)] border-[1.5px] border-black shadow-[2px_2px_0px_0px_#000]" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' }} />
        <span className="font-data text-[var(--color-pw-deep-purple)]">+{pixels} PX</span>
      </div>
    </div>
  );
}
