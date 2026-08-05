"use client";

import React from "react";
import { Headphones, Crosshair, Award, Flame } from "lucide-react";

interface ProfileStatsProps {
  streams: number;
  pixels: number;
  badges: number;
  streak: number;
}

export function ProfileStats({ streams, pixels, badges, streak }: ProfileStatsProps) {
  const stats = [
    { label: "Streams", value: streams, icon: Headphones, color: "var(--color-pw-deep-purple)" },
    { label: "Pixels Placed", value: pixels, icon: Crosshair, color: "var(--color-pw-cyan-glow)" },
    { label: "Badges", value: badges, icon: Award, color: "var(--color-pw-neon-lime)" },
    { label: "Streak", value: streak, icon: Flame, color: "var(--color-pw-hot-pink)" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-4 shadow-brutal hover:-translate-y-1 transition-transform flex flex-col items-center justify-center">
          <stat.icon 
            className="w-6 h-6 mb-2"
            style={{ color: stat.color }}
          />
          <span className="font-data text-2xl font-bold text-black tracking-tight">{stat.value.toLocaleString()}</span>
          <span className="font-retro text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wider mt-1">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
