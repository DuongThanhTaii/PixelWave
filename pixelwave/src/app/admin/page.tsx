"use client";

import React from 'react';
import { useUserStore } from '@/stores/userStore';

export default function AdminDashboard() {
  const { username, role } = useUserStore();

  return (
    <div>
      <h1 className="font-display text-4xl font-bold uppercase mb-2">Welcome to Admin 🛡️</h1>
      <p className="font-body text-[var(--color-on-surface-variant)] mb-8">Hello, {username} ({role}). Select a category from the sidebar to manage the universe.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Placeholder Stats Cards */}
        <div className="bg-[var(--color-pw-vibrant-blue)] text-white p-6 border-4 border-black shadow-[4px_4px_0_0_#000]">
          <h3 className="font-display font-bold uppercase text-xl mb-2">Total Tracks</h3>
          <p className="text-4xl font-black">---</p>
        </div>

        <div className="bg-[var(--color-pw-neon-lime)] text-black p-6 border-4 border-black shadow-[4px_4px_0_0_#000]">
          <h3 className="font-display font-bold uppercase text-xl mb-2">Total Artists</h3>
          <p className="text-4xl font-black">---</p>
        </div>

        <div className="bg-[var(--color-pw-hot-pink)] text-white p-6 border-4 border-black shadow-[4px_4px_0_0_#000]">
          <h3 className="font-display font-bold uppercase text-xl mb-2">Total Fandoms</h3>
          <p className="text-4xl font-black">---</p>
        </div>

      </div>
    </div>
  );
}
