"use client";

import React from "react";
import { FriendCard, FriendData } from "./FriendCard";
import { Search } from "lucide-react";

// Mock Data
const MOCK_FRIENDS: FriendData[] = [
  { id: "1", username: "SynthLord", fandomName: "Neon Syndicate", status: "listening", currentTrack: { name: "Midnight City", artist: "M83" } },
  { id: "2", username: "PixelPirate99", fandomName: "Pixel Pirates", status: "online" },
  { id: "3", username: "GlitchMaster", fandomName: "Glitch Mob", status: "offline" },
  { id: "4", username: "NeonNinja", fandomName: "Neon Syndicate", status: "listening", currentTrack: { name: "Resonance", artist: "HOME" } },
  { id: "5", username: "CyberPunk_2077", fandomName: "Chrome Hearts", status: "online" },
];

export function FriendList() {
  return (
    <div className="bg-[var(--color-pw-surface-200)] border-2 border-black rounded-xl p-4 shadow-brutal flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl uppercase tracking-wide">
          Friends (42)
        </h2>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input 
          type="text" 
          placeholder="Search friends..." 
          className="w-full bg-[var(--color-pw-surface-100)] border-2 border-black rounded-lg py-2 pl-10 pr-4 font-body text-sm outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-shadow"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-on-surface-variant)]" />
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-2">
        {MOCK_FRIENDS.map(friend => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
}
