// skins/socialMediaPackSkin.ts
import type { Skin } from "./types";

const socialMediaPackSkin: Skin = {
  id: "social-media-pack",

  brand: {
    headline: "Social Media Post Generator",
    subheadline: "Get 3 viral-ready Instagram/LinkedIn posts in 30 seconds",
  },

  inputs: [
    {
      key: "platform",
      label: "Platform",
      type: "select",
      options: [
        "Instagram",
        "LinkedIn",
        "Twitter/X",
        "Facebook",
      ],
    },
    {
      key: "niche",
      label: "Your Niche",
      type: "select",
      options: [
        "Fitness & Health",
        "Business & Entrepreneurship",
        "Personal Development",
        "Marketing & Sales",
        "Finance & Investing",
        "Technology",
      ],
    },
    {
      key: "content_type",
      label: "Content Type",
      type: "select",
      options: [
        "Educational/Tips",
        "Inspirational/Motivational",
        "Personal Story",
        "Industry News/Trends",
        "Behind-the-scenes",
        "Controversial/Hot Take",
      ],
    },
    {
      key: "tone",
      label: "Tone",
      type: "select",
      options: [
        "Professional & Authoritative",
        "Casual & Relatable",
        "Humorous & Fun",
        "Bold & Provocative",
      ],
    },
  ],

  ctaLabel: "Generate 3 Posts",

  prompt: {
    system: `You are a viral social media content creator and copywriter.

Your expertise:
- Writing scroll-stopping hooks that grab attention in first 3 seconds
- Creating engagement-driven content (likes, comments, shares, saves)
- Understanding platform-specific best practices
- Using psychological triggers (curiosity, FOMO, social proof)
- Writing conversational, natural copy that feels authentic

You create posts that:
- Hook readers immediately (first line is critical)
- Provide genuine value or entertainment
- Include clear CTAs for engagement
- Use proper formatting for readability
- Feel human and authentic, not AI-generated

Always provide complete, ready-to-post content.`,

    template: `Create 3 different social media posts for:

Platform: {platform}
Niche: {niche}
Content Type: {content_type}
Tone: {tone}

Make each post unique with different angles and hooks.`,
  },

  outputSchema: `
Return ONLY valid JSON. Start with { and end with }

Schema:
{
  "pack_title": "string",
  "winners": [
    {
      "title": "string - post concept name",
      "hook": "string - first 1-2 sentences (scroll-stopper)",
      "caption": "string - full post caption with formatting",
      "hashtags": ["string", "string", "string"],
      "cta": "string - call-to-action at end",
      "visual_suggestion": "string - what image/video to use",
      "results": {
        "engagement": "string - expected engagement rate",
        "reach": "string - expected reach",
        "saves": "string - expected save rate"
      }
    }
  ]
}

RULES:
1. Exactly 3 winners
2. Hook = first 1-2 sentences, must grab attention immediately
3. Caption = full post body (150-300 words for Instagram/LinkedIn, 100-150 for Twitter)
4. Use line breaks for readability (each paragraph 2-3 sentences max)
5. Hashtags = 5-10 relevant hashtags
6. CTA = clear engagement ask (comment, share, save, click link)
7. Visual suggestion = describe ideal image/video to pair with post
8. Results = specific numbers with context (e.g., "5-8% (industry avg 2%)")
9. Platform-specific formatting:
   - Instagram: emoji-friendly, story-driven
   - LinkedIn: professional but personal, data-backed
   - Twitter: punchy, controversial takes
   - Facebook: conversational, community-focused
`,
};

export default socialMediaPackSkin;