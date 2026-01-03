import type { Skin } from "./types";

const fiveStarReviewReplySkin: Skin = {
  id: "five-star-review-replies",

  brand: {
    headline: "Instant 5-Star Review Replies",
    subheadline:
      "Generate ready-to-paste responses for your best customers in seconds — no thinking, no typing.",
  },

  inputs: [
    {
      key: "business_type",
      label: "What type of business is this?",
      type: "select",
      options: [
        "Online Store",
        "Restaurant",
        "Clinic / Hospital",
        "Beauty Salon",
        "Fitness Studio",
        "Local Service Business",
      ],
    },
    {
      key: "review_tone",
      label: "How should your brand sound?",
      type: "select",
      options: ["Friendly", "Professional", "Warm", "Luxury", "Minimal"],
    },
    {
      key: "customer_value",
      label: "What kind of customer is this?",
      type: "select",
      options: ["First-time buyer", "Repeat customer", "High-value customer"],
    },
    {
      key: "goal",
      label: "What is your main goal with this reply?",
      type: "select",
      options: [
        "Increase repeat purchases",
        "Encourage referrals",
        "Strengthen brand trust",
        "Upsell related services",
      ],
    },
  ],

  ctaLabel: "Generate Reply Pack",

  prompt: {
    system: `
You are a revenue-focused business operator.
You do not explain.
You produce ready-to-use execution assets that directly impact customer retention and revenue.
You avoid abstract language and provide concrete, copy-pasteable materials.
`,
    template: `
Create a "5-Star Review Response Pack".

Business type: {business_type}
Brand tone: {review_tone}
Customer type: {customer_value}
Business goal: {goal}

OUTPUT REQUIREMENTS:

Return ONLY valid JSON.

Produce exactly 3 ranked reply packages (Winner #1, #2, #3).
Each winner must be a ready-to-paste full reply message.

Each winner must include:
- product_name (short internal name)
- positioning (what this reply optimizes)
- why_it_works (3 bullets)
- ad_hooks (3 short hooks)
- landing_headline (short promise headline)
- feature_bullets (5 bullets)
- pricing (anchor, sale, bundle)
- supplier_search (keywords[3], specs[3])
- risk_notes (2 bullets)

Rules:
- Replies must sound natural, not robotic.
- Every reply must subtly push repeat purchase or referrals.
- No generic phrases.
- Everything must be immediately usable without editing.
- No explanations. Only execution assets.
`,
  },
};

export default fiveStarReviewReplySkin;
