import { formatGold } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface GoldDiffBarProps {
  difference: number; // Positive = blue ahead, negative = red ahead
}

export function GoldDiffBar({ difference }: GoldDiffBarProps) {
  const absDiff = Math.abs(difference);
  const blueAhead = difference >= 0;
  // Clamp the bar width to 10-90% range
  const barPercent = Math.min(90, Math.max(10, 50 + (difference / 10000) * 40));

  return (
    <div className="px-2 py-1.5">
      {/* Diff label */}
      <div className="flex items-center justify-center mb-1">
        <span
          className={cn(
            "text-xs font-bold font-mono",
            blueAhead ? "text-team-blue" : "text-team-red"
          )}
        >
          {blueAhead ? "+" : "-"}
          {formatGold(absDiff)}G
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-1.5 bg-hud-bg rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-team-blue rounded-full transition-all duration-500"
          style={{
            width: `${barPercent}%`,
            boxShadow: blueAhead
              ? "0 0 6px rgba(59, 130, 246, 0.5)"
              : "none",
          }}
        />
        <div
          className="absolute top-0 right-0 h-full bg-team-red rounded-full transition-all duration-500"
          style={{
            width: `${100 - barPercent}%`,
            boxShadow: !blueAhead
              ? "0 0 6px rgba(239, 68, 68, 0.5)"
              : "none",
          }}
        />
      </div>
    </div>
  );
}
