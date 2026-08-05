import React from "react";
import { FandomHeader } from "@/components/fandom/FandomHeader";
import { FandomStats } from "@/components/fandom/FandomStats";
import { FandomTabs } from "@/components/fandom/FandomTabs";

export default function FandomPage({ params }: { params: { id: string } }) {
  // Mock data for Fandom-02 (Neon Syndicate)
  const themeColor = "var(--color-pw-cyan-glow)";

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col">
      <FandomHeader 
        name="Neon Syndicate"
        themeColor={themeColor}
      />
      
      <FandomStats 
        members={14205}
        pixels={1250400}
        territory={58430}
        rank={1}
        online={420}
      />

      <FandomTabs themeColor={themeColor} />
    </div>
  );
}
