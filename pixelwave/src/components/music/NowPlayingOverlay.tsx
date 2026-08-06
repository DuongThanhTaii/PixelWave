import React from "react";
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Volume2, Image, Video } from "lucide-react";
import { LyricsViewer } from "./LyricsViewer";
import { usePlayerStore } from "@/stores/playerStore";

interface NowPlayingOverlayProps {
  played: number;
  playedSeconds: number;
  duration: number;
  onSeek: (value: number) => void;
  formatTime: (sec: number) => string;
  isYoutube?: boolean;
  showVideo?: boolean;
  onToggleVideo?: () => void;
}

export function NowPlayingOverlay({
  played, playedSeconds, duration, onSeek, formatTime,
  isYoutube, showVideo, onToggleVideo
}: NowPlayingOverlayProps) {
  const { currentTrack, isPlaying, play, pause, volume, setVolume, isExpanded, collapse } = usePlayerStore();

  if (!isExpanded || !currentTrack) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--color-pw-surface-100)] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 md:px-8 border-b-4 border-black bg-white z-20">
        <button
          onClick={collapse}
          className="w-10 h-10 flex items-center justify-center rounded-none border-4 border-black shadow-[4px_4px_0_0_#000] hover:bg-black hover:text-white transition-colors hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <ChevronDown className="w-6 h-6 stroke-[3]" />
        </button>

        <div className="flex flex-col items-center">
          <span className="font-data font-bold text-[10px] tracking-widest uppercase text-gray-500">Now Playing</span>
          <span className="font-display font-black uppercase text-base leading-none">{currentTrack.artist?.name}</span>
        </div>

        {/* Video/Cover toggle - only for YouTube tracks */}
        {isYoutube ? (
          <button
            onClick={onToggleVideo}
            className="flex items-center gap-2 px-4 py-2 rounded-none border-4 border-black shadow-[4px_4px_0_0_#000] bg-[var(--color-pw-cyan-glow)] font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            title={showVideo ? "Show Cover Art" : "Show Video"}
          >
            {showVideo ? (
              <><Image className="w-4 h-4 stroke-[3]" /><span className="hidden sm:inline">Cover</span></>
            ) : (
              <><Video className="w-4 h-4 stroke-[3]" /><span className="hidden sm:inline">Video</span></>
            )}
          </button>
        ) : (
          <div className="w-20" /> // Spacer
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

        {/* Left: Controls Panel - added overflow-y-auto with hidden scrollbar for small screens */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:border-r-4 border-black bg-[var(--color-pw-surface-200)] relative [&::-webkit-scrollbar]:hidden">
          
          {/* Spacer for small screens to center content if it overflows */}
          <div className="min-h-[20px] flex-shrink-0" />

          {/* BG blur */}
          {currentTrack.coverArtUrl && !showVideo && (
            <div
              className="absolute inset-0 opacity-[0.15] blur-3xl scale-110 pointer-events-none"
              style={{ backgroundImage: `url(${currentTrack.coverArtUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}

          {/* Art area: YouTube video OR album cover */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 flex-shrink-0 border-4 border-black shadow-[10px_10px_0_0_#000] bg-black overflow-hidden mb-6 relative z-10 group">
            {showVideo && isYoutube ? (
              /* Video mode: placeholder - actual iframe is moved here by PlayerBar via absolute positioning */
              <div id="yt-placeholder" className="w-full h-full bg-black flex items-center justify-center relative">
                <span className="text-[var(--color-pw-hot-pink)] text-sm font-data font-bold uppercase tracking-widest animate-pulse">Video Feed Active</span>
              </div>
            ) : currentTrack.coverArtUrl ? (
              <img src={currentTrack.coverArtUrl} alt={currentTrack.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[var(--color-pw-deep-purple)] to-[var(--color-pw-cyan-glow)]" />
            )}
          </div>

          {/* Title & Artist */}
          <div className="w-full max-w-sm text-center mb-5 relative z-10">
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight mb-1 line-clamp-2 text-black leading-tight">
              {currentTrack.title}
            </h2>
            <p className="font-data font-bold text-lg sm:text-xl text-[var(--color-pw-hot-pink)] uppercase tracking-widest truncate">
              {currentTrack.artist?.name}
            </p>
          </div>

          {/* Progress - Soft & Simple style */}
          <div className="w-full max-w-sm mb-6 relative z-10 group">
            <input
              type="range" min={0} max={0.999999} step="any" value={played}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full h-2.5 rounded-full appearance-none cursor-pointer mb-2 bg-gray-200 outline-none"
              style={{ background: `linear-gradient(to right, var(--color-pw-hot-pink) ${played * 100}%, #e5e7eb ${played * 100}%)` }}
            />
            <div className="flex justify-between font-data font-bold text-xs text-gray-500">
              <span>{formatTime(playedSeconds)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls - Brutalist but slightly more compact */}
          <div className="flex items-center gap-6 mb-8 relative z-10">
            <button className="w-12 h-12 flex items-center justify-center border-4 border-black bg-white shadow-[3px_3px_0_0_#000] hover:shadow-[5px_5px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
              <SkipBack className="w-5 h-5 text-black fill-current" />
            </button>
            <button
              onClick={() => isPlaying ? pause() : play(currentTrack)}
              className="w-16 h-16 rounded-none bg-[var(--color-pw-neon-lime)] border-4 border-black flex items-center justify-center shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-200"
            >
              {isPlaying ? <Pause className="w-8 h-8 text-black fill-black" /> : <Play className="w-8 h-8 text-black fill-black ml-1" />}
            </button>
            <button className="w-12 h-12 flex items-center justify-center border-4 border-black bg-white shadow-[3px_3px_0_0_#000] hover:shadow-[5px_5px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
              <SkipForward className="w-5 h-5 text-black fill-current" />
            </button>
          </div>

          {/* Volume - Soft & Simple style */}
          <div className="w-full max-w-sm flex items-center gap-3 relative z-10 mb-4 px-2">
            <Volume2 className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-gray-200 outline-none"
              style={{ background: `linear-gradient(to right, var(--color-pw-cyan-glow) ${volume * 100}%, #e5e7eb ${volume * 100}%)` }}
            />
          </div>

          {/* Spacer for small screens */}
          <div className="min-h-[20px] flex-shrink-0" />
        </div>

        {/* Right: Lyrics */}
        <div className="w-full lg:w-1/2 bg-black overflow-y-auto" style={{ minHeight: '300px' }}>
          <LyricsViewer lyricsRaw={currentTrack.lyrics || ""} currentTime={playedSeconds} />
        </div>
      </div>
    </div>
  );
}
