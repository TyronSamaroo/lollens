// Data Dragon CDN base URL
export const DDRAGON_BASE = "https://ddragon.leagueoflegends.com/cdn";
export const DDRAGON_VERSIONS_URL =
  "https://ddragon.leagueoflegends.com/api/versions.json";

// Default Data Dragon version (fallback)
export const DEFAULT_DDRAGON_VERSION = "15.6.1";

// Build icon URLs
export function getItemIconUrl(version: string, itemId: number): string {
  return `${DDRAGON_BASE}/${version}/img/item/${itemId}.png`;
}

export function getChampionIconUrl(
  version: string,
  championName: string
): string {
  return `${DDRAGON_BASE}/${version}/img/champion/${championName}.png`;
}

// CommunityDragon (Arena augment data)
export const CDRAGON_ARENA_URL =
  "https://raw.communitydragon.org/latest/cdragon/arena/en_us.json";

export function getCDragonAugmentIconUrl(iconPath: string): string {
  // CDragon paths come as e.g. "ASSETS/Maps/Cherry/..." — need lowercase + .png
  const cleaned = iconPath.toLowerCase().replace(/\.tex$/, ".png");
  return `https://raw.communitydragon.org/latest/game/${cleaned}`;
}
