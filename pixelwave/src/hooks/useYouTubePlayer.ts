"use client";

import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

// Global promise so we only load the script once
let ytApiPromise: Promise<void> | null = null;

function loadYTApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  // Already loaded
  if (window.YT?.Player) return Promise.resolve();
  // Already loading
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<void>((resolve) => {
    // If YT already ready by the time we get here
    if (window.YT?.Player) { resolve(); return; }

    const existing = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (existing) existing();
      resolve();
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
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
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep latest callbacks in refs to avoid stale closures
  const onProgressRef = useRef(onProgress);
  const onDurationRef = useRef(onDuration);
  const onEndedRef = useRef(onEnded);
  const isPlayingRef = useRef(isPlaying);
  onProgressRef.current = onProgress;
  onDurationRef.current = onDuration;
  onEndedRef.current = onEnded;
  isPlayingRef.current = isPlaying;

  // Create player when videoId changes
  useEffect(() => {
    if (!videoId) return;

    let cancelled = false;
    isReadyRef.current = false;
    setIsReady(false);

    // Clear progress interval from previous track
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    loadYTApi().then(() => {
      if (cancelled || !containerRef.current) return;

      // Destroy old player
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }

      // YT.Player replaces the given element with an iframe
      // We create a fresh div each time
      const placeholder = document.createElement("div");
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(placeholder);

      playerRef.current = new window.YT.Player(placeholder, {
        videoId,
        width: "320",
        height: "180",
        playerVars: {
          autoplay: 1,
          controls: 0,
          playsinline: 1,
          enablejsapi: 1,
          rel: 0,
          fs: 0,
          modestbranding: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            if (cancelled) return;
            try {
              event.target.setVolume(Math.round(isPlayingRef.current ? volume * 100 : 0));
              const dur = event.target.getDuration();
              if (dur > 0) onDurationRef.current(dur);
            } catch (_) {}

            isReadyRef.current = true;
            setIsReady(true);

            // Start or pause based on current desired state
            try {
              if (isPlayingRef.current) {
                event.target.playVideo();
              } else {
                event.target.pauseVideo();
              }
            } catch (_) {}
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED = 0
            if (event.data === 0) {
              onEndedRef.current();
            }
          },
          onError: (event: any) => {
            console.error("[YT Player Error] code:", event.data);
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Sync play/pause with player
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

  // Progress polling
  useEffect(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = null;

    if (!isPlaying || !isReady) return;

    progressInterval.current = setInterval(() => {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== "function") return;
      try {
        const cur = player.getCurrentTime() || 0;
        const dur = player.getDuration() || 0;
        onProgressRef.current(dur > 0 ? cur / dur : 0, cur);
        if (dur > 0) onDurationRef.current(dur);
      } catch (_) {}
    }, 500);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [isPlaying, isReady]);

  // Sync volume
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    try { playerRef.current.setVolume(Math.round(volume * 100)); } catch (_) {}
  }, [volume, isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }
    };
  }, []);

  const seekTo = useCallback((fraction: number) => {
    if (!playerRef.current || !isReadyRef.current) return;
    try {
      const dur = playerRef.current.getDuration() || 0;
      if (dur > 0) playerRef.current.seekTo(fraction * dur, true);
    } catch (_) {}
  }, []);

  return { containerRef, seekTo, isReady };
}
