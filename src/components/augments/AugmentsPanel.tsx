import { useEffect } from "react";
import { useAugmentStore } from "@/stores/augmentStore";
import { useAugments } from "@/hooks/useAugments";
import { AugmentCard } from "./AugmentCard";
import { TierFilter } from "./TierFilter";
import { AugmentSearch } from "./AugmentSearch";
import type { AugmentTier } from "@/types/augments";

const TIER_HEADER_COLORS: Record<AugmentTier, string> = {
  S: "text-gold gold-text",
  A: "text-neon neon-text",
  B: "text-positive",
  C: "text-text-muted",
};

export function AugmentsPanel() {
  const fetchAugments = useAugmentStore((s) => s.fetchAugments);
  const isLoading = useAugmentStore((s) => s.isLoading);
  const error = useAugmentStore((s) => s.error);
  const selectedTier = useAugmentStore((s) => s.selectedTier);
  const { grouped, quickPickResults, isSearching, tierCounts, TIER_ORDER } = useAugments();

  useEffect(() => {
    fetchAugments();
  }, [fetchAugments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-text-muted text-xs pulse-neon">Loading augments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <span className="text-negative text-xs">Failed to load augments</span>
        <button
          onClick={() => {
            useAugmentStore.setState({ hasFetched: false });
            fetchAugments();
          }}
          className="text-neon text-[10px] hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // Determine the best tier among search results for the "PICK" badge
  const bestTier = isSearching && quickPickResults.length > 0
    ? quickPickResults[0].tier
    : null;

  return (
    <div className="flex flex-col gap-2">
      <AugmentSearch />

      {/* Quick Pick mode: flat results sorted by tier when searching */}
      {isSearching ? (
        <div className="flex flex-col gap-1">
          {quickPickResults.length === 0 ? (
            <div className="text-text-muted text-[10px] text-center py-4">
              No matching augments found
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-neon text-[10px] font-bold tracking-wider neon-text">
                  QUICK PICK
                </span>
                <span className="text-text-muted text-[9px]">
                  ({quickPickResults.length} match{quickPickResults.length !== 1 ? "es" : ""})
                </span>
                <div className="flex-1 h-px bg-hud-border" />
              </div>
              {quickPickResults.map((aug) => (
                <AugmentCard
                  key={aug.id}
                  augment={aug}
                  recommended={aug.tier === bestTier}
                />
              ))}
            </>
          )}
        </div>
      ) : (
        <>
          {/* Regular tier list browse mode */}
          <TierFilter counts={tierCounts} />

          <div className="flex flex-col gap-3">
            {(selectedTier === "all" ? TIER_ORDER : [selectedTier as AugmentTier]).map(
              (tier) => {
                const tierAugments = grouped[tier];
                if (tierAugments.length === 0) return null;
                return (
                  <div key={tier}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`text-xs font-bold tracking-wider ${TIER_HEADER_COLORS[tier]}`}
                      >
                        {tier} TIER
                      </span>
                      <span className="text-text-muted text-[9px]">
                        ({tierAugments.length})
                      </span>
                      <div className="flex-1 h-px bg-hud-border" />
                    </div>
                    <div className="flex flex-col gap-1">
                      {tierAugments.map((aug) => (
                        <AugmentCard key={aug.id} augment={aug} />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
    </div>
  );
}
