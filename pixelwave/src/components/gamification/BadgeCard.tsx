"use client";

import React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeRarity = "common" | "epic" | "legendary";

interface BadgeCardProps {
  id: string;
  name: string;
  icon: string; // Emoji or image URL for now
  rarity: BadgeRarity;
  isLocked: boolean;
}

export function BadgeCard({ name, icon, rarity, isLocked }: BadgeCardProps) {
  
  // Base classes for the container
  const baseClasses = "relative w-full aspect-square rounded-xl border-2 flex items-center justify-center text-4xl overflow-hidden transition-all duration-300";
  
  // Rarity styling
  let rarityClasses = "bg-[var(--color-pw-surface-200)] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000]";
  let innerClasses = "";

  if (isLocked) {
    rarityClasses = "bg-[var(--color-pw-surface-200)] border-black/20 opacity-40 grayscale pointer-events-none";
  } else if (rarity === "epic") {
    // Pulsing glow
    rarityClasses = "bg-black border-[var(--color-pw-hot-pink)] shadow-[0_0_15px_var(--color-pw-hot-pink)] hover:scale-105";
    innerClasses = "animate-pulse";
  } else if (rarity === "legendary") {
    // Animated rainbow/gradient border (mocked via background animation)
    rarityClasses = "border-transparent bg-clip-padding relative hover:scale-105 shadow-brutal";
  }

  return (
    <div className="group relative flex flex-col items-center gap-2 cursor-pointer">
      <div className={cn(baseClasses, rarityClasses)}>
        
        {/* Legendary specific background */}
        {!isLocked && rarity === "legendary" && (
          <div className="absolute inset-[-4px] z-0 rounded-xl bg-[linear-gradient(45deg,#FF6B9D,#00F0FF,#CCFF00,#FF6B9D)] bg-[length:400%_400%] animate-[gradient_3s_ease_infinite]" />
        )}
        
        {!isLocked && rarity === "legendary" && (
          <div className="absolute inset-0 m-1 bg-black rounded-lg z-10" />
        )}

        <div className={cn("z-20", innerClasses)}>
          {icon}
        </div>

        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
            <Lock className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      
      <span className={cn(
        "font-retro text-[10px] text-center w-full truncate",
        isLocked ? "text-[var(--color-on-surface-variant)]" : "text-black font-bold"
      )}>
        {name}
      </span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 bg-black text-white text-xs font-body py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[var(--color-pw-cyan-glow)]">
        {name} - {rarity.toUpperCase()}
      </div>
    </div>
  );
}
