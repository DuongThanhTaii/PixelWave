"use client";

import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";

// Mock Data
const INITIAL_EVENTS = [
  { id: 1, time: "2m ago", text: "Neon Syndicate captured Zone 51 from Pixel Pirates" },
  { id: 2, time: "5m ago", text: "Void Walkers deployed Mega Bomb at (120, 440)" },
  { id: 3, time: "12m ago", text: "PixelSurfer99 placed their 10,000th pixel" },
  { id: 4, time: "15m ago", text: "Glitch Mob formed a new alliance" },
  { id: 5, time: "22m ago", text: "Chrome Hearts lost 500px in sector 9" },
];

export function WarFeed() {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  // Fake live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => {
        const newEvent = {
          id: Date.now(),
          time: "Just now",
          text: `A fierce battle is happening at (${Math.floor(Math.random() * 1000)}, ${Math.floor(Math.random() * 1000)})!`
        };
        return [newEvent, ...prev].slice(0, 8); // Keep last 8
      });
    }, 15000); // New event every 15s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border-2 border-black rounded-xl p-4 shadow-brutal flex flex-col h-full text-white">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-gray-800">
        <Activity className="w-5 h-5 text-[var(--pw-war-active)] animate-pulse" />
        <h2 className="font-retro text-[10px] uppercase text-[var(--pw-war-active)] tracking-widest">
          LIVE WAR FEED
        </h2>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 relative">
        {events.map((ev, i) => (
          <div key={ev.id} className="flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="font-data text-xs text-[var(--color-pw-cyan-glow)] mb-1">
              [{ev.time}]
            </span>
            <span className="font-body text-sm leading-snug text-gray-300">
              {ev.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
