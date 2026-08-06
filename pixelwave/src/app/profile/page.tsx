"use client";

import React, { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useUserStore } from "@/stores/userStore";
import { fetchApi } from "@/lib/api";

export default function ProfilePage() {
  const { username, waveLevel, avatarUrl, role, isLoggedIn, fetchProfile } = useUserStore();
  const [stats, setStats] = useState({ streamsListened: 0, streamsReceived: 0, pixels: 0, badges: 0, streak: 0 });

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
      fetchApi<any>('/users/me/stats').then(res => {
        if (res.data) setStats(res.data);
      }).catch(console.error);
    }
  }, [isLoggedIn, fetchProfile]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex items-center justify-center min-h-[50vh]">
        <h2 className="font-display font-bold text-2xl uppercase">Please login to view your profile</h2>
      </div>
    );
  }

  const streams = role === 'artist' ? stats.streamsReceived : stats.streamsListened;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
      <ProfileHeader 
        username={username || "User"}
        fandomName={role === 'admin' ? 'Admin' : (role === 'artist' ? 'Artist' : 'Listener')}
        level={waveLevel || 1}
        avatarUrl={avatarUrl || undefined}
      />
      
      <ProfileStats 
        streams={streams}
        pixels={stats.pixels}
        badges={stats.badges}
        streak={stats.streak}
      />

      <ProfileTabs />
    </div>
  );
}
