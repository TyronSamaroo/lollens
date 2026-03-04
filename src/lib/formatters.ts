/** Format a number with 1 decimal place: 6.8, 371.6 */
export function formatStat(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value % 1 === 0 ? value.toString() : value.toFixed(1);
}

/** Format gold: 1234 -> "1,234" */
export function formatGold(value: number): string {
  return Math.round(value).toLocaleString();
}

/** Format gold with compact notation: 12400 -> "12.4k" */
export function formatGoldCompact(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return Math.round(value).toString();
}

/** Format game time: seconds -> "12:34" */
export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Format KDA ratio: (K+A)/D */
export function formatKDA(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) return "Perfect";
  return ((kills + assists) / deaths).toFixed(2);
}

/** Format per-minute stat */
export function formatPerMin(value: number): string {
  return value.toFixed(1);
}
