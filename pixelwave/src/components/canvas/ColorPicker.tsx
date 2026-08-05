"use client";

import React from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { cn } from "@/lib/utils";

const PALETTE = [
  "#000000", "#FFFFFF", "#FF6B9D", "#00F0FF",
  "#CCFF00", "#FF8E53", "#8B5CF6", "#3B82F6",
  "#10B981", "#F59E0B", "#EF4444", "#6B7280",
  "#9CA3AF", "#D1D5DB", "#F3F4F6", "#4B5563"
];

export function ColorPicker() {
  const { selectedColor, setColor } = useCanvasStore();

  return (
    <div className="p-4 bg-[var(--color-pw-surface-100)] border-b-2 border-black">
      <h3 className="font-retro text-[10px] text-[var(--color-pw-deep-purple)] mb-3">COLOR PALETTE</h3>
      
      <div className="grid grid-cols-4 gap-2">
        {PALETTE.map((color) => {
          const isActive = selectedColor === color;
          return (
            <button
              key={color}
              onClick={() => setColor(color)}
              className={cn(
                "w-full aspect-square rounded-sm border-2 transition-all",
                isActive 
                  ? "border-black scale-110 shadow-[2px_2px_0px_0px_#000] z-10" 
                  : "border-black/20 hover:border-black hover:scale-105"
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          );
        })}
      </div>
    </div>
  );
}
