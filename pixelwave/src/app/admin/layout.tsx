"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { LayoutDashboard, Music, Users, Disc3, Star, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, role } = useUserStore();
  const pathname = usePathname();

  if (!isLoggedIn || (role !== 'ADMIN' && role !== 'MODERATOR')) {
    return <div className="p-8 text-center text-white font-display text-2xl">Access Denied. Admins or Moderators only.</div>;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Artists', path: '/admin/artists', icon: <Users size={20} /> },
    { label: 'Albums', path: '/admin/albums', icon: <Disc3 size={20} /> },
    { label: 'Tracks', path: '/admin/tracks', icon: <Music size={20} /> },
    { label: 'Fandoms', path: '/admin/fandoms', icon: <Star size={20} /> },
    { label: 'Roles', path: '/admin/users', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-pw-surface-300)] p-4 md:p-8 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
        <div className="bg-[var(--color-pw-surface-100)] border-4 border-black p-4 rounded shadow-[8px_8px_0_0_#000]">
          <h2 className="font-display text-xl font-bold uppercase mb-4 text-center">Admin Panel</h2>
          <nav className="flex flex-col gap-2 font-display">
            {navItems.map(item => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 p-3 border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-transform
                    ${isActive ? 'bg-[var(--color-pw-hot-pink)] text-white' : 'bg-white hover:bg-gray-100 text-black'}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[var(--color-pw-surface-100)] border-4 border-black p-6 rounded shadow-[8px_8px_0_0_#000] min-w-0">
        {children}
      </main>
      
    </div>
  );
}
