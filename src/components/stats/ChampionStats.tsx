import type { ChampionStats as ChampionStatsType } from "@/types/game";
import { formatStat } from "@/lib/formatters";

interface ChampionStatsProps {
  stats: ChampionStatsType;
}

const statConfig = [
  { key: "attackDamage" as const, label: "AD", color: "text-orange-400" },
  { key: "abilityPower" as const, label: "AP", color: "text-blue-400" },
  { key: "armor" as const, label: "ARM", color: "text-yellow-500" },
  { key: "magicResist" as const, label: "MR", color: "text-purple-400" },
  { key: "attackSpeed" as const, label: "AS", color: "text-text-secondary" },
  { key: "moveSpeed" as const, label: "MS", color: "text-text-secondary" },
] as const;

export function ChampionStats({ stats }: ChampionStatsProps) {
  return (
    <div className="hud-border-subtle bg-hud-surface/40 rounded p-2">
      <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium block mb-1.5 text-center">
        Champion Stats
      </span>
      <div className="grid grid-cols-3 gap-x-3 gap-y-1">
        {statConfig.map(({ key, label, color }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-text-muted text-[10px]">{label}</span>
            <span className={`stat-value text-xs font-bold ${color}`}>
              {formatStat(stats[key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
