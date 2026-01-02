// app/api/dev-unlock/route.ts
import { NextResponse } from "next/server";
import { markPaid } from "@/lib/packStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const packId = String(body?.packId ?? "");
  const secret = String(body?.secret ?? "");

  if (!packId) {
    return NextResponse.json(
      { ok: false, error: "Missing packId" },
      { status: 400 }
    );
  }

  // ✅ 항상 비번 검사 (환경 구분 없음)
  const serverSecret = String(process.env.DEV_UNLOCK_SECRET ?? "");
  if (!serverSecret || secret !== serverSecret) {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const ok = markPaid(packId);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Unknown packId" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
