// ===== Live Client Data API Types =====

export interface AllGameData {
  activePlayer: ActivePlayer;
  allPlayers: Player[];
  events: { Events: GameEvent[] };
  gameData: GameData;
}

export interface ActivePlayer {
  summonerName: string;
  level: number;
  currentGold: number;
  championStats: ChampionStats;
  abilities: Record<string, unknown>;
  fullRunes: Record<string, unknown>;
}

export interface ChampionStats {
  abilityPower: number;
  attackDamage: number;
  attackSpeed: number;
  armor: number;
  magicResist: number;
  maxHealth: number;
  currentHealth: number;
  moveSpeed: number;
  attackRange: number;
  cooldownReduction: number;
  critChance: number;
  critDamage: number;
  lifeSteal: number;
  spellVamp: number;
  tenacity: number;
  armorPenetrationFlat: number;
  armorPenetrationPercent: number;
  magicPenetrationFlat: number;
  magicPenetrationPercent: number;
  resourceType: string;
  resourceValue: number;
  resourceMax: number;
  resourceRegenRate: number;
}

export interface Player {
  summonerName: string;
  championName: string;
  rawChampionName: string;
  level: number;
  team: "ORDER" | "CHAOS";
  position: string;
  isDead: boolean;
  isBot: boolean;
  respawnTimer: number;
  skinID: number;
  items: Item[];
  scores: Scores;
  runes: Record<string, unknown>;
  summonerSpells: Record<string, unknown>;
}

export interface Item {
  canUse: boolean;
  consumable: boolean;
  count: number;
  displayName: string;
  itemID: number;
  price: number;
  rawDescription: string;
  rawDisplayName: string;
  slot: number;
}

export interface Scores {
  kills: number;
  deaths: number;
  assists: number;
  creepScore: number;
  wardScore: number;
}

export interface GameData {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
}

export interface GameEvent {
  EventID: number;
  EventName: string;
  EventTime: number;
  [key: string]: unknown;
}

// ===== Derived Types =====

export interface PlayerGoldEstimate {
  summonerName: string;
  championName: string;
  team: "ORDER" | "CHAOS";
  level: number;
  isDead: boolean;
  itemGold: number;
  currentGold?: number;
  totalEstimate: number;
  items: Item[];
  scores: Scores;
}

export interface TeamGoldSummary {
  order: {
    players: PlayerGoldEstimate[];
    totalGold: number;
  };
  chaos: {
    players: PlayerGoldEstimate[];
    totalGold: number;
  };
  goldDifference: number;
}

export interface PerformanceStats {
  csPerMin: number;
  goldPerMin: number;
  kda: number;
  visionScore: number;
  level: number;
  gameTimeMinutes: number;
  kills: number;
  deaths: number;
  assists: number;
  creepScore: number;
  currentGold: number;
  championStats: ChampionStats;
}

export type ConnectionState = "disconnected" | "searching" | "connected";
