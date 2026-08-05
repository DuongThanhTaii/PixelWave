import { create } from "zustand";

interface WarState {
  activeWarId: string | null;
  scores: Record<string, number>;
  setActiveWar: (warId: string) => void;
  updateScore: (fandomId: string, score: number) => void;
}

export const useWarStore = create<WarState>((set) => ({
  activeWarId: null,
  scores: {},
  setActiveWar: (activeWarId) => set({ activeWarId }),
  updateScore: (fandomId, score) =>
    set((state) => ({
      scores: { ...state.scores, [fandomId]: score },
    })),
}));
