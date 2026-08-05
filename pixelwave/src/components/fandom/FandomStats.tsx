"use client";

import React from "react";
import { Users, Crosshair, Map, Trophy, Radio } from "lucide-react";

interface FandomStatsProps {
  members: number;
  pixels: number;
  territory: number;
  rank: number;
  online: number;
}

export function FandomStats({ members, pixels, territory, rank, online }: FandomStatsProps) {
  const stats = [
    { label: "Members", value: members.toLocaleString(), icon: Users, color: "var(--color-on-surface-variant)" },
    { label: "Pixels Placed", value: pixels.toLocaleString(), icon: Crosshair, color: "var(--color-pw-deep-purple)" },
    { label: "Territory Size", value: territory.toLocaleString(), icon: Map, color: "var(--color-pw-cyan-glow)" },
    { label: "Global Rank", value: `#${rank}`, icon: Trophy, color: "var(--color-pw-neon-lime)" },
    { label: "Online Now", value: online.toLocaleString(), icon: Radio, color: "var(--color-success)" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-4 shadow-brutal flex flex-col items-center justify-center">
          <stat.icon 
            className="w-5 h-5 mb-2"
            style={{ color: stat.color }}
          />
          <span className="font-data text-2xl font-bold text-black tracking-tight">{stat.value}</span>
          <span className="font-retro text-[9px] text-[var(--color-on-surface-variant)] uppercase tracking-wider mt-1 text-center">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
