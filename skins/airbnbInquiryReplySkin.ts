// skins/airbnbInquiryReplySkin.ts
import type { Skin } from "./types";

const skin: Skin = {
  id: "airbnb-inquiry-auto-reply",

  brand: {
    headline: "Airbnb Hosts: Reply to Booking Inquiries in 10 Seconds — With 3 Ranked Responses",
    subheadline:
      'A reusable monthly "Auto-Reply Pack" that generates copy-paste inquiry replies — no thinking, no awkward English, just higher conversions.',
  },

  inputs: [
    {
      key: "guest_type",
      label: "Guest Type",
      type: "select",
      options: ["Solo traveler", "Couple", "Family", "Business traveler", "Group"],
    },
    {
      key: "inquiry_topic",
      label: "Inquiry Topic",
      type: "select",
      options: [
        "Availability",
        "Price & discounts",
        "Check-in time",
        "Amenities",
        "Location & transport",
        "House rules",
        "Parking",
        "Long stay",
      ],
    },
    {
      key: "tone_policy",
      label: "Tone & Policy",
      type: "select",
      options: [
        "Warm & flexible",
        "Professional & firm",
        "Friendly & concise",
        "Luxury & premium",
        "Strict on rules",
      ],
    },
    {
      key: "offer_strategy",
      label: "Offer Strategy",
      type: "select",
      options: [
        "No discount",
        "Small discount with condition",
        "Upsell add-on (late checkout, extra service)",
        "Close fast (limited slots)",
        "Ask qualifying question first",
      ],
    },
  ],

  ctaLabel: "Generate Replies",

  prompt: {
    system:
      "You are an Airbnb host who earns steady monthly revenue and optimizes conversion rate. You write guest replies that reduce friction, prevent disputes, and close bookings fast. Never explain—only produce ready-to-send message assets. Do NOT mention that you are an AI.",

    template: `Create a Monthly Auto-Reply Pack for Airbnb inquiry replies.

Inputs:
Guest Type: {guest_type}
Inquiry Topic: {inquiry_topic}
Tone & Policy: {tone_policy}
Offer Strategy: {offer_strategy}

Write in clear, natural English that a real host would send.
No hype, no generic fluff. Make it realistic and specific.

Extra constraints:
- Avoid legal claims or guarantees.
- If "Price & discounts": include a firm but polite boundary line.
- If "House rules": include one line that reduces future disputes.
- Always include a next-step question that pushes the booking forward.`,
  },
};

export default skin;
