import React from "react";
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { LyricsViewer } from "./LyricsViewer";
import { usePlayerStore } from "@/stores/playerStore";

interface NowPlayingOverlayProps {
  played: number;
  playedSeconds: number;
  duration: number;
  handleSeekChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSeekMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void;
  handleSeekTouchEnd: (e: React.TouchEvent<HTMLInputElement>) => void;
  formatTime: (sec: number) => string;
}

export function NowPlayingOverlay({
  played, playedSeconds, duration,
  handleSeekChange, handleSeekMouseUp, handleSeekTouchEnd,
  formatTime
}: NowPlayingOverlayProps) {
  const { currentTrack, isPlaying, play, pause, volume, setVolume, isExpanded, collapse } = usePlayerStore();

  if (!isExpanded || !currentTrack) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--color-pw-surface-100)] flex flex-col overflow-hidden">

      {/* Header - fixed height */}
      <div className="flex-shrink-0 w-full h-16 flex items-center justify-between px-4 md:px-12 border-b-4 border-black bg-white">
        <button
          onClick={collapse}
          className="w-10 h-10 flex items-center justify-center rounded-full border-4 border-black hover:bg-black hover:text-white transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-[10px] tracking-widest uppercase text-gray-500">Playing From</span>
          <span className="font-display font-bold uppercase text-sm">{currentTrack.artist?.name}</span>
        </div>
        <div className="w-10 h-10" />
      </div>

      {/* Body - takes remaining space */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

        {/* Left: Art & Controls - scrollable on small screens */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center overflow-y-auto p-6 md:p-10 border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-[var(--color-pw-surface-200)] relative">
          {/* Background Blur */}
          {currentTrack.coverArtUrl && (
            <div
              className="absolute inset-0 opacity-20 blur-3xl scale-150 pointer-events-none"
              style={{ backgroundImage: `url(${currentTrack.coverArtUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
            />
          )}

          {/* Album Art */}
          <div className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 flex-shrink-0 border-4 border-black shadow-[12px_12px_0_0_#000] bg-white overflow-hidden mb-6 relative z-10">
            {currentTrack.coverArtUrl ? (
              <img src={currentTrack.coverArtUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[var(--color-pw-deep-purple)] to-[var(--color-pw-cyan-glow)]" />
            )}
          </div>

          {/* Title & Artist */}
          <div className="w-full max-w-sm flex flex-col items-center relative z-10 mb-6">
            <h2 className="font-display font-black text-2xl md:text-3xl text-center uppercase tracking-tight mb-1 w-full line-clamp-2">
              {currentTrack.title}
            </h2>
            <p className="font-body font-bold text-base md:text-lg text-[var(--color-pw-hot-pink)] text-center truncate w-full">
              {currentTrack.artist?.name}
            </p>
          </div>

          {/* Progress */}
          <div className="w-full max-w-sm flex flex-col gap-2 mb-6 relative z-10">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              onTouchEnd={handleSeekTouchEnd}
              className="w-full h-3 bg-white border-2 border-black rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[var(--color-pw-cyan-glow)] [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--color-pw-hot-pink) ${played * 100}%, white ${played * 100}%)`
              }}
            />
            <div className="flex items-center justify-between w-full font-data font-bold text-sm text-black">
              <span>{formatTime(playedSeconds)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 mb-6 relative z-10">
            <button className="text-black hover:scale-110 transition-transform">
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            <button
              onClick={() => isPlaying ? pause() : play(currentTrack)}
              className="w-16 h-16 rounded-full bg-[var(--color-pw-hot-pink)] border-4 border-black flex items-center justify-center shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-white fill-white" />
              ) : (
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              )}
            </button>

            <button className="text-black hover:scale-110 transition-transform">
              <SkipForward className="w-7 h-7 fill-current" />
            </button>
          </div>

          {/* Volume */}
          <div className="w-full max-w-sm flex items-center gap-4 relative z-10">
            <Volume2 className="w-5 h-5 text-black flex-shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-white border-2 border-black rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[var(--color-pw-neon-lime)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--color-pw-neon-lime) ${volume * 100}%, white ${volume * 100}%)`
              }}
            />
          </div>
        </div>

        {/* Right: Lyrics - scrollable */}
        <div className="w-full lg:w-1/2 flex-1 bg-black overflow-y-auto min-h-[200px] lg:min-h-0">
          <LyricsViewer
            lyricsRaw={currentTrack.lyrics || ""}
            currentTime={playedSeconds}
          />
        </div>
      </div>
    </div>
  );
}
