// skins/registry.ts
import type { Skin } from "./types";
import monthlySalesPackSkin from "./monthlySalesPackSkin";
import airbnbInquiryReplySkin from "./airbnbInquiryReplySkin";
import fiveStarReviewReplySkin from "./fiveStarReviewReplySkin";

const SKINS: Skin[] = [monthlySalesPackSkin,  airbnbInquiryReplySkin, fiveStarReviewReplySkin];

export function listSkins() {
  return SKINS.map((s) => ({ id: s.id, brand: s.brand }));
}

export function getSkin(id: string): Skin {
  const found = SKINS.find((s) => s.id === id);
  return found ?? monthlySalesPackSkin; // fallback
}
