"use client";

import React from "react";
import { Maximize } from "lucide-react";

export function Minimap() {
  return (
    <div className="p-4 bg-[var(--color-pw-surface-100)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-retro text-[10px] text-[var(--color-pw-deep-purple)]">MINIMAP</h3>
        <button className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-pw-hot-pink)] transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full aspect-square bg-[var(--color-pw-surface-200)] border-2 border-black rounded-lg overflow-hidden relative shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]">
        {/* Fake minimap noise/texture */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Fake viewport rect */}
        <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 border-2 border-white shadow-[0_0_0_999px_rgba(0,0,0,0.5)] z-10" />
      </div>
    </div>
  );
}
