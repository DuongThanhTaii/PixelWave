import { create } from "zustand";
import { socketService } from "../lib/socket";
import { Pixel } from "../lib/canvasRenderer";

export type CanvasTool = "place" | "shield" | "bomb";

interface CanvasState {
  selectedTool: CanvasTool;
  selectedColor: string;
  isConnected: boolean;
  pixels: Map<string, Pixel>;
  setTool: (tool: CanvasTool) => void;
  setColor: (color: string) => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  placePixel: (x: number, y: number, fandomId: string) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  selectedTool: "place",
  selectedColor: "#FF6B9D",
  isConnected: false,
  pixels: new Map(),

  setTool: (tool) => set({ selectedTool: tool }),
  setColor: (color) => set({ selectedColor: color }),

  connectSocket: () => {
    const socket = socketService.connect();
    
    socket.on("connect", () => set({ isConnected: true }));
    socket.on("disconnect", () => set({ isConnected: false }));
    
    socket.emit("canvas:join");

    socket.on("pixel:update", (newPixel: Pixel) => {
      set((state) => {
        const newMap = new Map(state.pixels);
        newMap.set(`${newPixel.x},${newPixel.y}`, newPixel);
        return { pixels: newMap };
      });
    });
  },

  disconnectSocket: () => {
    socketService.disconnect();
    set({ isConnected: false });
  },

  placePixel: (x: number, y: number, fandomId: string) => {
    const socket = socketService.getSocket();
    if (socket && get().isConnected) {
      socket.emit("pixel:place", {
        x,
        y,
        color: get().selectedColor,
        fandomId
      });
    }
  }
}));
