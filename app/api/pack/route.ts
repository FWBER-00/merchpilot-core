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

  const preview = getPreview(id);

  // ⭐ 여기만 추가된 핵심
  if (!preview) {
    return NextResponse.json({ error: "Unknown id" }, { status: 404 });
  }

  return NextResponse.json({ result: preview, locked: true }, { status: 403 });
}
