"use client";

import React from "react";
import { User, Shield } from "lucide-react";

export function ProfileSettings() {
  return (
    <div className="bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-6 shadow-brutal flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-2xl uppercase tracking-wide flex items-center gap-2 mb-2">
          Profile Settings
        </h2>
        <p className="font-body text-sm text-[var(--color-on-surface-variant)]">
          Manage your public persona on the canvas.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-md">
        
        {/* Avatar */}
        <div>
          <label className="font-retro text-[10px] text-[var(--color-pw-deep-purple)] block mb-2">AVATAR</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[var(--color-pw-surface-300)] border-2 border-black rounded-full flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_#000]">
              <User className="w-8 h-8 text-[var(--color-on-surface-variant)]" />
            </div>
            <button className="bg-black text-white px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_var(--color-pw-cyan-glow)] font-body font-bold text-sm hover:-translate-y-0.5 transition-transform">
              Change Avatar
            </button>
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="font-retro text-[10px] text-[var(--color-pw-deep-purple)] block mb-2">USERNAME</label>
          <input 
            type="text" 
            defaultValue="PixelSurfer99"
            className="w-full bg-[var(--color-pw-surface-200)] border-2 border-black rounded-lg py-2 px-4 font-body font-bold outline-none focus:border-[var(--color-pw-hot-pink)] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_var(--color-pw-hot-pink)] transition-all"
          />
        </div>

        {/* Fandom Affiliation */}
        <div>
          <label className="font-retro text-[10px] text-[var(--color-pw-deep-purple)] block mb-2">FANDOM ALLIANCE</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-pw-cyan-glow)]" />
            <select className="w-full bg-[var(--color-pw-surface-200)] border-2 border-black rounded-lg py-2 pl-10 pr-4 font-body font-bold outline-none focus:border-[var(--color-pw-cyan-glow)] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_var(--color-pw-cyan-glow)] transition-all appearance-none">
              <option>Neon Syndicate</option>
              <option>Pixel Pirates</option>
              <option>Void Walkers</option>
            </select>
          </div>
          <p className="font-data text-xs text-[var(--color-pw-war-active)] mt-2">
            Warning: Changing your alliance during an active Season will reset your personal territory stats.
          </p>
        </div>

        <button className="w-full bg-[var(--color-pw-neon-lime)] text-black border-2 border-black py-3 rounded-lg font-display font-bold text-lg uppercase tracking-wide shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-all mt-4">
          Save Changes
        </button>
      </div>
    </div>
  );
}
