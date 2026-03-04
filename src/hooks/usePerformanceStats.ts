import { useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";
import type { PerformanceStats } from "@/types/game";

export function usePerformanceStats(): PerformanceStats | null {
  const gameData = useGameStore((s) => s.gameData);

  return useMemo(() => {
    if (!gameData) return null;

    const { activePlayer, allPlayers, gameData: gd } = gameData;
    const gameMinutes = gd.gameTime / 60;
    if (gameMinutes < 0.1) return null;

    const me = allPlayers.find(
      (p) => p.summonerName === activePlayer.summonerName
    );
    if (!me) return null;

    const { kills, deaths, assists, creepScore, wardScore } = me.scores;

    return {
      csPerMin: creepScore / gameMinutes,
      goldPerMin: activePlayer.currentGold / gameMinutes,
      kda:
        deaths === 0
          ? kills + assists
          : (kills + assists) / deaths,
      visionScore: wardScore,
      level: activePlayer.level,
      gameTimeMinutes: gameMinutes,
      kills,
      deaths,
      assists,
      creepScore,
      currentGold: activePlayer.currentGold,
      championStats: activePlayer.championStats,
    };
  }, [gameData]);
}
