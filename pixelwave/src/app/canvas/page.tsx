"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CanvasGrid } from "@/components/canvas/CanvasGrid";
import { CanvasTools } from "@/components/canvas/CanvasTools";
import { ColorPicker } from "@/components/canvas/ColorPicker";
import { Minimap } from "@/components/canvas/Minimap";
import { CoordinateDisplay } from "@/components/canvas/CoordinateDisplay";
import { Pixel } from "@/lib/canvasRenderer";
import { useCanvasStore } from "@/stores/canvasStore";
import { useUserStore } from "@/stores/userStore";

export default function CanvasPage() {
  const [hoverCoord, setHoverCoord] = useState({ x: 0, y: 0 });
  
  const { pixels, connectSocket, disconnectSocket, placePixel } = useCanvasStore();
  const { isLoggedIn, fetchProfile } = useUserStore();

  useEffect(() => {
    if (isLoggedIn) {
      connectSocket();
      fetchProfile();
    }
    return () => disconnectSocket();
  }, [isLoggedIn, connectSocket, disconnectSocket, fetchProfile]);

  const handlePlacePixel = useCallback((x: number, y: number) => {
    // We send to backend; backend broadcasts to all, which updates our local store.
    placePixel(x, y, "fandom-02");
  }, [placePixel]);

  return (
    <div className="flex w-full h-[calc(100vh-80px)] overflow-hidden bg-[var(--color-pw-surface-300)]">
      
      {/* Left Panel */}
      <aside className="w-[320px] h-full shrink-0 border-r-2 border-black flex flex-col z-50 bg-[var(--color-pw-surface-100)] overflow-y-auto">
        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-black text-white">
          <h2 className="font-display font-bold uppercase tracking-tight text-xl">The Canvas</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="font-data text-xs">LIVE</span>
          </div>
        </div>

        <CanvasTools />
        <ColorPicker />
        <Minimap />
        
        {/* Placeholder for chat/stats */}
        <div className="flex-1 p-4">
          <h3 className="font-retro text-[10px] text-[var(--color-pw-deep-purple)] mb-3">TERRITORY FEED</h3>
          <div className="text-sm font-body text-[var(--color-on-surface-variant)] text-center mt-10">
            Fandom chat offline.
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 relative h-full">
        <CanvasGrid 
          pixels={pixels}
          onPlacePixel={handlePlacePixel}
          onHoverPixel={(x, y) => setHoverCoord({ x, y })}
        />
        
        <CoordinateDisplay x={hoverCoord.x} y={hoverCoord.y} />
      </main>
      
    </div>
  );
}
