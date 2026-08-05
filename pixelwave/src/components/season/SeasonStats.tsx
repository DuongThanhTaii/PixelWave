"use client";

import React from "react";
import { Crosshair, ShieldAlert, Users, Swords } from "lucide-react";

interface SeasonStatsProps {
  totalPixels: number;
  activeFandoms: number;
  totalTerritories: number;
  battlesFought: number;
}

export function SeasonStats({ totalPixels, activeFandoms, totalTerritories, battlesFought }: SeasonStatsProps) {
  const stats = [
    { label: "Total Pixels", value: totalPixels.toLocaleString(), icon: Crosshair, color: "var(--color-pw-deep-purple)" },
    { label: "Active Alliances", value: activeFandoms.toLocaleString(), icon: Users, color: "var(--color-pw-cyan-glow)" },
    { label: "Territories Claimed", value: totalTerritories.toLocaleString(), icon: ShieldAlert, color: "var(--color-pw-neon-lime)" },
    { label: "Battles Fought", value: battlesFought.toLocaleString(), icon: Swords, color: "var(--color-pw-hot-pink)" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center">
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
