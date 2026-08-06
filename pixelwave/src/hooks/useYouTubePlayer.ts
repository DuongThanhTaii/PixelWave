"use client";

import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    _ytApiLoaded: boolean;
  }
}

let ytApiPromise: Promise<void> | null = null;

function loadYTApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<void>((resolve) => {
    if (window.YT?.Player) { resolve(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });

  return ytApiPromise;
}

interface UseYTPlayerOptions {
  videoId: string | null | undefined;
  isPlaying: boolean;
  volume: number;
  onProgress: (played: number, playedSeconds: number) => void;
  onDuration: (duration: number) => void;
  onEnded: () => void;
}

export function useYouTubePlayer({
  videoId,
  isPlaying,
  volume,
  onProgress,
  onDuration,
  onEnded,
}: UseYTPlayerOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const isReadyRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const onProgressRef = useRef(onProgress);
  const onDurationRef = useRef(onDuration);
  const onEndedRef = useRef(onEnded);
  onProgressRef.current = onProgress;
  onDurationRef.current = onDuration;
  onEndedRef.current = onEnded;

  // Create/recreate player when videoId changes
  useEffect(() => {
    if (!videoId) return;
    let destroyed = false;

    isReadyRef.current = false;
    setIsReady(false);

    loadYTApi().then(() => {
      if (destroyed || !containerRef.current) return;

      // Destroy old player if exists
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }

      // Create fresh div for YT to replace
      const div = document.createElement("div");
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(div);

      playerRef.current = new window.YT.Player(div, {
        videoId,
        width: "300",
        height: "200",
        playerVars: {
          autoplay: 1,
          controls: 0,
          playsinline: 1,
          enablejsapi: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            if (destroyed) return;
            event.target.setVolume(Math.round(volume * 100));
            const dur = event.target.getDuration();
            if (dur) onDurationRef.current(dur);
            isReadyRef.current = true;
            setIsReady(true);
            // Auto-play if isPlaying was true when track loaded
            if (isPlaying) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
          },
          onStateChange: (event: any) => {
            if (event.data === 0) { // ENDED
              onEndedRef.current();
            }
          },
          onError: (event: any) => {
            console.error("YouTube Player Error:", event.data);
          }
        },
      });
    });

    return () => {
      destroyed = true;
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
      isReadyRef.current = false;
      setIsReady(false);
    };
  }, [videoId]);

  // Sync play/pause
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (_) {}
  }, [isPlaying, isReady]);

  // Progress tracking
  useEffect(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (isPlaying && isReady) {
      progressInterval.current = setInterval(() => {
        const player = playerRef.current;
        if (!player || typeof player.getCurrentTime !== "function") return;
        const cur = player.getCurrentTime() || 0;
        const dur = player.getDuration() || 0;
        onProgressRef.current(dur > 0 ? cur / dur : 0, cur);
        if (dur > 0) onDurationRef.current(dur);
      }, 500);
    }
    return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [isPlaying, isReady]);

  // Sync volume
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    try { playerRef.current.setVolume(Math.round(volume * 100)); } catch (_) {}
  }, [volume, isReady]);

  const seekTo = useCallback((fraction: number) => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      const dur = playerRef.current.getDuration() || 0;
      playerRef.current.seekTo(fraction * dur, true);
    } catch (_) {}
  }, []);

  return { containerRef, seekTo, isReady };
}
