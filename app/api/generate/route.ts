// app/api/generate/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createPack } from "@/lib/packStore";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function makePreview(fullText: string) {
  // 결제 전 프리뷰: product_name만 보여주고 나머지는 잠금
  try {
    const obj = JSON.parse(fullText);

    const preview = {
      pack_title: obj.pack_title ?? "Monthly Sales Pack",
      winners: (obj.winners ?? []).map((w: any) => ({
        product_name: w.product_name ?? "Unknown product",
        positioning: "🔒 Unlock to view",
        why_it_works: ["🔒", "🔒", "🔒"],
        ad_hooks: ["🔒", "🔒", "🔒"],
        landing_headline: "🔒 Unlock to view",
        feature_bullets: ["🔒", "🔒", "🔒", "🔒", "🔒"],
        pricing: { anchor: "🔒", sale: "🔒", bundle: "🔒" },
        supplier_search: {
          keywords: ["🔒", "🔒", "🔒"],
          specs: ["🔒", "🔒", "🔒"],
        },
        risk_notes: ["🔒", "🔒"],
      })),
    };

    return JSON.stringify(preview);
  } catch {
    // JSON 파싱이 깨지면, 최소 프리뷰로 반환
    return JSON.stringify({
      pack_title: "Monthly Sales Pack",
      winners: [
        {
          product_name: "🔒 Unlock to view",
          positioning: "🔒 Unlock to view",
          why_it_works: ["🔒", "🔒", "🔒"],
          ad_hooks: ["🔒", "🔒", "🔒"],
          landing_headline: "🔒 Unlock to view",
          feature_bullets: ["🔒", "🔒", "🔒", "🔒", "🔒"],
          pricing: { anchor: "🔒", sale: "🔒", bundle: "🔒" },
          supplier_search: { keywords: ["🔒", "🔒", "🔒"], specs: ["🔒", "🔒", "🔒"] },
          risk_notes: ["🔒", "🔒"],
        },
      ],
    });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { market, category, price, channel } = body;

  const prompt = `
You are a senior dropshipping operator.
Write in clear, specific, non-hype business language.
Do NOT mention that you are an AI.

Create a "Monthly Sales Pack" for:
Market: ${market}
Category: ${category}
Price Range: ${price}
Ad Channel: ${channel}

Return ONLY valid JSON (no markdown, no backticks).
Schema:
{
  "pack_title": string,
  "winners": [
    {
      "product_name": string,
      "positioning": string,
      "why_it_works": [string, string, string],
      "ad_hooks": [string, string, string],
      "landing_headline": string,
      "feature_bullets": [string, string, string, string, string],
      "pricing": { "anchor": string, "sale": string, "bundle": string },
      "supplier_search": { "keywords": [string, string, string], "specs": [string, string, string] },
      "risk_notes": [string, string]
    }
  ]
}

Rules:
- Provide exactly 3 winners.
- Make product ideas realistic for ${price} and ${channel}.
- Avoid vague claims like "viral", "high demand" unless you give a concrete reason.
- Hooks must be short (max 12 words each).
- "supplier_search" must be keywords/specs, not direct store links.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const full = String(completion.choices[0].message.content ?? "");
  const preview = makePreview(full);

  // 서버에 full+preview 저장 (결제 전에는 full을 절대 내려주지 않음)
  const packId = createPack(full, preview);

  return NextResponse.json({
    packId,
    result: preview, // 프론트는 기존처럼 data.result를 raw로 받아서 렌더
    locked: true,
  });
}
