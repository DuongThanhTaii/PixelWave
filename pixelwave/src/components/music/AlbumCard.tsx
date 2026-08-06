import React from "react";
import Link from "next/link";

interface AlbumCardProps {
  id: string;
  title: string;
  artist: string;
  coverArtUrl?: string;
}

export function AlbumCard({ id, title, artist, coverArtUrl }: AlbumCardProps) {
  return (
    <Link href={`/album/${id}`} className="group relative bg-white border-4 border-black p-4 shadow-[6px_6px_0_0_#000] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[10px_10px_0_0_#000] transition-all cursor-pointer block">
      <div className="relative aspect-square w-full mb-4 border-2 border-black overflow-hidden bg-gray-100">
        {coverArtUrl ? (
          <img src={coverArtUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
            No Cover
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        <h3 className="font-display font-bold text-lg uppercase truncate" title={title}>
          {title}
        </h3>
        <p className="font-body text-sm font-bold text-[var(--color-pw-vibrant-blue)] truncate" title={artist}>
          {artist}
        </p>
      </div>
    </Link>
  );
}
