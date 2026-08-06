"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { PlayerBar } from "./PlayerBar";
import { BottomNav } from "./BottomNav";

import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return (
      <div className="flex h-screen overflow-hidden bg-[var(--color-surface-100)] text-[var(--color-on-background)] font-sans">
        {/* Removed CustomCursor */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface-100)] text-[var(--color-on-background)] font-sans">
      {/* Removed CustomCursor */}
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-[56px] md:pb-[80px]">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden block">
        <BottomNav />
      </div>

      {/* Global Player Bar */}
      <PlayerBar />
    </div>
  );
}
