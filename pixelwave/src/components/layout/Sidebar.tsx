"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Grid, BarChart2, Users, User, ChevronDown, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, role, username, logout } = useUserStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: "Discover", href: "/", icon: Compass },
    { name: "Canvas", href: "/canvas", icon: Grid },
    { name: "Charts", href: "/charts", icon: BarChart2 },
    { name: "Social", href: "/social", icon: Users },
    { name: "Profile", href: "/profile", icon: User },
  ];

  if (mounted && isLoggedIn && (role === 'ADMIN' || role === 'MODERATOR')) {
    navItems.push({ name: "Admin Dashboard", href: "/admin", icon: Settings });
  }

  return (
    <aside 
      className="w-[280px] h-full border-r-2 border-black bg-[var(--color-pw-surface-100)] flex flex-col p-4 relative"
      style={{ zIndex: 90 }}
    >
      <div className="flex items-center mb-8 px-4 py-2">
        <div className="text-2xl font-display font-bold uppercase tracking-tighter cursor-pointer" onClick={() => router.push('/')}>
          Pixel<span className="text-[var(--color-pw-hot-pink)]">wave</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg font-body font-semibold transition-all duration-300",
                "border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5",
                isActive 
                  ? "bg-[var(--color-pw-hot-pink)] text-white border-black shadow-[4px_4px_0px_0px_#000]" 
                  : "text-[var(--color-on-background)] hover:bg-[var(--color-pw-surface-200)]"
              )}
            >
              <item.icon className="w-5 h-5" strokeWidth={2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Fandom Quick Switch & Auth */}
      <div className="mt-auto pt-4 border-t-2 border-black flex flex-col gap-4">
        {/* Placeholder Fandom Quick Switch - To be updated in future phases */}
        <button className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-black bg-[var(--color-pw-surface-200)] hover:bg-[var(--color-pw-surface-300)] transition-all duration-300 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_0px_#000]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[var(--color-pw-cyan-glow)] border border-black" />
            <span className="font-semibold text-sm font-body">Fandom-02</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </button>

        <div>
          {(!mounted) ? (
            <div className="w-full h-14 rounded-lg bg-gray-200 animate-pulse border-2 border-transparent"></div>
          ) : isLoggedIn ? (
             <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-black bg-gray-900 text-white font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:-translate-x-0.5 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-300">
               <LogOut className="w-5 h-5" />
               Logout {username ? `(${username})` : ''}
             </button>
          ) : (
             <Link href="/login" className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-black bg-[var(--color-pw-hot-pink)] text-white font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:-translate-x-0.5 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all duration-300">
               <User className="w-5 h-5" />
               Login / Profile
             </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
