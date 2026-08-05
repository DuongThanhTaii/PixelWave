import React from "react";
import { FriendList } from "@/components/social/FriendList";
import { ActivityFeed } from "@/components/social/ActivityFeed";

export default function SocialPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-80px)]">
      
      <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0 pb-6">
        
        {/* Left Column: Friend List (1/3 width) */}
        <div className="w-full lg:w-1/3 shrink-0 min-h-0 h-[400px] lg:h-auto">
          <FriendList />
        </div>

        {/* Right Column: Activity Feed (2/3 width) */}
        <div className="flex-1 min-h-0 h-[400px] lg:h-auto">
          <ActivityFeed />
        </div>
        
      </div>
      
    </div>
  );
}
