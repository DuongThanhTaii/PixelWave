"use client";

import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Check if the device has a touch screen, if so, disable custom cursor
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("button") !== null ||
        target.closest("a") !== null
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Use a fallback for SSR or touch devices
  if (position.x === -100) return null;

  return (
    <div
      className="fixed pointer-events-none z-[1000] flex items-center justify-center transition-transform duration-75"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(${isPointer ? '-45%, -8%' : '-50%, -50%'}) scale(${isPointer ? 1.5 : 1})`,
      }}
    >
      {isPointer ? (
        <svg 
          width="32" height="32" viewBox="0 0 24 24" 
          fill="var(--color-pw-neon-lime)" 
          stroke="black" strokeWidth="1.5" 
          className="shadow-[2px_2px_0px_0px_#000]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", strokeLinejoin: "miter" }}
        >
          {/* Y2K Pixelated Hand Outline */}
          <path d="M10 2h2v4h2v-2h2v2h2v2h2v8h-2v2h-2v2h-6v-2h-2v-2H6v-6h2V8h2V2z" fill="var(--color-pw-neon-lime)" />
          <path d="M10 2h2v4h2v-2h2v2h2v2h2v8h-2v2h-2v2h-6v-2h-2v-2H6v-6h2V8h2V2z" fill="none" stroke="black" strokeWidth="2" />
        </svg>
      ) : (
        <div className="w-4 h-4 bg-[var(--color-pw-hot-pink)] border-[1.5px] border-black shadow-[2px_2px_0px_0px_#000]" 
             style={{ clipPath: "polygon(0 0, 100% 50%, 50% 50%, 50% 100%)" }} 
        />
      )}
    </div>
  );
}
