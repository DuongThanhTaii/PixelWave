"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { TrackCard } from "@/components/music/TrackCard";
import { BadgeCard, BadgeRarity } from "@/components/gamification/BadgeCard";

// Mock Data
const MOCK_BADGES = [
  { id: "1", name: "First Pixel", icon: "✨", rarity: "common" as BadgeRarity, isLocked: false },
  { id: "2", name: "Night Owl", icon: "🦉", rarity: "common" as BadgeRarity, isLocked: false },
  { id: "3", name: "Color Theory", icon: "🎨", rarity: "epic" as BadgeRarity, isLocked: false },
  { id: "4", name: "War Hero", icon: "⚔️", rarity: "legendary" as BadgeRarity, isLocked: false },
  { id: "5", name: "100 Day Streak", icon: "🔥", rarity: "legendary" as BadgeRarity, isLocked: true },
  { id: "6", name: "Fandom Founder", icon: "👑", rarity: "epic" as BadgeRarity, isLocked: true },
  { id: "7", name: "Top 1%", icon: "⭐", rarity: "legendary" as BadgeRarity, isLocked: true },
  { id: "8", name: "Bomb Squad", icon: "💣", rarity: "common" as BadgeRarity, isLocked: true },
];

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<"overview" | "canvas" | "badges" | "history">("badges");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "canvas", label: "Canvas Stats" },
    { id: "badges", label: "Badges" },
    { id: "history", label: "History" },
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
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="flex items-center justify-center h-full text-[var(--color-on-surface-variant)] font-body">
            Overview content coming soon...
          </div>
        )}
        
        {activeTab === "canvas" && (
          <div className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-2xl">Contribution Heatmap</h3>
            <div className="w-full h-[200px] bg-[var(--color-pw-surface-200)] border-2 border-black rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] flex items-center justify-center font-retro text-[var(--color-on-surface-variant)]">
              [ 64x64 Heatmap Render ]
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-2xl">Your Collection</h3>
              <select className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-lg px-4 py-2 font-body font-bold shadow-[2px_2px_0px_0px_#000] outline-none">
                <option>All Badges</option>
                <option>Unlocked</option>
                <option>Locked</option>
                <option>Legendary</option>
              </select>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
              {MOCK_BADGES.map(badge => (
                <BadgeCard key={badge.id} {...badge} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="flex items-center justify-center h-full text-[var(--color-on-surface-variant)] font-body">
            History content coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
