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
