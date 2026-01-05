// skins/reviewResponseSkin.ts
import type { Skin } from "./types";

const reviewResponseSkin: Skin = {
  id: "review-response-pack",

  brand: {
    headline: "Instant 5-Star Review Replies",
    subheadline: "Generate ready-to-paste responses for your best customers in seconds — no thinking, no typing",
  },

  inputs: [
    {
      key: "business_type",
      label: "Business Type",
      type: "select",
      options: [
        "Restaurant",
        "Hotel",
        "Cafe/Bakery",
        "Retail Store",
        "Salon/Spa",
        "Gym/Fitness",
        "Professional Services",
      ],
    },
    {
      key: "tone",
      label: "Brand Tone",
      type: "select",
      options: [
        "Professional",
        "Warm & Friendly",
        "Casual & Fun",
        "Luxurious",
      ],
    },
    {
      key: "customer_type",
      label: "Customer Type",
      type: "select",
      options: [
        "First-time customer",
        "Repeat customer",
        "VIP/Regular",
        "Special occasion guest",
      ],
    },
    {
      key: "goal",
      label: "Response Goal",
      type: "select",
      options: [
        "Show appreciation",
        "Increase repeat purchases",
        "Encourage referrals",
        "Build loyalty",
      ],
    },
  ],

  ctaLabel: "Generate",

  prompt: {
    system: `You are a customer service expert who writes authentic, effective review responses.

Your expertise:
- Crafting warm responses that strengthen customer relationships
- Using psychology to encourage repeat business and referrals
- Making customers feel genuinely valued
- Writing responses that impress potential customers reading them
- Balancing professionalism with authenticity

You provide complete, strategic, ready-to-use responses.`,

    template: `Create 3 different 5-star review response strategies for:

Business: {business_type}
Tone: {tone}
Customer: {customer_type}
Goal: {goal}

For each strategy, provide a complete package with response text, strategy explanation, usage guidance, and expected results.`,
  },

  outputSchema: `
Return ONLY valid JSON. Start with { and end with }

Schema:
{
  "pack_title": "string",
  "winners": [
    {
      "title": "string - strategy name (e.g., 'GratefulGuestInvite')",
      "response_text": "string - complete ready-to-paste response (100-150 words)",
      "landing_headline": "string - opening line",
      "why_it_works": ["string", "string", "string"],
      "ad_hooks": ["string", "string", "string"],
      "feature_bullets": ["string", "string", "string", "string", "string"],
      "pricing": {
        "anchor": "string",
        "sale": "string",
        "bundle": "string"
      },
      "supplier_search": {
        "keywords": ["string", "string", "string"],
        "specs": ["string", "string", "string"]
      },
      "risk_notes": ["string", "string"]
    }
  ]
}

CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:

1. Exactly 3 winners

2. "title" = Catchy strategy name
   - Format: CamelCase, no spaces (e.g., "GratefulGuestInvite", "HeartfeltThanks")
   - Should describe the approach

3. "response_text" = COMPLETE ready-to-paste review response (100-150 words)
   - Must include greeting: "Hi [Name]," or "Hello [Name],"
   - Express genuine gratitude for the review
   - Reference specific aspects (use placeholders like [dish/service/experience])
   - Include natural conversation
   - Add subtle invitation to return or try something new
   - Warm closing with business name
   - Example: "Hi [Name],\n\nThank you so much for the wonderful review! We're thrilled you loved our [pasta] and the cozy atmosphere. Your kind words truly made our day.\n\nIt means the world to us that you chose to dine with us. Guests like you are the reason we're so passionate about what we do.\n\nWe'd love to welcome you back soon! Next time, ask about our seasonal tasting menu—I think you'll love it.\n\nWarmly,\n[Restaurant Name] Team"

4. "landing_headline" = First sentence or greeting
   - The opening line that sets the tone
   - Example: "Thank you so much for the wonderful review!"

5. "why_it_works" = 3-5 bullet points
   - Explain the psychological/business reasons this response is effective
   - Examples:
     * "Acknowledges the customer's repeat business, reinforcing their choice"
     * "Creates a sense of community and belonging, making them feel valued"
     * "Encourages future visits by inviting feedback and sharing next steps"

6. "ad_hooks" = 3 alternative opening lines or hooks
   - Different ways to start the response
   - Examples:
     * "Your kind words mean the world to us!"
     * "We're so grateful for guests like you!"
     * "Thank you for making our day with this review!"

7. "feature_bullets" = 5 key features or benefits of this response style
   - What makes this approach special
   - Examples:
     * "Thanks repeat customers with genuine warmth"
     * "References their previous visit to show you remember them"
     * "Personal touch that feels authentic, not templated"
     * "Encourages organic growth through word-of-mouth"
     * "Professional, warm, and sincere tone"

8. "pricing" object with 3 fields:
   - "anchor": Normal/original value (e.g., "$12")
   - "sale": Discounted value (e.g., "$8")
   - "bundle": Bundle deal (e.g., "$22 for 3 responses")
   - This represents the value/ROI of using this response

9. "supplier_search" object:
   - "keywords": [3 search terms related to this strategy]
     * Example: ["customer service", "review responses", "loyalty programs"]
   - "specs": [3 specifications or requirements]
     * Example: ["authentic tone", "personalized content", "quick turnaround"]

10. "risk_notes" = 2 warnings or common mistakes to avoid
    - Examples:
      * "Refrain offers must be clearly managed to avoid overspending"
      * "If poorly timed, may seem pushy rather than genuine"

TONE MATCHING:
- If tone = "Professional": Use formal language, no emojis
- If tone = "Warm & Friendly": Use conversational, warm language
- If tone = "Casual & Fun": Use casual language, can include emojis
- If tone = "Luxurious": Use elegant, premium language

GOAL MATCHING:
- If goal = "Show appreciation": Focus on gratitude
- If goal = "Increase repeat purchases": Include subtle invitation to return
- If goal = "Encourage referrals": Mention sharing or bringing friends
- If goal = "Build loyalty": Focus on relationship and community

Make each response feel authentic and strategically designed.
`,
};

export default reviewResponseSkin;