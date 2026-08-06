import React from "react";
import Link from "next/link";

interface ArtistCardProps {
  id: string;
  name: string;
  avatarUrl?: string;
}

export function ArtistCard({ id, name, avatarUrl }: ArtistCardProps) {
  return (
    <Link href={`/artist/${id}`} className="group flex flex-col items-center justify-center gap-3 cursor-pointer">
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black overflow-hidden bg-[var(--color-pw-neon-lime)] shadow-[4px_4px_0_0_#000] group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:shadow-[8px_8px_0_0_#000] transition-all">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-display font-black text-black">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <h3 className="font-display font-bold text-center uppercase group-hover:text-[var(--color-pw-hot-pink)] transition-colors">
        {name}
      </h3>
    </Link>
  );
}
