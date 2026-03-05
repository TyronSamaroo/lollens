import { useEffect, useRef } from "react";
import { useAugmentStore } from "@/stores/augmentStore";

interface AugmentSearchProps {
  autoFocus?: boolean;
}

export function AugmentSearch({ autoFocus = true }: AugmentSearchProps) {
  const searchQuery = useAugmentStore((s) => s.searchQuery);
  const setSearchQuery = useAugmentStore((s) => s.setSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      // Small delay to let panel render before grabbing focus
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Quick pick — type augment name..."
      className="w-full px-2.5 py-2 text-xs bg-hud-bg/60 text-text-primary placeholder-text-muted rounded hud-border-subtle focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-colors"
    />
  );
}
