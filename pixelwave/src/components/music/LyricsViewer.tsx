import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface LyricsViewerProps {
  lyricsRaw: string;
  currentTime: number; // in seconds
}

interface LyricLine {
  startTime: number;
  endTime?: number;
  text: string;
}

function parseLyrics(raw: string): LyricLine[] {
  const lines: LyricLine[] = [];
  
  // Try to guess format
  if (raw.includes('-->')) {
    // SRT format
    const blocks = raw.split(/\n\s*\n/);
    for (const block of blocks) {
      const parts = block.trim().split('\n');
      if (parts.length >= 3) {
        const timeLine = parts[1];
        const textLines = parts.slice(2).join('\n');
        
        const [startStr, endStr] = timeLine.split(' --> ');
        if (startStr) {
          const startTime = parseSrtTime(startStr);
          lines.push({ startTime, text: textLines });
        }
      }
    }
  } else {
    // Try LRC format
    const lrcLines = raw.split('\n');
    for (const line of lrcLines) {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (match) {
        const min = parseInt(match[1], 10);
        const sec = parseInt(match[2], 10);
        const ms = parseInt(match[3], 10);
        // if ms is 2 digits, it's hundredths. If 3, it's thousandths.
        const msFactor = match[3].length === 2 ? 10 : 1;
        const startTime = min * 60 + sec + (ms * msFactor) / 1000;
        lines.push({ startTime, text: match[4].trim() });
      } else if (line.trim()) {
        // Plain text fallback (no timestamp)
        lines.push({ startTime: 0, text: line.trim() });
      }
    }
  }
  
  // Sort by time just in case
  lines.sort((a, b) => a.startTime - b.startTime);
  return lines;
}

function parseSrtTime(timeStr: string): number {
  // Format: HH:MM:SS,mmm
  const parts = timeStr.replace(',', '.').split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]);
    const mins = parseFloat(parts[1]);
    const secs = parseFloat(parts[2]);
    return hours * 3600 + mins * 60 + secs;
  }
  return 0;
}

export function LyricsViewer({ lyricsRaw, currentTime }: LyricsViewerProps) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lyricsRaw) {
      setLyrics(parseLyrics(lyricsRaw));
    }
  }, [lyricsRaw]);

  // Find active line
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].startTime) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Scroll active line into view
  useEffect(() => {
    if (activeIndex >= 0 && containerRef.current) {
      const activeEl = containerRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  if (!lyricsRaw) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h2 className="font-display font-black text-4xl text-gray-500 uppercase">No Lyrics</h2>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-y-auto hide-scrollbar flex flex-col gap-6 py-[50vh] px-8 md:px-16"
    >
      {lyrics.map((line, idx) => {
        const isActive = idx === activeIndex;
        const isPast = idx < activeIndex;

        return (
          <p 
            key={idx} 
            data-index={idx}
            className={cn(
              "font-display font-black text-3xl md:text-5xl transition-all duration-500",
              isActive ? "text-white scale-105 origin-left" : 
              isPast ? "text-gray-600 scale-100 origin-left" : 
              "text-gray-400 scale-100 origin-left hover:text-gray-300 cursor-pointer"
            )}
          >
            {line.text || "♪"}
          </p>
        );
      })}
    </div>
  );
}
