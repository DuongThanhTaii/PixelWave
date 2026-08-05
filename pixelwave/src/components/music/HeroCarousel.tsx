"use client";

import React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroCarousel() {
  return (
    <div className="relative w-full h-[400px] bg-gradient-chrome rounded-xl border-2 border-black shadow-brutal overflow-hidden flex items-center p-8 md:p-12">
      {/* Abstract shapes / decorations */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-[var(--color-pw-cyan-glow)] opacity-20 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-10 left-20 w-48 h-48 bg-[var(--color-pw-hot-pink)] opacity-20 blur-3xl rounded-full mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full max-w-5xl mx-auto">
        {/* Floating Album Art Placeholder */}
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_#000] bg-[var(--color-pw-surface-200)] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
          <div className="w-1/2 h-1/2 bg-[var(--color-pw-surface-300)] rounded-full flex items-center justify-center border-2 border-black">
            <div className="w-1/4 h-1/4 bg-[var(--color-pw-hot-pink)] rounded-full border-2 border-black" />
          </div>
        </div>

        {/* Text & CTA */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-black text-[var(--color-pw-neon-lime)] border-2 border-black rounded-full font-retro text-[10px] mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
            NEW RELEASE
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-black uppercase tracking-tight mb-2 leading-none">
            HYPER<br className="hidden md:block"/>GLITCH 2.0
          </h1>
          <p className="text-lg md:text-xl font-body font-medium text-[var(--color-on-surface-variant)] mb-6">
            By <span className="text-[var(--color-pw-deep-purple)] underline decoration-2 underline-offset-4">Neon Syndicate</span>
          </p>
          
          <div className="flex items-center justify-center md:justify-start gap-4">
            <button className="flex items-center gap-2 bg-[var(--color-pw-hot-pink)] text-white px-6 py-3 border-2 border-black rounded-lg shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-brutal-active transition-all duration-300 font-body font-bold">
              <Play className="w-5 h-5 fill-current" />
              Listen Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
