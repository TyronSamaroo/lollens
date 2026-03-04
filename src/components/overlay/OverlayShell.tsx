import { getCurrentWindow } from "@tauri-apps/api/window";
import { useGameStore } from "@/stores/gameStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { ConnectionStatus } from "./ConnectionStatus";
import { TabBar } from "./TabBar";
import { StatsPanel } from "@/components/stats/StatsPanel";
import { GoldPanel } from "@/components/gold/GoldPanel";
import { formatGameTime } from "@/lib/formatters";

export function OverlayShell() {
  const connectionState = useGameStore((s) => s.connectionState);
  const gameData = useGameStore((s) => s.gameData);
  const overlayOpacity = useSettingsStore((s) => s.overlayOpacity);
  const activeTab = useSettingsStore((s) => s.activeTab);
  const isCollapsed = useSettingsStore((s) => s.isCollapsed);
  const toggleCollapsed = useSettingsStore((s) => s.toggleCollapsed);

  const handleDrag = () => {
    getCurrentWindow().startDragging();
  };

  return (
    <div
      className="w-full h-full p-1"
      style={{ opacity: overlayOpacity }}
    >
      <div className="hud-border scanlines bg-hud-bg/90 rounded-lg overflow-hidden flex flex-col h-full">
        {/* Header / Drag Handle */}
        <div
          onMouseDown={handleDrag}
          className="drag-region flex items-center justify-between px-3 py-2 bg-hud-surface/60 border-b border-hud-border"
        >
          <div className="flex items-center gap-2">
            <span className="text-neon text-xs font-bold tracking-widest neon-text">
              LOLLENS
            </span>
            {connectionState === "connected" && (
              <span className="w-1.5 h-1.5 rounded-full bg-positive" />
            )}
          </div>

          <div className="flex items-center gap-2">
            {gameData && (
              <span className="text-text-muted text-xs font-mono">
                {formatGameTime(gameData.gameData.gameTime)}
              </span>
            )}
            <button
              onClick={toggleCollapsed}
              className="text-text-muted hover:text-text-secondary text-xs px-1 transition-colors"
            >
              {isCollapsed ? "+" : "−"}
            </button>
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {connectionState !== "connected" ? (
              <ConnectionStatus />
            ) : (
              <>
                <div className="px-2 pt-2">
                  <TabBar />
                </div>
                <div className="flex-1 overflow-y-auto px-2 pb-2 pt-1">
                  {activeTab === "stats" ? <StatsPanel /> : <GoldPanel />}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
