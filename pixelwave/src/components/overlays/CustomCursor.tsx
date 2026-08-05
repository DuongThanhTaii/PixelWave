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
        transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
      }}
    >
      <div className="w-4 h-4 bg-[var(--color-pw-hot-pink)] border-[1.5px] border-black shadow-[2px_2px_0px_0px_#000]" 
           style={{ clipPath: "polygon(0 0, 100% 50%, 50% 50%, 50% 100%)" }} 
      />
    </div>
  );
}
