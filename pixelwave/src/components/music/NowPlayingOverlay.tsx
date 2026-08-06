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
    <div className="fixed inset-0 z-[200] bg-[var(--color-pw-surface-100)] flex flex-col transition-transform duration-500 transform translate-y-0 overflow-hidden">
      
      {/* Header */}
      <div className="w-full h-20 flex items-center justify-between px-6 md:px-12 border-b-4 border-black shrink-0 bg-white z-10 shadow-[0_4px_0_0_#000]">
        <button 
          onClick={collapse}
          className="w-12 h-12 flex items-center justify-center rounded-full border-4 border-black hover:bg-black hover:text-white transition-colors"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-[10px] tracking-widest uppercase text-gray-500">Playing From</span>
          <span className="font-display font-bold uppercase">{currentTrack.artist?.name}</span>
        </div>
        <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden min-h-0">
        
        {/* Left: Art & Controls */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 border-b-4 lg:border-b-0 lg:border-r-4 border-black relative overflow-hidden bg-[var(--color-pw-surface-200)]">
          {/* Background Blur */}
          {currentTrack.coverArtUrl && (
            <div 
              className="absolute inset-0 opacity-20 blur-3xl scale-150"
              style={{ backgroundImage: `url(${currentTrack.coverArtUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
            />
          )}

          <div className="w-64 h-64 md:w-96 md:h-96 shrink-0 border-4 border-black shadow-[16px_16px_0_0_#000] bg-white overflow-hidden mb-12 relative z-10 transition-transform hover:scale-105 duration-500">
            {currentTrack.coverArtUrl ? (
              <img src={currentTrack.coverArtUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[var(--color-pw-deep-purple)] to-[var(--color-pw-cyan-glow)]" />
            )}
          </div>

          <div className="w-full max-w-md flex flex-col items-center relative z-10">
            <h2 className="font-display font-black text-3xl md:text-5xl text-center uppercase tracking-tight mb-2 truncate w-full">
              {currentTrack.title}
            </h2>
            <p className="font-body font-bold text-lg md:text-xl text-[var(--color-pw-hot-pink)] text-center truncate w-full mb-8">
              {currentTrack.artist?.name}
            </p>

            {/* Progress */}
            <div className="w-full flex flex-col gap-2 mb-8">
              <div className="flex-1 h-3 relative flex items-center w-full">
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  onTouchEnd={handleSeekTouchEnd}
                  className="w-full h-3 bg-white border-2 border-black rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[var(--color-pw-cyan-glow)] [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full cursor-pointer relative z-10"
                  style={{
                    background: `linear-gradient(to right, var(--color-pw-hot-pink) ${played * 100}%, white ${played * 100}%)`
                  }}
                />
              </div>
              <div className="flex items-center justify-between w-full font-data font-bold text-sm text-black">
                <span>{formatTime(playedSeconds)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <button className="text-black hover:scale-110 transition-transform">
                <SkipBack className="w-8 h-8 fill-current" />
              </button>
              
              <button 
                onClick={() => isPlaying ? pause() : play(currentTrack)}
                className="w-20 h-20 rounded-full bg-[var(--color-pw-hot-pink)] border-4 border-black flex items-center justify-center shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white fill-white" />
                ) : (
                  <Play className="w-8 h-8 text-white fill-white ml-2" />
                )}
              </button>
              
              <button className="text-black hover:scale-110 transition-transform">
                <SkipForward className="w-8 h-8 fill-current" />
              </button>
            </div>

            {/* Volume */}
            <div className="w-full flex items-center gap-4 px-4">
              <Volume2 className="w-6 h-6 text-black" />
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
        </div>

        {/* Right: Lyrics */}
        <div className="w-full lg:w-1/2 flex-1 bg-black relative">
          <LyricsViewer 
            lyricsRaw={currentTrack.lyrics || ""} 
            currentTime={playedSeconds} 
          />
        </div>
      </div>
    </div>
  );
}
