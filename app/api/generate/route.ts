// app/api/generate/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createPack } from "@/lib/packStore";
import { getSkin } from "@/skins/registry";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values?.[key] ?? ""));
}

function makePreview(fullText: string) {
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
          supplier_search: {
            keywords: ["🔒", "🔒", "🔒"],
            specs: ["🔒", "🔒", "🔒"],
          },
          risk_notes: ["🔒", "🔒"],
        },
      ],
    });
  }
}

const OUTPUT_SCHEMA_AND_RULES = `
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
- Avoid vague claims like "viral", "high demand" unless you give a concrete reason.
- Hooks must be short (max 12 words each).
- "supplier_search" must be keywords/specs, not direct store links.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const skinId = String(body?.skinId ?? "");
    const values = (body?.values ?? {}) as Record<string, string>;

    // ✅ 하위호환: 기존 body({market,category,price,channel})로도 들어오면 values로 변환
    if (!skinId) {
      const maybe = body as any;
      const legacyValues: Record<string, string> = {
        market: String(maybe?.market ?? ""),
        category: String(maybe?.category ?? ""),
        price: String(maybe?.price ?? ""),
        channel: String(maybe?.channel ?? ""),
      };
      const legacySkin = getSkin("monthly-sales-pack");

      for (const input of legacySkin.inputs) {
        const v = String(legacyValues[input.key] ?? "").trim();
        if (!v) {
          return NextResponse.json(
            { error: `Missing input: ${input.key}` },
            { status: 400 }
          );
        }
      }

      const userPrompt =
        fillTemplate(legacySkin.prompt.template, legacyValues) +
        "\n\n" +
        OUTPUT_SCHEMA_AND_RULES;

      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: legacySkin.prompt.system },
          { role: "user", content: userPrompt },
        ],
      });

      const full = String(completion.choices[0].message.content ?? "");
      const preview = makePreview(full);
      const packId = createPack(full, preview);

      return NextResponse.json({ packId, result: preview, locked: true });
    }

    const skin = getSkin(skinId);

    // ✅ 스킨 inputs 기준 필수값 체크
    for (const input of skin.inputs) {
      const v = String(values[input.key] ?? "").trim();
      if (!v) {
        return NextResponse.json(
          { error: `Missing input: ${input.key}` },
          { status: 400 }
        );
      }
    }

    const userPrompt =
      fillTemplate(skin.prompt.template, values) + "\n\n" + OUTPUT_SCHEMA_AND_RULES;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: skin.prompt.system },
        { role: "user", content: userPrompt },
      ],
    });

    const full = String(completion.choices[0].message.content ?? "");
    const preview = makePreview(full);

    const packId = createPack(full, preview);

    return NextResponse.json({ packId, result: preview, locked: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
