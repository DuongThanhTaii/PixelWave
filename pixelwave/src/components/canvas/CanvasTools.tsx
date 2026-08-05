"use client";

import React from "react";
import { MousePointer2, Shield, Bomb } from "lucide-react";
import { useCanvasStore } from "@/stores/canvasStore";
import { cn } from "@/lib/utils";

export function CanvasTools() {
  const { selectedTool, setTool } = useCanvasStore();

  const tools = [
    { id: "place", label: "Place Pixel", icon: MousePointer2, cost: 1 },
    { id: "shield", label: "Shield Area", icon: Shield, cost: 5 },
    { id: "bomb", label: "Mega Bomb", icon: Bomb, cost: 50 },
  ] as const;

  return (
    <div className="flex flex-col gap-2 p-4 bg-[var(--color-pw-surface-100)] border-b-2 border-black">
      <h3 className="font-retro text-[10px] text-[var(--color-pw-deep-purple)] mb-2">TOOLS</h3>
      
      <div className="grid grid-cols-3 gap-2">
        {tools.map((t) => {
          const isActive = selectedTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all shadow-[2px_2px_0px_0px_#000]",
                isActive 
                  ? "bg-[var(--color-pw-cyan-glow)] border-black translate-y-[2px] translate-x-[2px] shadow-none" 
                  : "bg-[var(--color-pw-surface-200)] border-black hover:bg-[var(--color-pw-surface-300)]"
              )}
            >
              <t.icon className={cn("w-5 h-5 mb-1", isActive ? "text-black" : "text-[var(--color-on-background)]")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("font-data text-[10px]", isActive ? "text-black" : "text-[var(--color-on-surface-variant)]")}>
                {t.cost}PX
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
