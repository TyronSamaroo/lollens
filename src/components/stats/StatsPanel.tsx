import { usePerformanceStats } from "@/hooks/usePerformanceStats";
import { formatPerMin, formatGold, formatStat } from "@/lib/formatters";
import { StatCard } from "./StatCard";
import { KDADisplay } from "./KDADisplay";
import { ChampionStats } from "./ChampionStats";

export function StatsPanel() {
  const stats = usePerformanceStats();

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-text-muted text-sm">Waiting for data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* Performance Metrics Row */}
      <div className="grid grid-cols-3 gap-1.5">
        <StatCard
          label="CS/Min"
          value={formatPerMin(stats.csPerMin)}
          sublabel={`${stats.creepScore} CS`}
          accent="neon"
        />
        <StatCard
          label="Gold/Min"
          value={formatPerMin(stats.goldPerMin)}
          sublabel={formatGold(stats.currentGold) + "g"}
          accent="gold"
        />
        <StatCard
          label="Vision"
          value={formatStat(stats.visionScore)}
          accent="default"
        />
      </div>

      {/* KDA */}
      <KDADisplay
        kills={stats.kills}
        deaths={stats.deaths}
        assists={stats.assists}
      />

      {/* Champion Stats */}
      <ChampionStats stats={stats.championStats} />

      {/* Level */}
      <div className="flex items-center justify-center gap-2 py-1">
        <span className="text-text-muted text-xs">Level</span>
        <span className="stat-value text-sm font-bold text-neon neon-text">
          {stats.level}
        </span>
      </div>
    </div>
  );
}
