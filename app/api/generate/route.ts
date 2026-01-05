// app/api/generate/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getSkin } from "@/skins/registry";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values?.[key] ?? ""));
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const skinId = String(body?.skinId ?? "");
    const values = (body?.values ?? {}) as Record<string, string>;

    if (!skinId) {
      return NextResponse.json({ error: "Missing skinId" }, { status: 400 });
    }

    const skin = getSkin(skinId);

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
      fillTemplate(skin.prompt.template, values) + "\n\n" + skin.outputSchema;

    console.log("🚀 Calling OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: skin.prompt.system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    let full = String(completion.choices[0].message.content ?? "");

    console.log("✅ OpenAI response received");

    full = full.trim();
    if (full.startsWith("```json")) {
      full = full.replace(/^```json\s*/g, "").replace(/```\s*$/g, "");
    } else if (full.startsWith("```")) {
      full = full.replace(/^```\s*/g, "").replace(/```\s*$/g, "");
    }
    full = full.trim();

    try {
      JSON.parse(full);
      console.log("✅ JSON is valid");
    } catch (parseError: any) {
      console.error("❌ JSON parse error:", parseError.message);
      return NextResponse.json(
        {
          error: "AI returned invalid JSON",
          detail: parseError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: full });
  } catch (e: any) {
    console.error("❌ Server error:", e);
    return NextResponse.json(
      { error: "Server error", detail: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}