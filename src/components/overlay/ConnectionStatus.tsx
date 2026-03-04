import { useGameStore } from "@/stores/gameStore";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const connectionState = useGameStore((s) => s.connectionState);

  if (connectionState === "connected") return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className={cn(
          "w-3 h-3 rounded-full mb-3",
          connectionState === "searching"
            ? "bg-neon pulse-neon"
            : "bg-text-muted"
        )}
      />
      <p className="text-text-secondary text-sm font-medium">
        {connectionState === "searching"
          ? "Searching for game..."
          : "Disconnected"}
      </p>
      <p className="text-text-muted text-xs mt-1">
        Start a game to see live data
      </p>
    </div>
  );
}
