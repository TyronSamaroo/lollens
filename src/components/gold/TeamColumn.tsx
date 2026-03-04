import type { PlayerGoldEstimate } from "@/types/game";
import { useGameStore } from "@/stores/gameStore";
import { PlayerRow } from "./PlayerRow";

interface TeamColumnProps {
  players: PlayerGoldEstimate[];
}

export function TeamColumn({ players }: TeamColumnProps) {
  const activePlayerName = useGameStore(
    (s) => s.gameData?.activePlayer.summonerName
  );

  return (
    <div className="flex flex-col gap-0.5">
      {players.map((player) => (
        <PlayerRow
          key={player.summonerName}
          player={player}
          isActivePlayer={player.summonerName === activePlayerName}
        />
      ))}
    </div>
  );
}
