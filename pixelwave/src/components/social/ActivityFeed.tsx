"use client";

import React, { useState } from "react";
import { ActivityFeedItem, ActivityData } from "./ActivityFeedItem";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_ACTIVITIES: ActivityData[] = [
  {
    id: "1",
    type: "achievement",
    username: "SynthLord",
    time: "2m ago",
    content: <span>Unlocked the <strong className="text-[var(--color-pw-hot-pink)]">Legendary War Hero</strong> badge!</span>
  },
  {
    id: "2",
    type: "canvas",
    username: "NeonNinja",
    time: "15m ago",
    content: <span>Placed 500 pixels in <strong className="text-[var(--color-pw-cyan-glow)]">Sector 4</strong>.</span>
  },
  {
    id: "3",
    type: "levelup",
    username: "PixelPirate99",
    time: "1h ago",
    content: <span>Reached <strong className="text-[var(--color-pw-neon-lime)]">Wave Level 42</strong>!</span>
  },
  {
    id: "4",
    type: "canvas",
    username: "GlitchMaster",
    time: "2h ago",
    content: <span>Detonated a Mega Bomb in enemy territory.</span>
  },
];

export function ActivityFeed() {
  const [filter, setFilter] = useState<"global" | "friends">("friends");

  return (
    <div className="flex flex-col h-full">
      
      {/* Header / Tabs */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-3xl uppercase tracking-wide">
          Activity Feed
        </h2>
        
        <div className="flex bg-[var(--color-pw-surface-200)] border-2 border-black rounded-lg p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
          <button 
            onClick={() => setFilter("friends")}
            className={cn(
              "px-4 py-1 font-body font-bold text-sm rounded-md transition-colors",
              filter === "friends" ? "bg-black text-white" : "text-[var(--color-on-surface-variant)] hover:text-black"
            )}
          >
            Friends
          </button>
          <button 
            onClick={() => setFilter("global")}
            className={cn(
              "px-4 py-1 font-body font-bold text-sm rounded-md transition-colors",
              filter === "global" ? "bg-black text-white" : "text-[var(--color-on-surface-variant)] hover:text-black"
            )}
          >
            Global
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-2">
        {MOCK_ACTIVITIES.map(activity => (
          <ActivityFeedItem key={activity.id} activity={activity} />
        ))}
        {filter === "global" && (
          <div className="text-center font-body text-[var(--color-on-surface-variant)] mt-8">
            End of global feed.
          </div>
        )}
      </div>

    </div>
  );
}
