import { create } from "zustand";
import { fetchApi } from "../lib/api";

interface TrackData {
  id: string;
  title: string;
  artist: { name: string };
  audioUrl?: string;
  youtubeVideoId?: string;
  coverArtUrl?: string;
  lyrics?: string;
}

interface PlayerState {
  currentTrack: TrackData | null;
  isPlaying: boolean;
  isExpanded: boolean;
  volume: number;
  queue: TrackData[];
  play: (track: TrackData) => void;
  pause: () => void;
  setVolume: (vol: number) => void;
  fetchAndPlayTrack: (trackId: string) => Promise<void>;
  toggleExpand: () => void;
  expand: () => void;
  collapse: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  isExpanded: false,
  volume: 1,
  queue: [],
  play: (track) => set({ currentTrack: track, isPlaying: true, isExpanded: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume }),
  fetchAndPlayTrack: async (trackId) => {
    try {
      const track = await fetchApi<TrackData>(`/tracks/${trackId}`);
      set({ currentTrack: track, isPlaying: true, isExpanded: true });
    } catch (e) {
      console.error("Failed to fetch track", e);
    }
  },
  toggleExpand: () => set((state) => ({ isExpanded: !state.isExpanded })),
  expand: () => set({ isExpanded: true }),
  collapse: () => set({ isExpanded: false })
}));
