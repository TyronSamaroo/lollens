import { cn } from "@/lib/utils";
import { useAugmentStore } from "@/stores/augmentStore";
import type { AugmentTier } from "@/types/augments";

const TIERS: Array<{ id: AugmentTier | "all"; label: string }> = [
  { id: "all", label: "ALL" },
  { id: "S", label: "S" },
  { id: "A", label: "A" },
  { id: "B", label: "B" },
  { id: "C", label: "C" },
];

const TIER_ACTIVE_STYLES: Record<string, string> = {
  all: "bg-neon/15 text-neon",
  S: "bg-gold/15 text-gold",
  A: "bg-neon/15 text-neon",
  B: "bg-positive/15 text-positive",
  C: "bg-hud-surface text-text-secondary",
};

interface TierFilterProps {
  counts: Record<AugmentTier, number>;
}

export function TierFilter({ counts }: TierFilterProps) {
  const selectedTier = useAugmentStore((s) => s.selectedTier);
  const setSelectedTier = useAugmentStore((s) => s.setSelectedTier);

  const total = counts.S + counts.A + counts.B + counts.C;

  return (
    <div className="flex gap-1">
      {TIERS.map((tier) => {
        const count = tier.id === "all" ? total : counts[tier.id];
        const isActive = selectedTier === tier.id;
        return (
          <button
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={cn(
              "flex-1 py-1 text-[10px] font-bold tracking-wider rounded transition-all duration-200",
              isActive
                ? TIER_ACTIVE_STYLES[tier.id]
                : "text-text-muted hover:text-text-secondary hover:bg-hud-surface/50"
            )}
          >
            {tier.label}
            <span className="text-[8px] ml-0.5 opacity-60">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
