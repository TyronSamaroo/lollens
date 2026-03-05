// Augment tier rankings (community-curated)
export type AugmentTier = "S" | "A" | "B" | "C";

// Rarity from CommunityDragon API (0=Silver, 1=Gold, 2=Prismatic)
export type AugmentRarity = 0 | 1 | 2;

export const RARITY_LABELS: Record<AugmentRarity, string> = {
  0: "Silver",
  1: "Gold",
  2: "Prismatic",
};

export interface CDragonAugment {
  id: number;
  apiName: string;
  name: string;
  desc: string;
  rarity: AugmentRarity;
  iconSmall: string;
  iconLarge: string;
}

export interface Augment extends CDragonAugment {
  tier: AugmentTier | null; // null = unranked
}

export type TierListData = Record<AugmentTier, string[]>; // tier -> apiName[]
