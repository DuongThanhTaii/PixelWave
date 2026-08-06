"use client";

import React from "react";
import { User, Settings, PenLine } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  fandomName: string;
  level: number;
  avatarUrl?: string;
}

export function ProfileHeader({ username, fandomName, level, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="relative w-full h-[200px] bg-gradient-chrome rounded-xl border-2 border-black shadow-brutal flex items-end p-6 mb-16">
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-pw-hot-pink)] opacity-20 blur-3xl rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      </div>

      {/* Avatar Container (Overlaps header) */}
      <div className="absolute -bottom-12 left-6 md:left-12 flex items-end gap-6 z-10">
        <div className="relative">
          {/* Avatar */}
          <div className="w-24 h-24 bg-[var(--color-pw-surface-300)] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] overflow-hidden relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-[var(--color-on-surface-variant)]" />
            )}
          </div>
          
          {/* Wave Level Badge */}
          <div className="absolute -bottom-2 -right-2 bg-black border-2 border-black rounded-pill px-3 py-1 shadow-[2px_2px_0px_0px_var(--color-pw-cyan-glow)] flex items-center justify-center">
            <span className="font-display font-bold text-[10px] text-[var(--color-pw-cyan-glow)] uppercase tracking-widest whitespace-nowrap">
              LVL {level}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-2">
          <h1 className="inline-block px-3 py-1 bg-white border-2 border-black text-3xl md:text-4xl font-display font-bold text-black uppercase tracking-tight leading-none shadow-[2px_2px_0_0_#000]">
            {username}
          </h1>
          <p className="font-body font-bold text-[var(--color-pw-deep-purple)] mt-1 drop-shadow-sm">
            {fandomName}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="w-10 h-10 bg-[var(--color-pw-surface-100)] border-2 border-black rounded-full flex items-center justify-center shadow-brutal hover:shadow-brutal-hover hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all">
          <PenLine className="w-4 h-4 text-black" />
        </button>
        <button className="w-10 h-10 bg-[var(--color-pw-surface-100)] border-2 border-black rounded-full flex items-center justify-center shadow-brutal hover:shadow-brutal-hover hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all">
          <Settings className="w-4 h-4 text-black" />
        </button>
      </div>

    </div>
  );
}
