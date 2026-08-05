import React from "react";
import { MusicIntegration } from "@/components/settings/MusicIntegration";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { Preferences } from "@/components/settings/Preferences";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="font-display font-black text-4xl uppercase tracking-tighter text-black drop-shadow-sm">
          Settings
        </h1>
      </div>

      <div className="flex flex-col gap-8 pb-12">
        <MusicIntegration />
        <ProfileSettings />
        <Preferences />
      </div>
    </div>
  );
}
