"use client";

import React from "react";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface FandomHeaderProps {
  name: string;
  themeColor: string;
}

export function FandomHeader({ name, themeColor }: FandomHeaderProps) {
  return (
    <div className="relative w-full h-[200px] rounded-xl border-2 border-black shadow-brutal flex items-end p-6 mb-16 overflow-hidden">
      
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `linear-gradient(135deg, ${themeColor} 0%, rgba(255,255,255,0.8) 100%)`
        }}
      />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden rounded-xl z-0">
        <div 
          className="absolute top-0 right-0 w-64 h-64 opacity-40 blur-3xl rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/4 pointer-events-none"
          style={{ backgroundColor: themeColor }}
        />
      </div>

      {/* Icon Container (Overlaps header) */}
      <div className="absolute -bottom-12 left-6 md:left-12 flex items-end gap-6 z-10">
        <div className="relative">
          <div className="w-24 h-24 bg-[var(--color-pw-surface-100)] border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            <Shield 
              className="w-12 h-12" 
              style={{ color: themeColor }}
            />
          </div>
        </div>

        {/* Fandom Info */}
        <div className="mb-2">
          <div className="inline-block px-3 py-1 bg-black border-2 border-black rounded-full font-retro text-[10px] mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]" style={{ color: themeColor }}>
            ALLIANCE HQ
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-black uppercase tracking-tight leading-none drop-shadow-md">
            {name}
          </h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button className="bg-black text-white px-6 py-2 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all font-body font-bold">
          Join Fandom
        </button>
      </div>

    </div>
  );
}
