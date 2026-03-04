import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useGameStore } from "@/stores/gameStore";
import type { AllGameData, ConnectionState } from "@/types/game";
import { DDRAGON_VERSIONS_URL } from "@/lib/constants";

export function useGameEvents() {
  const setGameData = useGameStore((s) => s.setGameData);
  const setConnectionState = useGameStore((s) => s.setConnectionState);
  const setDdragonVersion = useGameStore((s) => s.setDdragonVersion);

  useEffect(() => {
    // Fetch latest Data Dragon version on mount
    fetch(DDRAGON_VERSIONS_URL)
      .then((res) => res.json())
      .then((versions: string[]) => {
        if (versions.length > 0) {
          setDdragonVersion(versions[0]);
        }
      })
      .catch(() => {
        // Use default version as fallback
      });

    const unlistenGame = listen<AllGameData>("game-data-update", (event) => {
      setGameData(event.payload);
      setConnectionState("connected");
    });

    const unlistenConnection = listen<{ state: string }>(
      "connection-state",
      (event) => {
        setConnectionState(event.payload.state as ConnectionState);
      }
    );

    return () => {
      unlistenGame.then((fn) => fn());
      unlistenConnection.then((fn) => fn());
    };
  }, [setGameData, setConnectionState, setDdragonVersion]);
}
