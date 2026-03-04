import type { PlayerGoldEstimate } from "@/types/game";
import { useGameStore } from "@/stores/gameStore";
import { getChampionIconUrl } from "@/lib/constants";
import { formatGoldCompact } from "@/lib/formatters";
import { ItemIcon } from "./ItemIcon";
import { cn } from "@/lib/utils";

interface PlayerRowProps {
  player: PlayerGoldEstimate;
  isActivePlayer: boolean;
}

export function PlayerRow({ player, isActivePlayer }: PlayerRowProps) {
  const version = useGameStore((s) => s.ddragonVersion);
  const { kills, deaths, assists } = player.scores;

  // Pad items to 6 slots
  const itemSlots = Array.from({ length: 6 }, (_, i) =>
    player.items.find((item) => item.slot === i)
  );

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-1.5 py-1 rounded transition-colors",
        isActivePlayer && "bg-neon/5 hud-border-subtle",
        player.isDead && "opacity-50"
      )}
    >
      {/* Champion Icon */}
      <img
        src={getChampionIconUrl(version, player.championName)}
        alt={player.championName}
        width={28}
        height={28}
        className="rounded-sm border border-hud-border flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      {/* Items */}
      <div className="flex gap-0.5 flex-shrink-0">
        {itemSlots.map((item, i) => (
          <ItemIcon key={i} itemId={item?.itemID ?? 0} size={20} />
        ))}
      </div>

      {/* Gold + KDA */}
      <div className="flex flex-col items-end ml-auto min-w-0">
        <span className="gold-text text-xs font-bold font-mono leading-tight">
          {formatGoldCompact(player.totalEstimate)}
        </span>
        <span className="text-text-muted text-[9px] font-mono leading-tight">
          {kills}/{deaths}/{assists}
        </span>
      </div>
    </div>
  );
}
