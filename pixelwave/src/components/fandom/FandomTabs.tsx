"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Maximize2, User } from "lucide-react";

// Mock Data
const MOCK_LEADERBOARD = [
  { rank: 1, username: "PixelSurfer99", pixels: 14502, level: 42 },
  { rank: 2, username: "NeonNinja", pixels: 12040, level: 38 },
  { rank: 3, username: "SynthLord", pixels: 9850, level: 35 },
  { rank: 4, username: "CyberPunk_2077", pixels: 8400, level: 31 },
  { rank: 5, username: "GlitchMaster", pixels: 7200, level: 28 },
];

export function FandomTabs({ themeColor }: { themeColor: string }) {
  const [activeTab, setActiveTab] = useState<"territory" | "leaderboard" | "war" | "about">("leaderboard");

  const tabs = [
    { id: "territory", label: "Territory" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "war", label: "War History" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="w-full mt-10">
      {/* Tab Navigation */}
      <div className="flex border-b-2 border-black mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-4 font-display font-bold uppercase tracking-wide text-lg border-b-4 whitespace-nowrap transition-colors",
              activeTab === tab.id 
                ? "border-black text-black" 
                : "border-transparent text-[var(--color-on-surface-variant)] hover:text-black"
            )}
            style={activeTab === tab.id ? { borderColor: themeColor } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        
        {activeTab === "territory" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-2xl">Territory Overview</h3>
              <Link 
                href="/canvas"
                className="text-sm font-body font-bold hover:underline flex items-center gap-1 transition-colors"
                style={{ color: themeColor }}
              >
                View on Canvas <Maximize2 className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="w-full aspect-video bg-[var(--color-pw-surface-200)] border-2 border-black rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              <div 
                className="w-1/3 h-1/3 border-4 shadow-[0_0_20px_rgba(0,0,0,0.2)] animate-pulse"
                style={{ backgroundColor: themeColor, borderColor: "black" }}
              />
            </div>
            
            <div className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
              <h4 className="font-retro text-[10px] mb-2" style={{ color: themeColor }}>EXPANSION GOAL</h4>
              <div className="flex items-center justify-between font-body text-sm mb-1">
                <span>Current: 58,430 px</span>
                <span>Next Tier: 100,000 px</span>
              </div>
              <div className="w-full h-2 bg-[var(--color-pw-surface-300)] border border-black rounded-full overflow-hidden">
                <div className="h-full w-[58%]" style={{ backgroundColor: themeColor }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-2xl">Top Contributors</h3>
              <select className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-lg px-4 py-2 font-body font-bold shadow-[2px_2px_0px_0px_#000] outline-none">
                <option>All Time</option>
                <option>This Season</option>
                <option>This Week</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-3">
              {MOCK_LEADERBOARD.map((user, idx) => (
                <div key={user.username} className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-4 flex items-center gap-4 hover:-translate-y-1 hover:shadow-brutal transition-all">
                  <div className="w-8 font-retro text-[14px] text-[var(--color-on-surface-variant)] text-center">
                    #{user.rank}
                  </div>
                  
                  <div className="w-10 h-10 bg-[var(--color-pw-surface-200)] border-2 border-black rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    <User className="w-5 h-5 text-[var(--color-on-surface-variant)]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${user.username}`} className="font-body font-bold text-lg hover:underline truncate block">
                      {user.username}
                    </Link>
                    <span className="font-data text-xs text-[var(--color-pw-deep-purple)] uppercase">LVL {user.level}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:block w-3 h-3 border border-black" style={{ backgroundColor: themeColor }} />
                    <span className="font-data text-xl text-black">{user.pixels.toLocaleString()} PX</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "war" && (
          <div className="flex items-center justify-center h-full text-[var(--color-on-surface-variant)] font-body">
            War History content coming soon...
          </div>
        )}
        
        {activeTab === "about" && (
          <div className="flex items-center justify-center h-full text-[var(--color-on-surface-variant)] font-body">
            About content coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
