// app/api/dev-unlock/route.ts
import { NextResponse } from "next/server";
import { markPaid } from "@/lib/packStore";

export async function POST(req: Request) {
  const body = await req.json();
  const { packId, secret } = body;

  if (!packId) {
    return NextResponse.json({ error: "Missing packId" }, { status: 400 });
  }

  // 로컬에서만 사용할 비밀키 (.env.local)
  if (!process.env.DEV_UNLOCK_SECRET || secret !== process.env.DEV_UNLOCK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ok = markPaid(packId);
  return NextResponse.json({ ok });
}
