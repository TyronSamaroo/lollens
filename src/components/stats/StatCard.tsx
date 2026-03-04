import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  accent?: "neon" | "gold" | "default";
}

export function StatCard({ label, value, sublabel, accent = "default" }: StatCardProps) {
  return (
    <div className="hud-border-subtle bg-hud-surface/40 rounded px-2.5 py-2 flex flex-col items-center">
      <span className="text-text-muted text-[10px] uppercase tracking-wider font-medium">
        {label}
      </span>
      <span
        className={cn(
          "stat-value text-lg font-bold leading-tight",
          accent === "neon" && "text-neon neon-text",
          accent === "gold" && "gold-text",
          accent === "default" && "text-text-primary"
        )}
      >
        {value}
      </span>
      {sublabel && (
        <span className="text-text-muted text-[10px] mt-0.5">{sublabel}</span>
      )}
    </div>
  );
}
