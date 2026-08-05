"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Grid, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Discover", href: "/", icon: Compass },
  { name: "Canvas", href: "/canvas", icon: Grid },
  { name: "Social", href: "/social", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav 
      className="fixed bottom-0 left-0 w-full h-[56px] bg-[var(--color-pw-surface-100)] border-t-2 border-black flex items-center justify-around px-2"
      style={{ zIndex: 90 }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-[var(--color-pw-hot-pink)]" : "text-[var(--color-on-background)]"
            )}
          >
            <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-body font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
