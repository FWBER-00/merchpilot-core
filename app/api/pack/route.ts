// app/api/pack/route.ts
import { NextResponse } from "next/server";
import { getFullIfPaid, getPreview } from "@/lib/packStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const full = getFullIfPaid(id);
  if (full) {
    return NextResponse.json({ result: full, locked: false });
  }

  // 결제 전이면 preview만 주거나(403)
  const preview = getPreview(id);
  return NextResponse.json({ result: preview, locked: true }, { status: 403 });
}
