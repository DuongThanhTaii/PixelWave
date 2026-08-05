"use client";

import React from "react";
import { User, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type FriendStatus = "online" | "listening" | "offline";

export interface FriendData {
  id: string;
  username: string;
  fandomName: string;
  status: FriendStatus;
  currentTrack?: {
    name: string;
    artist: string;
  };
}

export function FriendCard({ friend }: { friend: FriendData }) {
  
  const statusColors = {
    online: "bg-[var(--color-pw-success)]",
    listening: "bg-[var(--color-pw-hot-pink)]",
    offline: "bg-gray-400"
  };

  return (
    <Link 
      href={`/profile/${friend.username}`}
      className="group block bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-all"
    >
      <div className="flex items-center gap-3">
        {/* Avatar with Status */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 bg-[var(--color-pw-surface-300)] border-2 border-black rounded-full flex items-center justify-center overflow-hidden">
            <User className="w-6 h-6 text-[var(--color-on-surface-variant)]" />
          </div>
          <div className={cn(
            "absolute bottom-0 right-0 w-4 h-4 border-2 border-black rounded-full",
            statusColors[friend.status]
          )} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-body font-bold text-lg leading-tight truncate group-hover:underline">
            {friend.username}
          </div>
          <div className="font-data text-xs text-[var(--color-pw-deep-purple)] uppercase truncate">
            {friend.fandomName}
          </div>
        </div>
      </div>

      {/* Rich Presence: Listening */}
      {friend.status === "listening" && friend.currentTrack && (
        <div className="mt-3 bg-black border-2 border-black rounded-lg p-2 flex items-center gap-2">
          <Music className="w-4 h-4 text-[var(--color-pw-hot-pink)] shrink-0 animate-bounce" />
          <div className="flex-1 min-w-0">
            <div className="font-retro text-[8px] text-[var(--color-pw-hot-pink)] uppercase tracking-widest truncate">
              {friend.currentTrack.name}
            </div>
            <div className="font-body text-xs text-gray-400 truncate">
              {friend.currentTrack.artist}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
