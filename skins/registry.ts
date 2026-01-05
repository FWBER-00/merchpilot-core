// skins/registry.ts
import type { Skin } from "./types";
import emailSequencePackSkin from "./emailSequencePackSkin";
import socialMediaPackSkin from "./socialMediaPackSkin";  // ✅ 추가
import reviewResponseSkin from "./reviewResponseSkin";  // ✅ 추가

const SKINS: Skin[] = [
  emailSequencePackSkin,
  socialMediaPackSkin,
  reviewResponseSkin,  // ✅ 추가
];

export function listSkins() {
  return SKINS.map((s) => ({ id: s.id, brand: s.brand }));
}

export function getSkin(id: string): Skin {
  const found = SKINS.find((s) => s.id === id);
  return found ?? emailSequencePackSkin;
}