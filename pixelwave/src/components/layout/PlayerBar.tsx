"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";
import ReactPlayerComponent from "react-player";
import { NowPlayingOverlay } from "../music/NowPlayingOverlay";
import { fetchApi } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";

const ReactPlayer = ReactPlayerComponent as any;

export function PlayerBar() {
  const { currentTrack, isPlaying, play, pause, volume, setVolume, expand, isExpanded } = usePlayerStore();
  const { isLoggedIn } = useUserStore();

  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ytReady, setYtReady] = useState(false);

  // For native audio (audioUrl tracks)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // For YouTube (youtubeVideoId tracks)
  const ytRef = useRef<any>(null);
  const lastSavedPosition = useRef<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isYoutube = !!(currentTrack?.youtubeVideoId && !currentTrack?.audioUrl);
  const isAudio = !!(currentTrack?.audioUrl);

  // Reset on track change
  useEffect(() => {
    setPlayed(0);
    setPlayedSeconds(0);
    setDuration(0);
    setYtReady(false);
    lastSavedPosition.current = 0;
  }, [currentTrack?.id]);

  // Sync native audio with isPlaying
  useEffect(() => {
    if (!isAudio || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isAudio, currentTrack?.id]);

  // Progress tracking for native audio
  useEffect(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (isPlaying && isAudio) {
      progressIntervalRef.current = setInterval(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const dur = audio.duration || 0;
        const cur = audio.currentTime || 0;
        setPlayedSeconds(cur);
        setDuration(dur);
        if (dur > 0) setPlayed(cur / dur);
        if (isLoggedIn && currentTrack && cur - lastSavedPosition.current >= 5) {
          lastSavedPosition.current = cur;
          fetchApi('/sessions/progress', {
            method: 'POST',
            body: JSON.stringify({ trackId: currentTrack.id, positionMs: cur * 1000 })
          }).catch(console.error);
        }
      }, 500);
    }
    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [isPlaying, isAudio, currentTrack?.id, isLoggedIn]);

  const handleSeek = useCallback((value: number) => {
    if (isAudio && audioRef.current && duration > 0) {
      audioRef.current.currentTime = value * duration;
      setPlayed(value);
      setPlayedSeconds(value * duration);
    } else if (isYoutube && ytRef.current) {
      ytRef.current.seekTo(value, 'fraction');
      setPlayed(value);
    }
  }, [isAudio, isYoutube, duration]);

  const handleYTProgress = useCallback((state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
    setPlayedSeconds(state.playedSeconds);
    if (isLoggedIn && currentTrack && state.playedSeconds - lastSavedPosition.current >= 5) {
      lastSavedPosition.current = state.playedSeconds;
      fetchApi('/sessions/progress', {
        method: 'POST',
        body: JSON.stringify({ trackId: currentTrack.id, positionMs: state.playedSeconds * 1000 })
      }).catch(console.error);
    }
  }, [isLoggedIn, currentTrack]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!currentTrack) return null;

  const ytUrl = currentTrack.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${currentTrack.youtubeVideoId}`
    : null;

  return (
    <>
      {/* Native HTML5 Audio - for direct MP3/audio file tracks */}
      {isAudio && currentTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
          onEnded={() => pause()}
          preload="metadata"
          style={{ display: 'none' }}
        />
      )}

      {/* YouTube ReactPlayer - MUST be visible (not display:none) for autoplay to work */}
      {/* Hidden behind PlayerBar using z-index layering, but still "visible" to the browser */}
      {isYoutube && ytUrl && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '320px',
            height: '180px',
            zIndex: 99, // just behind PlayerBar (z-100)
            pointerEvents: 'none',
          }}
        >
          <ReactPlayer
            ref={ytRef}
            url={ytUrl}
            playing={isPlaying}
            volume={volume}
            width="320px"
            height="180px"
            onReady={() => setYtReady(true)}
            onProgress={handleYTProgress}
            onDuration={(d: number) => setDuration(d)}
            onEnded={() => pause()}
            onError={(e: any) => console.error("YouTube Error:", e)}
            config={{
              youtube: {
                playerVars: {
                  origin: typeof window !== 'undefined' ? window.location.origin : '',
                  playsinline: 1,
                  controls: 0,
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
        onSeek={handleSeek}
        formatTime={formatTime}
      />

      {/* Bottom PlayerBar - z-100 covers the YouTube iframe below */}
      <div className="fixed bottom-[56px] md:bottom-0 left-0 w-full h-[80px] bg-gradient-glass backdrop-blur-xl border-t-2 border-black flex items-center justify-between px-4 md:px-6 z-[100]">

        {/* Left: Album Art & Track Info */}
        <div
          className="flex items-center gap-3 w-1/3 min-w-0 cursor-pointer group"
          onClick={expand}
        >
          <div className="w-12 h-12 bg-[var(--color-pw-surface-300)] rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            {currentTrack.coverArtUrl ? (
              <img src={currentTrack.coverArtUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[var(--color-pw-deep-purple)] to-[var(--color-pw-cyan-glow)]" />
            )}
          </div>
          <div className="hidden sm:flex flex-col min-w-0 overflow-hidden">
            <span className="font-display font-bold text-[14px] truncate flex items-center gap-1 group-hover:text-[var(--color-pw-hot-pink)] transition-colors">
              {currentTrack.title}
              <Maximize2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </span>
            <span className="font-body text-gray-500 text-[11px] truncate">{currentTrack.artist.name}</span>
          </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-[400px] px-2">
          <div className="flex items-center gap-5 mb-1">
            <button className="text-[var(--color-on-background)] hover:scale-110 transition-transform">
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => isPlaying ? pause() : play(currentTrack)}
              className="w-10 h-10 rounded-full bg-[var(--color-pw-hot-pink)] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-white" />
              ) : (
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              )}
            </button>
            <button className="text-[var(--color-on-background)] hover:scale-110 transition-transform">
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] font-data text-gray-500 w-8 text-right">{formatTime(playedSeconds)}</span>
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, var(--color-pw-hot-pink) ${played * 100}%, #e5e7eb ${played * 100}%)` }}
            />
            <span className="text-[10px] font-data text-gray-500 w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          <div className="hidden lg:flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[var(--color-on-background)]" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setVolume(vol);
                if (audioRef.current) audioRef.current.volume = vol;
              }}
              className="w-20 h-1 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, var(--color-pw-cyan-glow) ${volume * 100}%, #e5e7eb ${volume * 100}%)` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
