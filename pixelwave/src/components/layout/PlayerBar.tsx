"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";
import ReactPlayerComponent from "react-player";
import { NowPlayingOverlay } from "../music/NowPlayingOverlay";
const ReactPlayer = ReactPlayerComponent as any;
import { fetchApi } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";

export function PlayerBar() {
  const { currentTrack, isPlaying, play, pause, volume, setVolume, expand } = usePlayerStore();
  const { isLoggedIn } = useUserStore();
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const lastSavedPosition = useRef<number>(0);

  // Fetch resume position when track changes
  useEffect(() => {
    if (currentTrack && isLoggedIn) {
      fetchApi<any>(`/sessions/progress/${currentTrack.id}`)
        .then((res: any) => {
          if (res.data?.positionMs && playerRef.current) {
            const posSec = res.data.positionMs / 1000;
            playerRef.current.seekTo(posSec, 'seconds');
          }
        })
        .catch(console.error);
    }
  }, [currentTrack?.id, isLoggedIn]);

  const handleProgress = (state: { played: number, playedSeconds: number }) => {
    setPlayed(state.played);
    setPlayedSeconds(state.playedSeconds);

    // Save progress to backend every 5 seconds
    if (isLoggedIn && currentTrack && state.playedSeconds - lastSavedPosition.current >= 5) {
      lastSavedPosition.current = state.playedSeconds;
      fetchApi('/sessions/progress', {
        method: 'POST',
        body: JSON.stringify({
          trackId: currentTrack.id,
          positionMs: state.playedSeconds * 1000
        })
      }).catch(console.error);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
  };

  const handleSeekTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value));
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!currentTrack) {
    return null;
  }

  const url = currentTrack.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${currentTrack.youtubeVideoId}`
    : currentTrack.audioUrl;

  return (
    <>
      {/* ReactPlayer: rendered at root level, visually hidden but never display:none 
          YouTube requires minimum 200x200 and must be in DOM to allow audio playback */}
      {url && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: 1,
            height: 1,
            overflow: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -9999,
          }}
        >
          <ReactPlayer
            ref={playerRef}
            url={url}
            playing={isPlaying}
            volume={volume}
            width="300px"
            height="300px"
            onProgress={handleProgress}
            onDuration={(d: number) => setDuration(d)}
            onEnded={() => pause()}
            onError={(e: any) => console.error("ReactPlayer Error:", e)}
            config={{
              youtube: {
                playerVars: {
                  origin: typeof window !== 'undefined' ? window.location.origin : '',
                  playsinline: 1,
                }
              }
            }}
          />
        </div>
      )}

      <NowPlayingOverlay
        played={played}
        playedSeconds={playedSeconds}
        duration={duration}
        handleSeekChange={handleSeekChange}
        handleSeekMouseUp={handleSeekMouseUp}
        handleSeekTouchEnd={handleSeekTouchEnd}
        formatTime={formatTime}
      />

      {/* Bottom PlayerBar */}
      <div
        className="fixed bottom-[56px] md:bottom-0 left-0 w-full h-[80px] bg-gradient-glass backdrop-blur-xl border-t-2 border-black flex items-center justify-between px-4 md:px-6 z-[100]"
      >
        {/* Left: Album Art & Track Info */}
        <div
          className="flex items-center gap-4 w-1/3 cursor-pointer group"
          onClick={expand}
          title="Open Now Playing"
        >
          <div className="w-14 h-14 bg-[var(--color-pw-surface-300)] rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
            {currentTrack.coverArtUrl ? (
              <img src={currentTrack.coverArtUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[var(--color-pw-deep-purple)] to-[var(--color-pw-cyan-glow)]" />
            )}
          </div>
          <div className="hidden sm:flex flex-col overflow-hidden group-hover:text-[var(--color-pw-hot-pink)] transition-colors">
            <span className="font-display font-bold text-[18px] truncate flex items-center gap-2">
              {currentTrack.title}
              <Maximize2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <span className="font-body text-gray-500 text-[12px] truncate group-hover:text-[var(--color-pw-hot-pink)]">{currentTrack.artist.name}</span>
          </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex flex-col items-center justify-center w-1/3 max-w-[400px]">
          <div className="flex items-center gap-6">
            <button className="text-[var(--color-on-background)] hover:scale-110 transition-transform">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={() => isPlaying ? pause() : play(currentTrack)}
              className="w-12 h-12 rounded-full bg-[var(--color-pw-hot-pink)] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white fill-white" />
              ) : (
                <Play className="w-5 h-5 text-white fill-white ml-1" />
              )}
            </button>

            <button className="text-[var(--color-on-background)] hover:scale-110 transition-transform">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-2 flex items-center gap-2">
            <span className="text-[10px] font-data text-gray-500 w-8 text-right">{formatTime(playedSeconds)}</span>
            <div className="flex-1 h-1 relative flex items-center">
              <input
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={played}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchEnd={handleSeekTouchEnd}
                className="w-full h-1 bg-white border border-black rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--color-pw-cyan-glow)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full cursor-pointer relative z-10"
                style={{
                  background: `linear-gradient(to right, var(--color-pw-hot-pink) ${played * 100}%, white ${played * 100}%)`
                }}
              />
            </div>
            <span className="text-[10px] font-data text-gray-500 w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume */}
        <div className="flex items-center justify-end gap-6 w-1/3">
          <div className="hidden lg:flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[var(--color-on-background)]" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white border border-black rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--color-pw-cyan-glow)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--color-pw-cyan-glow) ${volume * 100}%, white ${volume * 100}%)`
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
