"use client";

import React from "react";

interface CoordinateDisplayProps {
  x: number;
  y: number;
}

export function CoordinateDisplay({ x, y }: CoordinateDisplayProps) {
  return (
    <div className="absolute bottom-6 left-6 z-50 pointer-events-none">
      <div className="bg-black/80 backdrop-blur-md border-2 border-black rounded-lg px-4 py-2 shadow-brutal flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--color-pw-neon-lime)] animate-pulse" />
        <span className="font-data text-white text-xl tracking-widest">
          ({x.toString().padStart(4, '0')}, {y.toString().padStart(4, '0')})
        </span>
      </div>
    </div>
  );
}
