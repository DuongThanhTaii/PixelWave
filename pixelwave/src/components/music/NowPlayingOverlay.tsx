import React from "react";
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { LyricsViewer } from "./LyricsViewer";
import { usePlayerStore } from "@/stores/playerStore";

interface NowPlayingOverlayProps {
  played: number;
  playedSeconds: number;
  duration: number;
  onSeek: (value: number) => void;
  formatTime: (sec: number) => string;
}

export function NowPlayingOverlay({
  played, playedSeconds, duration, onSeek, formatTime
}: NowPlayingOverlayProps) {
  const { currentTrack, isPlaying, play, pause, volume, setVolume, isExpanded, collapse } = usePlayerStore();

  if (!isExpanded || !currentTrack) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--color-pw-surface-100)] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 h-14 flex items-center justify-between px-4 md:px-10 border-b-4 border-black bg-white">
        <button
          onClick={collapse}
          className="w-10 h-10 flex items-center justify-center rounded-full border-4 border-black hover:bg-black hover:text-white transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-[9px] tracking-widest uppercase text-gray-400">Playing From</span>
          <span className="font-display font-bold uppercase text-sm leading-none">{currentTrack.artist?.name}</span>
        </div>
        <div className="w-10 h-10" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

        {/* Left: Controls */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center overflow-y-auto p-6 md:p-8 lg:border-r-4 border-black bg-[var(--color-pw-surface-200)] relative">
          {/* BG blur */}
          {currentTrack.coverArtUrl && (
            <div
              className="absolute inset-0 opacity-10 blur-2xl scale-150 pointer-events-none"
              style={{ backgroundImage: `url(${currentTrack.coverArtUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}

          {/* Album Art */}
          <div className="w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex-shrink-0 border-4 border-black shadow-[10px_10px_0_0_#000] bg-white overflow-hidden mb-5 relative z-10">
            {currentTrack.coverArtUrl ? (
              <img src={currentTrack.coverArtUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[var(--color-pw-deep-purple)] to-[var(--color-pw-cyan-glow)]" />
            )}
          </div>

          {/* Title & Artist */}
          <div className="w-full max-w-xs text-center mb-4 relative z-10">
            <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight mb-1 line-clamp-2">{currentTrack.title}</h2>
            <p className="font-body font-bold text-sm text-[var(--color-pw-hot-pink)] truncate">{currentTrack.artist?.name}</p>
          </div>

          {/* Progress */}
          <div className="w-full max-w-xs mb-4 relative z-10">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer mb-1"
              style={{
                background: `linear-gradient(to right, var(--color-pw-hot-pink) ${played * 100}%, #e5e7eb ${played * 100}%)`
              }}
            />
            <div className="flex justify-between font-data font-bold text-xs text-black">
              <span>{formatTime(playedSeconds)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-7 mb-5 relative z-10">
            <button className="text-black hover:scale-110 transition-transform">
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button
              onClick={() => isPlaying ? pause() : play(currentTrack)}
              className="w-16 h-16 rounded-full bg-[var(--color-pw-hot-pink)] border-4 border-black flex items-center justify-center shadow-[5px_5px_0_0_#000] hover:shadow-[7px_7px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white fill-white" />
              ) : (
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              )}
            </button>
            <button className="text-black hover:scale-110 transition-transform">
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Volume */}
          <div className="w-full max-w-xs flex items-center gap-3 relative z-10">
            <Volume2 className="w-5 h-5 text-black flex-shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, var(--color-pw-neon-lime) ${volume * 100}%, #e5e7eb ${volume * 100}%)` }}
            />
          </div>
        </div>

        {/* Right: Lyrics */}
        <div className="w-full lg:w-1/2 bg-black overflow-y-auto" style={{ minHeight: '200px' }}>
          <LyricsViewer
            lyricsRaw={currentTrack.lyrics || ""}
            currentTime={playedSeconds}
          />
        </div>
      </div>
    </div>
  );
}
