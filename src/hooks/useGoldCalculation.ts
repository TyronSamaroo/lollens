import { useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";
import type { TeamGoldSummary, PlayerGoldEstimate } from "@/types/game";

export function useGoldCalculation(): TeamGoldSummary | null {
  const gameData = useGameStore((s) => s.gameData);

  return useMemo(() => {
    if (!gameData) return null;

    const activeName = gameData.activePlayer.summonerName;

    const estimatePlayer = (
      player: (typeof gameData.allPlayers)[0]
    ): PlayerGoldEstimate => {
      const itemGold = player.items.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      );
      const isActive = player.summonerName === activeName;
      const currentGold = isActive
        ? gameData.activePlayer.currentGold
        : undefined;

      return {
        summonerName: player.summonerName,
        championName: player.championName,
        team: player.team,
        level: player.level,
        isDead: player.isDead,
        itemGold,
        currentGold,
        totalEstimate: itemGold + (currentGold ?? 0),
        items: player.items,
        scores: player.scores,
      };
    };

    const orderPlayers = gameData.allPlayers
      .filter((p) => p.team === "ORDER")
      .map(estimatePlayer);

    const chaosPlayers = gameData.allPlayers
      .filter((p) => p.team === "CHAOS")
      .map(estimatePlayer);

    const orderTotal = orderPlayers.reduce((s, p) => s + p.totalEstimate, 0);
    const chaosTotal = chaosPlayers.reduce((s, p) => s + p.totalEstimate, 0);

    return {
      order: { players: orderPlayers, totalGold: orderTotal },
      chaos: { players: chaosPlayers, totalGold: chaosTotal },
      goldDifference: orderTotal - chaosTotal,
    };
  }, [gameData]);
}
