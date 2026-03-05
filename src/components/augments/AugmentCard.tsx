import { cn } from "@/lib/utils";
import { getCDragonAugmentIconUrl } from "@/lib/constants";
import type { Augment, AugmentTier } from "@/types/augments";
import { RARITY_LABELS } from "@/types/augments";

const TIER_COLORS: Record<AugmentTier, string> = {
  S: "text-gold gold-text bg-gold/10 border-gold/30",
  A: "text-neon neon-text bg-neon/10 border-neon/30",
  B: "text-positive bg-positive/10 border-positive/30",
  C: "text-text-muted bg-hud-surface/50 border-hud-border",
};

interface AugmentCardProps {
  augment: Augment;
  recommended?: boolean;
}

export function AugmentCard({ augment, recommended }: AugmentCardProps) {
  // Strip HTML-like tags from description
  const cleanDesc = augment.desc
    .replace(/<[^>]*>/g, "")
    .replace(/@[^@]*@/g, "?");

  return (
    <div className={cn(
      "flex items-start gap-2 p-2 rounded",
      recommended
        ? "hud-border-subtle bg-neon/5 ring-1 ring-neon/30"
        : "hud-border-subtle bg-hud-surface/40"
    )}>
      <img
        src={getCDragonAugmentIconUrl(augment.iconSmall)}
        alt={augment.name}
        className="w-8 h-8 rounded flex-shrink-0 bg-hud-bg/50"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-text-primary text-xs font-semibold truncate">
            {augment.name}
          </span>
          {augment.tier && (
            <span
              className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0",
                TIER_COLORS[augment.tier]
              )}
            >
              {augment.tier}
            </span>
          )}
          <span className="text-text-muted text-[9px] flex-shrink-0">
            {RARITY_LABELS[augment.rarity]}
          </span>
          {recommended && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-neon/20 text-neon neon-text border border-neon/40 flex-shrink-0">
              PICK
            </span>
          )}
        </div>
        <p className="text-text-muted text-[10px] leading-tight mt-0.5 line-clamp-2">
          {cleanDesc}
        </p>
      </div>
    </div>
  );
}
