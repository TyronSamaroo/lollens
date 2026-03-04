import { create } from "zustand";
import type { AllGameData, ConnectionState } from "@/types/game";

interface GameState {
  gameData: AllGameData | null;
  connectionState: ConnectionState;
  ddragonVersion: string;

  setGameData: (data: AllGameData) => void;
  setConnectionState: (state: ConnectionState) => void;
  setDdragonVersion: (version: string) => void;
  clearGameData: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameData: null,
  connectionState: "searching",
  ddragonVersion: "15.6.1",

  setGameData: (data) => set({ gameData: data }),

  setConnectionState: (state) => {
    set({ connectionState: state });
    if (state !== "connected") {
      set({ gameData: null });
    }
  },

  setDdragonVersion: (version) => set({ ddragonVersion: version }),

  clearGameData: () => set({ gameData: null }),
}));
