import { useSettingsStore } from "@/stores/settingsStore";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "stats" as const, label: "STATS" },
  { id: "gold" as const, label: "GOLD" },
] as const;

export function TabBar() {
  const activeTab = useSettingsStore((s) => s.activeTab);
  const setActiveTab = useSettingsStore((s) => s.setActiveTab);

  return (
    <div className="flex gap-1 p-1 bg-hud-bg/50 rounded">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex-1 py-1.5 px-3 text-xs font-bold tracking-wider rounded transition-all duration-200",
            activeTab === tab.id
              ? "bg-neon/15 text-neon hud-border-subtle neon-text"
              : "text-text-muted hover:text-text-secondary hover:bg-hud-surface/50"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
