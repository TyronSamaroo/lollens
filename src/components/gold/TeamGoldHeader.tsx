import { formatGold } from "@/lib/formatters";

interface TeamGoldHeaderProps {
  blueGold: number;
  redGold: number;
}

export function TeamGoldHeader({ blueGold, redGold }: TeamGoldHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-team-blue" />
        <span className="text-team-blue text-xs font-bold font-mono">
          {formatGold(blueGold)}G
        </span>
      </div>

      <span className="text-text-muted text-[10px] uppercase tracking-wider">
        vs
      </span>

      <div className="flex items-center gap-1.5">
        <span className="text-team-red text-xs font-bold font-mono">
          {formatGold(redGold)}G
        </span>
        <div className="w-2 h-2 rounded-full bg-team-red" />
      </div>
    </div>
  );
}
