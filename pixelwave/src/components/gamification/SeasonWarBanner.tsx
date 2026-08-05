"use client";

import React, { useState, useEffect } from "react";
import { Flame, Target } from "lucide-react";

interface SeasonWarBannerProps {
  seasonName: string;
  endDate: Date;
  topFandoms: { name: string; score: number; color: string }[];
}

export function SeasonWarBanner({ seasonName, endDate, topFandoms }: SeasonWarBannerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("WAR ENDED");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="w-full bg-gradient-war rounded-xl border-2 border-black shadow-brutal overflow-hidden relative group">
      <div className="absolute inset-0 bg-black opacity-10 blur-xl pointer-events-none" />
      
      <div className="relative z-10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: War Info & Timer */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-white animate-pulse" />
            <h2 className="font-display font-bold text-white uppercase tracking-wider text-sm">Active Season War</h2>
          </div>
          <div className="text-3xl font-display font-bold text-white mb-2">{seasonName}</div>
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm border-2 border-black rounded-lg px-3 py-1.5 w-fit">
            <span className="font-data text-xl text-[var(--color-pw-neon-lime)]">{timeLeft || "00:00:00:00"}</span>
          </div>
        </div>

        {/* Right: Mini Leaderboard */}
        <div className="flex-1 max-w-md bg-[var(--color-pw-surface-100)] border-2 border-black rounded-lg p-3 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-3 px-1 border-b-2 border-black pb-2">
            <span className="font-retro text-[10px] text-[var(--color-pw-deep-purple)]">LEADERBOARD</span>
            <Target className="w-4 h-4 text-[var(--color-pw-deep-purple)]" />
          </div>
          
          <div className="space-y-2">
            {topFandoms.map((fandom, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm font-body">
                <div className="flex items-center gap-2">
                  <span className="font-data text-[var(--color-on-surface-variant)] w-4">{idx + 1}.</span>
                  <div className="w-3 h-3 rounded-full border border-black" style={{ backgroundColor: fandom.color }} />
                  <span className="font-bold truncate max-w-[120px]">{fandom.name}</span>
                </div>
                <span className="font-data text-[var(--color-pw-deep-purple)]">{fandom.score.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
