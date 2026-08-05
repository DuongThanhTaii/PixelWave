"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export function Preferences() {
  const [animations, setAnimations] = useState(true);
  const [sounds, setSounds] = useState(true);

  return (
    <div className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-6 shadow-brutal flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-2xl uppercase tracking-wide flex items-center gap-2 mb-2">
          Preferences
        </h2>
        <p className="font-body text-sm text-[var(--color-on-surface-variant)]">
          Customize your interface experience.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-md">
        
        {/* Toggle: Animations */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg bg-[var(--color-pw-surface-200)]">
          <div>
            <div className="font-body font-bold text-black">Enable Animations</div>
            <div className="font-data text-xs text-[var(--color-on-surface-variant)]">Disable for better performance or accessibility.</div>
          </div>
          <button 
            onClick={() => setAnimations(!animations)}
            className={cn(
              "w-12 h-6 rounded-full border-2 border-black relative transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]",
              animations ? "bg-[var(--color-pw-success)]" : "bg-gray-400"
            )}
          >
            <div className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 bg-white border border-black rounded-full transition-transform",
              animations ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        </div>

        {/* Toggle: Sound Effects */}
        <div className="flex items-center justify-between p-4 border-2 border-black rounded-lg bg-[var(--color-pw-surface-200)]">
          <div>
            <div className="font-body font-bold text-black">Enable Sound Effects</div>
            <div className="font-data text-xs text-[var(--color-on-surface-variant)]">Plays sounds on pixel placement and level up.</div>
          </div>
          <button 
            onClick={() => setSounds(!sounds)}
            className={cn(
              "w-12 h-6 rounded-full border-2 border-black relative transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]",
              sounds ? "bg-[var(--color-pw-success)]" : "bg-gray-400"
            )}
          >
            <div className={cn(
              "absolute top-0.5 left-0.5 w-4 h-4 bg-white border border-black rounded-full transition-transform",
              sounds ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        </div>

      </div>
    </div>
  );
}
