import { formatKDA } from "@/lib/formatters";

interface KDADisplayProps {
  kills: number;
  deaths: number;
  assists: number;
}

export function KDADisplay({ kills, deaths, assists }: KDADisplayProps) {
  const ratio = formatKDA(kills, deaths, assists);

  return (
    <div className="hud-border-subtle bg-hud-surface/40 rounded px-3 py-2 flex flex-col items-center">
      <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium">
        KDA
      </span>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="stat-value text-lg font-bold text-positive">
          {kills}
        </span>
        <span className="text-text-muted text-sm">/</span>
        <span className="stat-value text-lg font-bold text-negative">
          {deaths}
        </span>
        <span className="text-text-muted text-sm">/</span>
        <span className="stat-value text-lg font-bold text-neon">
          {assists}
        </span>
      </div>
      <span className="text-text-secondary text-xs font-mono mt-0.5">
        {ratio}
        {ratio !== "Perfect" && " KDA"}
      </span>
    </div>
  );
}
