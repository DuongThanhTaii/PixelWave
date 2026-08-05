import React from "react";
import { SeasonHeader } from "@/components/season/SeasonHeader";
import { SeasonStats } from "@/components/season/SeasonStats";
import { GlobalLeaderboard } from "@/components/season/GlobalLeaderboard";
import { WarFeed } from "@/components/season/WarFeed";

export default function SeasonPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-80px)]">
      
      <div className="shrink-0">
        <SeasonHeader 
          seasonName="Season 1: Neon Genesis"
          timeLeft="14D 05H 22M"
        />
        
        <SeasonStats 
          totalPixels={24508900}
          activeFandoms={142}
          totalTerritories={356}
          battlesFought={18402}
        />
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 pb-6">
        {/* Global Leaderboard - 2/3 width on desktop */}
        <div className="flex-[2] min-h-0 h-[400px] lg:h-auto">
          <GlobalLeaderboard />
        </div>

        {/* War Feed - 1/3 width on desktop */}
        <div className="flex-1 min-h-0 h-[400px] lg:h-auto">
          <WarFeed />
        </div>
      </div>
      
    </div>
  );
}
