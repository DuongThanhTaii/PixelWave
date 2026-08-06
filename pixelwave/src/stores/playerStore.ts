import { create } from "zustand";
import { fetchApi } from "../lib/api";

interface ArtistData {
  id?: string;
  name: string;
  slug?: string;
  avatarUrl?: string;
}

export interface TrackData {
  id: string;
  title: string;
  artist: ArtistData;
  audioUrl?: string | null;
  youtubeVideoId?: string | null;
  coverArtUrl?: string | null;
  lyrics?: string | null;
}

interface PlayerState {
  currentTrack: TrackData | null;
  isPlaying: boolean;
  isExpanded: boolean;
  isLooping: boolean;
  volume: number;
  queue: TrackData[];
  play: (track: TrackData) => void;
  pause: () => void;
  toggleLoop: () => void;
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
  isLooping: false,
  volume: 1,
  queue: [],
  play: (track) => set({ currentTrack: track, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggleLoop: () => set((state) => ({ isLooping: !state.isLooping })),
  setVolume: (volume) => set({ volume }),
  fetchAndPlayTrack: async (trackId) => {
    try {
      // Use the public endpoint (no auth required)
      const track = await fetchApi<TrackData>(`/public/tracks/${trackId}`);
      set({ currentTrack: track, isPlaying: true });
    } catch (e) {
      console.error("Failed to fetch track", e);
    }
  },
  toggleExpand: () => set((state) => ({ isExpanded: !state.isExpanded })),
  expand: () => set({ isExpanded: true }),
  collapse: () => set({ isExpanded: false })
}));
