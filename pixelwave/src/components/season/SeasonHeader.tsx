"use client";

import React from "react";
import { AlertTriangle, Clock } from "lucide-react";

interface SeasonHeaderProps {
  seasonName: string;
  timeLeft: string; // e.g. "14d 05h 22m"
}

export function SeasonHeader({ seasonName, timeLeft }: SeasonHeaderProps) {
  return (
    <div className="relative w-full h-[200px] bg-gradient-war rounded-xl border-2 border-black shadow-brutal flex items-end p-6 mb-8 overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden rounded-xl z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)'
          }}
        />
      </div>

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="bg-black text-[var(--pw-war-active)] px-3 py-1 border-2 border-black rounded-full font-retro text-[10px] flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
          <AlertTriangle className="w-3 h-3 animate-pulse" />
          WAR ACTIVE
        </div>
      </div>

      {/* Season Info */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-black uppercase tracking-tighter leading-none drop-shadow-md">
            {seasonName}
          </h1>
        </div>

        {/* Countdown */}
        <div className="bg-black/80 backdrop-blur-sm border-2 border-black rounded-lg p-3 flex flex-col items-end shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
          <span className="font-retro text-[8px] text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Time Remaining
          </span>
          <span className="font-data text-2xl text-white tracking-widest font-bold">
            {timeLeft}
          </span>
        </div>
      </div>

    </div>
  );
}
