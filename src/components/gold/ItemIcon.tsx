import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { getItemIconUrl } from "@/lib/constants";

interface ItemIconProps {
  itemId: number;
  size?: number;
}

export function ItemIcon({ itemId, size = 24 }: ItemIconProps) {
  const version = useGameStore((s) => s.ddragonVersion);
  const [error, setError] = useState(false);

  if (itemId === 0 || error) {
    return (
      <div
        className="bg-hud-bg/80 border border-hud-border rounded-sm"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={getItemIconUrl(version, itemId)}
      alt=""
      width={size}
      height={size}
      className="rounded-sm"
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
