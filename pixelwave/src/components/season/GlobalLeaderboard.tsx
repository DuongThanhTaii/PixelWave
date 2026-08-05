"use client";

import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_FANDOMS = [
  { rank: 1, name: "Neon Syndicate", territory: 58430, color: "var(--color-pw-cyan-glow)", id: "fandom-02" },
  { rank: 2, name: "Pixel Pirates", territory: 42100, color: "var(--color-pw-hot-pink)", id: "fandom-03" },
  { rank: 3, name: "Void Walkers", territory: 38950, color: "var(--color-pw-deep-purple)", id: "fandom-04" },
  { rank: 4, name: "Chrome Hearts", territory: 25000, color: "var(--color-pw-neon-lime)", id: "fandom-05" },
  { rank: 5, name: "Glitch Mob", territory: 18200, color: "#FF8E53", id: "fandom-06" },
  { rank: 6, name: "Synthwave Surfers", territory: 12050, color: "#3B82F6", id: "fandom-07" },
  { rank: 7, name: "Data Miners", territory: 9500, color: "#10B981", id: "fandom-08" },
];

export function GlobalLeaderboard() {
  return (
    <div className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-6 shadow-brutal flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl uppercase tracking-wide flex items-center gap-2">
          Global Rankings
        </h2>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-2">
        {MOCK_FANDOMS.map((fandom, idx) => {
          const isTop3 = fandom.rank <= 3;
          
          return (
            <Link 
              key={fandom.id} 
              href={`/fandom/${fandom.id}`}
              className={cn(
                "group border-2 border-black rounded-xl p-3 flex items-center gap-4 transition-all hover:-translate-y-1",
                isTop3 ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]" : "bg-[var(--color-pw-surface-200)] hover:shadow-brutal text-black"
              )}
            >
              <div className={cn(
                "w-8 font-retro text-[14px] text-center",
                isTop3 ? "text-[var(--color-pw-cyan-glow)]" : "text-[var(--color-on-surface-variant)]"
              )}>
                #{fandom.rank}
              </div>
              
              <div 
                className="w-10 h-10 border-2 border-black rounded-lg flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] bg-white"
              >
                <Shield className="w-5 h-5" style={{ color: fandom.color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <span className="font-body font-bold text-lg group-hover:underline truncate block">
                  {fandom.name}
                </span>
              </div>
              
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="font-data text-xl leading-none">
                  {fandom.territory.toLocaleString()}
                </span>
                <span className={cn(
                  "font-retro text-[8px] uppercase tracking-widest leading-none",
                  isTop3 ? "text-gray-400" : "text-[var(--color-on-surface-variant)]"
                )}>
                  PX Claimed
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
