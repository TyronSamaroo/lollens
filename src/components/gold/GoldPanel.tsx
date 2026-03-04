import { useGoldCalculation } from "@/hooks/useGoldCalculation";
import { TeamGoldHeader } from "./TeamGoldHeader";
import { GoldDiffBar } from "./GoldDiffBar";
import { TeamColumn } from "./TeamColumn";

export function GoldPanel() {
  const goldData = useGoldCalculation();

  if (!goldData) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="text-text-muted text-sm">Waiting for data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 mt-1">
      {/* Team Gold Totals */}
      <div className="hud-border-subtle bg-hud-surface/40 rounded">
        <TeamGoldHeader
          blueGold={goldData.order.totalGold}
          redGold={goldData.chaos.totalGold}
        />
        <GoldDiffBar difference={goldData.goldDifference} />
      </div>

      {/* Blue Team */}
      <div className="hud-border-subtle bg-hud-surface/40 rounded p-1">
        <div className="flex items-center gap-1.5 px-1.5 pb-1 mb-0.5 border-b border-hud-border">
          <div className="w-1.5 h-1.5 rounded-full bg-team-blue" />
          <span className="text-team-blue text-[10px] uppercase tracking-wider font-bold">
            Blue Team
          </span>
        </div>
        <TeamColumn players={goldData.order.players} />
      </div>

      {/* Red Team */}
      <div className="hud-border-subtle bg-hud-surface/40 rounded p-1">
        <div className="flex items-center gap-1.5 px-1.5 pb-1 mb-0.5 border-b border-hud-border">
          <div className="w-1.5 h-1.5 rounded-full bg-team-red" />
          <span className="text-team-red text-[10px] uppercase tracking-wider font-bold">
            Red Team
          </span>
        </div>
        <TeamColumn players={goldData.chaos.players} />
      </div>
    </div>
  );
}
