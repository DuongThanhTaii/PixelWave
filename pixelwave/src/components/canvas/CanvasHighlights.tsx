"use client";

import React from "react";
import Link from "next/link";
import { Maximize2 } from "lucide-react";

interface Highlight {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

interface CanvasHighlightsProps {
  highlights: Highlight[];
}

export function CanvasHighlights({ highlights }: CanvasHighlightsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl uppercase tracking-tight">Canvas Highlights</h2>
        <Link 
          href="/canvas"
          className="text-sm font-body font-bold text-[var(--color-pw-deep-purple)] hover:text-[var(--color-pw-hot-pink)] hover:underline flex items-center gap-1 transition-colors"
        >
          View Full Canvas <Maximize2 className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((highlight) => (
          <Link 
            href={`/canvas?x=${highlight.x}&y=${highlight.y}`} 
            key={highlight.id}
            className="group block w-full bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-3 shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300"
          >
            {/* Map Preview Placeholder */}
            <div className="w-full aspect-video bg-[var(--color-pw-surface-200)] border-2 border-black rounded-lg mb-3 relative overflow-hidden flex items-center justify-center">
              {/* Fake grid lines */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
                  backgroundSize: '10px 10px'
                }}
              />
              <div 
                className="w-12 h-12 rounded-sm border border-black shadow-[2px_2px_0px_0px_#000] z-10 animate-pulse"
                style={{ backgroundColor: highlight.color }}
              />
            </div>
            
            <div className="flex items-center justify-between px-1">
              <span className="font-body font-bold text-lg truncate pr-2">{highlight.name}</span>
              <span className="font-data text-sm text-[var(--color-on-surface-variant)] shrink-0">
                ({highlight.x}, {highlight.y})
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
