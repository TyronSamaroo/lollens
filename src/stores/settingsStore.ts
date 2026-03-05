import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SettingsState {
  overlayOpacity: number;
  activeTab: "stats" | "gold" | "augments";
  isCollapsed: boolean;

  setOverlayOpacity: (opacity: number) => void;
  setActiveTab: (tab: "stats" | "gold" | "augments") => void;
  toggleCollapsed: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      overlayOpacity: 0.85,
      activeTab: "stats",
      isCollapsed: false,

      setOverlayOpacity: (opacity) => set({ overlayOpacity: opacity }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: "lollens-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
