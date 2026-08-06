"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { TrackCard } from "@/components/music/TrackCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{
    tracks: any[];
    albums: any[];
    artists: any[];
  }>({ tracks: [], albums: [], artists: [] });

  useEffect(() => {
    if (!query) {
      setResults({ tracks: [], albums: [], artists: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchApi(`/public/search?q=${encodeURIComponent(query)}`)
      .then((res: any) => {
        setResults(res || { tracks: [], albums: [], artists: [] });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="font-display font-bold text-4xl mb-4">Search</h1>
        <p className="font-body text-gray-500 font-bold">Type something in the search bar to find music.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-10">
      <h1 className="font-display font-bold text-3xl">Search results for "{query}"</h1>

      {loading ? (
        <div className="w-full h-32 flex items-center justify-center font-bold animate-pulse">
          Searching the waves...
        </div>
      ) : (
        <>
          {/* Artists */}
          {results.artists.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">Artists</h2>
              <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
                {results.artists.map((artist) => (
                  <div key={artist.id} className="min-w-fit">
                    <ArtistCard
                      id={artist.id}
                      name={artist.name}
                      avatarUrl={artist.avatarUrl}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {results.albums.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {results.albums.map((album) => (
                  <AlbumCard
                    key={album.id}
                    id={album.id}
                    title={album.title}
                    artist={album.artist?.name || 'Unknown'}
                    coverArtUrl={album.artworkUrl}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Tracks */}
          {results.tracks.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-6">Tracks</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {results.tracks.map((track) => (
                  <TrackCard 
                    key={track.id}
                    id={track.id}
                    title={track.title}
                    artist={track.artist?.name || 'Unknown'}
                    pixels={track.playCount || 0}
                    coverArtUrl={track.coverArtUrl}
                  />
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {!loading && results.artists.length === 0 && results.albums.length === 0 && results.tracks.length === 0 && (
            <div className="w-full py-12 flex flex-col items-center justify-center text-gray-500 border-4 border-dashed border-gray-300 bg-white shadow-[4px_4px_0_0_#000]">
              <span className="font-display font-bold text-xl mb-2 text-black">No Results Found</span>
              <span className="font-body text-sm font-bold">Try searching for a different keyword.</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-4 md:p-8 font-bold animate-pulse">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
