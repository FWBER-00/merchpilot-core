// skins/emailSequencePackSkin.ts
import type { Skin } from "./types";

const emailSequencePackSkin: Skin = {
  id: "email-sequence-pack",

  brand: {
    headline: "Email Sequence Generator",
    subheadline: "Get 3 complete 5-day email sequences in 30 seconds",
  },

  inputs: [
    {
      key: "niche",
      label: "Your Niche",
      type: "select",
      options: [
        "Fitness & Health",
        "Business & Productivity",
        "Personal Finance",
        "Marketing & Sales",
      ],
    },
    {
      key: "audience",
      label: "Target Audience",
      type: "select",
      options: [
        "Beginners",
        "Intermediate",
        "Advanced",
        "Entrepreneurs",
      ],
    },
    {
      key: "goal",
      label: "Sequence Goal",
      type: "select",
      options: [
        "Build trust",
        "Sell product",
        "Book calls",
        "Drive webinar",
      ],
    },
    {
      key: "tone",
      label: "Brand Tone",
      type: "select",
      options: [
        "Professional",
        "Friendly",
        "Inspirational",
        "Direct",
      ],
    },
  ],

  ctaLabel: "Generate 3 Email Sequences",

  prompt: {
    system: `You are an expert email copywriter for info products.
Write conversational, story-driven emails with short paragraphs.
Provide complete, ready-to-send content with NO placeholders.`,

    template: `Create 3 different 5-day email sequences for:
Niche: {niche}
Audience: {audience}
Goal: {goal}
Tone: {tone}`,
  },

  outputSchema: `
Return ONLY valid JSON. Start with { and end with }

Schema:
{
  "pack_title": "string",
  "winners": [
    {
      "title": "string",
      "content": "string - ALL 5 days combined with \\n breaks",
      "results": {
        "metrics": ["string", "string", "string"],
        "revenue": "string"
      }
    }
  ]
}

RULES:
1. Exactly 3 winners
2. Each winner's "content" = ONE STRING with all 5 days
3. Format content like:
   "DAY 1\\nSubject: ...\\n\\nHey there,\\n\\n[body]\\n\\nDAY 2\\nSubject: ...\\n\\n[body]"
4. Each day: 200-400 words
5. Total per winner: 1000-2000 words
6. Use real names (Sarah, Mike) not [First Name]
7. results.metrics = 3 specific outcomes with numbers
8. results.revenue = revenue projection with timeframe
`,
};

export default emailSequencePackSkin;