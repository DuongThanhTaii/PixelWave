"use client";

import React from "react";
import { Crosshair, Award, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityType = "canvas" | "achievement" | "levelup";

export interface ActivityData {
  id: string;
  type: ActivityType;
  username: string;
  time: string;
  content: React.ReactNode;
}

export function ActivityFeedItem({ activity }: { activity: ActivityData }) {
  
  const iconMap = {
    canvas: { Icon: Crosshair, color: "var(--color-pw-cyan-glow)" },
    achievement: { Icon: Award, color: "var(--color-pw-neon-lime)" },
    levelup: { Icon: Zap, color: "var(--color-pw-hot-pink)" }
  };

  const { Icon, color } = iconMap[activity.type];

  return (
    <div className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-4 flex gap-4 hover:-translate-y-1 hover:shadow-brutal transition-all">
      
      {/* Icon */}
      <div className="w-12 h-12 bg-black border-2 border-black rounded-xl flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
        <Icon className="w-6 h-6" style={{ color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-[var(--color-on-surface-variant)]" />
          <span className="font-body font-bold text-lg text-black hover:underline cursor-pointer">
            {activity.username}
          </span>
          <span className="font-data text-xs text-[var(--color-on-surface-variant)] ml-auto">
            {activity.time}
          </span>
        </div>
        <div className="font-body text-sm text-[var(--color-on-surface-variant)]">
          {activity.content}
        </div>
      </div>

    </div>
  );
}
