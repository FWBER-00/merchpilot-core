// skins/firstPurchaseSkin.ts
import type { Skin } from "./types";

const firstPurchaseSkin: Skin = {
  id: "first-purchase-accelerator",

  brand: {
    headline: "From Free to Paid in 5 Days",
    subheadline:
      "Plug-and-deploy first-purchase sequences for solo digital sellers — no ads, no funnels, just buyer psychology.",
  },

  inputs: [
    {
      key: "product_type",
      label: "What You Sell",
      type: "select",
      options: [
        "Digital Course ($50–500)",
        "Coaching/Consulting ($200–2,000)",
        "Notion Templates ($10–50)",
        "SaaS/Software ($20–100/mo)",
        "Ebook/Guide ($20–100)",
        "Community/Membership ($30–200/mo)",
      ],
    },
    {
      key: "list_temperature",
      label: "Subscriber State",
      type: "select",
      options: [
        "Cold (freebie hunters, low trust)",
        "Warm (engaged, still not buying)",
        "Stale (inactive, forgotten you)",
        "Hot (interested, hesitating on purchase)",
      ],
    },
    {
      key: "main_objection",
      label: "Main Buying Objection",
      type: "select",
      options: [
        "Don't trust you yet",
        "Not convinced of value",
        "Too expensive / budget concerns",
        "Timing (I'll do it later)",
      ],
    },
    {
      key: "business_stage",
      label: "Your Business Stage",
      type: "select",
      options: [
        "Just launched (0–100 subs)",
        "Growing (100–1,000 subs)",
        "Established (1,000–5,000 subs)",
        "Scaling (5,000+ subs)",
      ],
    },
  ],

  ctaLabel: "Generate",

  prompt: {
    system: `You are a conversion psychologist and direct-response strategist who specializes in turning free subscribers into first-time buyers for solo digital businesses.

NON-NEGOTIABLES:
- Produce realistic projections with explicit assumptions. Never invent extreme numbers.
- No fake scarcity, no deception, no manipulation. Ethical persuasion only.
- Copy must feel human, warm, and brand-safe — NOT hypey.
- Output must be DEPLOYABLE: ready-to-send bodies, not outlines.

QUALITY BAR:
- Each email must have: a clear opening hook, 1-2 concrete insights, a simple next step, and a natural close.
- Avoid generic motivational fluff. Make it specific to the scenario inputs.
- Use plain language. No corporate buzzwords.

PSYCHOLOGY STYLE:
- Psychology should name the trigger(s) explicitly (e.g., "social proof", "loss aversion", "commitment consistency", "reduce friction", "authority cue") and explain in 1-2 lines how it is used in that email.
- Not “this builds trust” — name the mechanism.

PLATFORM STYLE:
- Email bodies must be full copy (200–350 words; Day 5: 250–400) with placeholders.
- DM/SMS must be READY-TO-SEND scripts (copy/paste), not adaptation advice.

You create PRODUCTION-READY conversion systems, not marketing ideas.`,

    template: `Create 3 complete first-purchase conversion systems for:

Product: {product_type}
Subscriber State: {list_temperature}
Main Objection: {main_objection}
Business Stage: {business_stage}

ROLE MAPPING (must be meaningfully different):
1) TRUST: reduce anxiety + build credibility fast (no selling Day 1)
2) DESIRE: increase perceived value + want (transformation + proof)
3) DECISION: remove friction + trigger action (clear CTA + objection handling)

GLOBAL COPY RULES:
- Use placeholders consistently: {{first_name}}, {{product_name}}, {{offer}}, {{price}}, {{link}}
- Each day must include ONE clear action (reply/click/read/try) — not multiple.
- Day 5 must include: (a) offer, (b) risk reversal or reassurance, (c) objection handling for {main_objection}, (d) clear CTA with {{link}}.

SEGMENTATION RULE:
- Mention that Day 5 sends only to non-buyers (in checklist + email notes).

Make each system immediately deployable and revenue-focused.`,
  },

  outputSchema: `
Return ONLY valid JSON. Start with { and end with }

Schema:
{
  "pack_title": "string",
  "winners": [
    {
      "title": "string - Memorable system name (framework-level, not a tactic)",
      "conversion_role": "string - One line that starts with 'ROLE:' and states TRUST/DESIRE/DECISION + what it does",
      "system_overview": "string - 2-3 sentences: barrier it breaks + why it works for this scenario",

      "day_by_day_sequence": {
        "day_1": { "subject": "string", "body": "string", "psychology": "string", "timing": "string" },
        "day_2": { "subject": "string", "body": "string", "psychology": "string", "timing": "string" },
        "day_3": { "subject": "string", "body": "string", "psychology": "string", "timing": "string" },
        "day_4": { "subject": "string", "body": "string", "psychology": "string", "timing": "string" },
        "day_5": { "subject": "string", "body": "string", "psychology": "string", "timing": "string" }
      },

      "platform_versions": {
        "email": "string - 3-5 bullets: formatting + segmentation + send rules (incl. Day 5 to non-buyers)",
        "dm_instagram": "string - READY-TO-SEND DM script (5 short messages max, each on new line)",
        "sms": "string - READY-TO-SEND SMS (<= 320 chars, includes {{link}} if CTA)"
      },

      "deployment_checklist": [
        "string - 5-7 steps, concrete (tools/segments/schedule/exclusions)"
      ],

      "revenue_modeling": {
        "baseline_conversion": "string - realistic range + assumption",
        "expected_lift": "string - realistic range + assumption",
        "revenue_per_1000": "string - realistic $ range + explicit formula (1000 * lift * price)",
        "breakeven_point": "string - pays for itself after X buyers (use simple math)",
        "timeframe": "string - when results show"
      },

      "key_principles": ["string","string","string"],
      "danger_zones": ["string","string"]
    }
  ]
}

CRITICAL REQUIREMENTS:
1) Exactly 3 winners
2) Winner #1 = TRUST role, Winner #2 = DESIRE role, Winner #3 = DECISION role
3) Each day body must be COMPLETE, ready to send:
   - Days 1-4: 200–350 words
   - Day 5: 250–400 words with clear CTA and {{link}}
4) Psychology field MUST:
   - Name 2-4 triggers explicitly (e.g., "social proof", "loss aversion", "authority cue", "reduce friction", "commitment consistency")
   - Explain how they appear in the copy in 1-2 lines
5) Timing MUST include time-of-day + trigger condition (e.g., "10am, immediately after opt-in")
6) DM/SMS must be copy/paste scripts (NOT “how to adapt” advice)
7) Projections must be realistic ranges WITH assumptions (no wild claims)
8) Tone matching by product type:
   - Courses/coaching: authority + warmth
   - Templates: practical + friendly
   - SaaS: professional + helpful
   - Community: inclusive + energizing
`,
};

export default firstPurchaseSkin;

