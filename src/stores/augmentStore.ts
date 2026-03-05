import { create } from "zustand";
import type { Augment, AugmentTier, CDragonAugment } from "@/types/augments";
import { CDRAGON_ARENA_URL } from "@/lib/constants";
import tierData from "@/data/augment-tiers.json";

// Build a reverse lookup: apiName -> tier
const apiNameToTier: Record<string, AugmentTier> = {};
for (const [tier, names] of Object.entries(tierData)) {
  for (const name of names) {
    apiNameToTier[name] = tier as AugmentTier;
  }
}

interface AugmentState {
  augments: Augment[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  selectedTier: AugmentTier | "all";
  searchQuery: string;

  fetchAugments: () => Promise<void>;
  setSelectedTier: (tier: AugmentTier | "all") => void;
  setSearchQuery: (query: string) => void;
}

export const useAugmentStore = create<AugmentState>()((set, get) => ({
  augments: [],
  isLoading: false,
  error: null,
  hasFetched: false,
  selectedTier: "all",
  searchQuery: "",

  fetchAugments: async () => {
    if (get().hasFetched || get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const res = await fetch(CDRAGON_ARENA_URL);
      if (!res.ok) throw new Error(`CDN fetch failed: ${res.status}`);
      const data = await res.json();

      const raw: CDragonAugment[] = data.augments ?? [];
      const augments: Augment[] = raw.map((a) => ({
        ...a,
        tier: apiNameToTier[a.apiName] ?? null,
      }));

      set({ augments, isLoading: false, hasFetched: true });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to load augments",
        isLoading: false,
      });
    }
  },

  setSelectedTier: (tier) => set({ selectedTier: tier }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
