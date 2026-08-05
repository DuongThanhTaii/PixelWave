"use client";

import React from "react";
import Link from "next/link";
import { Users, Crosshair } from "lucide-react";

interface FandomCardProps {
  id: string;
  name: string;
  members: number;
  territorySize: number;
  color: string;
}

export function FandomCard({ id, name, members, territorySize, color }: FandomCardProps) {
  return (
    <div className="w-full bg-[var(--color-pw-surface-100)] border-2 border-black rounded-xl p-5 shadow-brutal flex flex-col h-full relative overflow-hidden group">
      {/* Background Accent */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 transition-transform group-hover:scale-125"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h2 className="font-display font-bold text-xl uppercase tracking-tight">Your Fandom</h2>
        <div 
          className="w-4 h-4 border-2 border-black rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6 relative z-10">
        <div className="text-3xl font-display font-bold mb-2">{name}</div>
        <div className="flex items-center gap-4 text-[var(--color-on-surface-variant)] text-sm font-body">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{members.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-4 h-4" />
            <span>{territorySize.toLocaleString()} px</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t-2 border-black relative z-10">
        <Link 
          href={`/fandom/${id}`}
          className="block w-full text-center py-2.5 bg-[var(--color-pw-surface-200)] border-2 border-black rounded-lg font-body font-bold shadow-[2px_2px_0px_0px_#000] hover:bg-[var(--color-pw-surface-300)] hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
        >
          View Headquarters
        </Link>
      </div>
    </div>
  );
}
