"use client";

import React from "react";
import { Music, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MusicIntegration() {
  return (
    <div className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-6 shadow-brutal flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-2xl uppercase tracking-wide flex items-center gap-2 mb-2">
          Music Integrations
        </h2>
        <p className="font-body text-sm text-[var(--color-on-surface-variant)]">
          Connect your streaming services to start earning pixels from listening.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Spotify - Connected */}
        <div className="border-2 border-black rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--color-pw-surface-200)] hover:shadow-brutal transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1DB954] border-2 border-black rounded-lg flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
              <Music className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-body font-bold text-lg leading-tight">Spotify</h3>
              <div className="flex items-center gap-1 text-[var(--color-pw-success)] font-data text-xs uppercase">
                <Check className="w-3 h-3" /> Connected
              </div>
            </div>
          </div>
          
          <button className="bg-[var(--color-pw-surface-300)] border-2 border-black px-4 py-2 rounded-lg font-body font-bold text-sm shadow-[2px_2px_0px_0px_#000] hover:bg-black hover:text-white transition-colors">
            Disconnect
          </button>
        </div>

        {/* Apple Music - Disconnected */}
        <div className="border-2 border-black rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--color-pw-surface-100)] hover:shadow-brutal transition-shadow opacity-70 hover:opacity-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FA243C] border-2 border-black rounded-lg flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-body font-bold text-lg leading-tight">Apple Music</h3>
              <div className="flex items-center gap-1 text-[var(--color-on-surface-variant)] font-data text-xs uppercase">
                <X className="w-3 h-3" /> Not Connected
              </div>
            </div>
          </div>
          
          <button className="bg-white border-2 border-black px-4 py-2 rounded-lg font-body font-bold text-sm shadow-[2px_2px_0px_0px_#000] hover:bg-[#FA243C] hover:text-white transition-colors">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
