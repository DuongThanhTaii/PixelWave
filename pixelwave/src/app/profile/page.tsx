import React from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
      <ProfileHeader 
        username="PixelSurfer99"
        fandomName="Neon Syndicate"
        level={42}
      />
      
      <ProfileStats 
        streams={12543}
        pixels={2840}
        badges={14}
        streak={12}
      />

      <ProfileTabs />
    </div>
  );
}
