// lib/packStore.ts
import crypto from "node:crypto";

type PackRecord = {
  fullJson: string;    // 결제 후 보여줄 전체 JSON(string)
  previewJson: string; // 결제 전 보여줄 잠긴 프리뷰 JSON(string)
  paid: boolean;
  createdAt: number;
};

// 로컬 테스트용: 메모리 저장 (지금 단계에서 가장 간단)
// ⚠️ 배포(Vercel)에선 영구 저장이 아니므로, 결제 붙이기 전에 DB로 교체할 예정
const store = new Map<string, PackRecord>();

export function createPack(fullJson: string, previewJson: string) {
  const id = crypto.randomUUID();
  store.set(id, { fullJson, previewJson, paid: false, createdAt: Date.now() });
  return id;
}

export function getPreview(id: string) {
  return store.get(id)?.previewJson ?? null;
}

export function getFullIfPaid(id: string) {
  const rec = store.get(id);
  if (!rec || !rec.paid) return null;
  return rec.fullJson;
}

export function markPaid(id: string) {
  const rec = store.get(id);
  if (!rec) return false;
  rec.paid = true;
  store.set(id, rec);
  return true;
}
