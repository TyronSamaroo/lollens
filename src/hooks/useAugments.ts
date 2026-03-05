import { useMemo } from "react";
import { useAugmentStore } from "@/stores/augmentStore";
import { useGameStore } from "@/stores/gameStore";
import type { Augment, AugmentTier } from "@/types/augments";

const TIER_ORDER: AugmentTier[] = ["S", "A", "B", "C"];

export function useAugments() {
  const augments = useAugmentStore((s) => s.augments);
  const selectedTier = useAugmentStore((s) => s.selectedTier);
  const searchQuery = useAugmentStore((s) => s.searchQuery);
  const gameData = useGameStore((s) => s.gameData);

  const isArenaMode = gameData?.gameData.gameMode === "CHERRY";

  const isSearching = searchQuery.trim().length > 0;

  const filtered = useMemo(() => {
    let list = augments;

    // Only show ranked augments (with a tier)
    list = list.filter((a) => a.tier !== null);

    if (selectedTier !== "all") {
      list = list.filter((a) => a.tier === selectedTier);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }

    return list;
  }, [augments, selectedTier, searchQuery]);

  // Quick Pick: flat list sorted by tier (S first) for fast comparison
  const quickPickResults = useMemo(() => {
    if (!isSearching) return [];
    const tierRank: Record<AugmentTier, number> = { S: 0, A: 1, B: 2, C: 3 };
    return [...filtered].sort((a, b) => {
      const ra = a.tier ? tierRank[a.tier] : 99;
      const rb = b.tier ? tierRank[b.tier] : 99;
      return ra - rb;
    });
  }, [filtered, isSearching]);

  const grouped = useMemo(() => {
    const groups: Record<AugmentTier, Augment[]> = { S: [], A: [], B: [], C: [] };
    for (const aug of filtered) {
      if (aug.tier) groups[aug.tier].push(aug);
    }
    // Sort within each tier by name
    for (const tier of TIER_ORDER) {
      groups[tier].sort((a, b) => a.name.localeCompare(b.name));
    }
    return groups;
  }, [filtered]);

  const tierCounts = useMemo(() => {
    const counts: Record<AugmentTier, number> = { S: 0, A: 0, B: 0, C: 0 };
    for (const a of augments) {
      if (a.tier) counts[a.tier]++;
    }
    return counts;
  }, [augments]);

  return { filtered, grouped, quickPickResults, isSearching, tierCounts, isArenaMode, TIER_ORDER };
}
