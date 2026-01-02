// skins/monthlySalesPackSkin.ts
import type { Skin } from "./types";

const skin: Skin = {
  id: "monthly-sales-pack",

  brand: {
    headline: "Dropshippers get 3 ready-to-sell product packs in 30 seconds.",
    subheadline:
      "Monthly sales packs with ad hooks, store copy and pricing — no more guessing what to sell.",
  },

  inputs: [
    {
      key: "market",
      label: "Market",
      type: "select",
      options: ["US", "UK", "Global"],
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: ["Pet", "Home", "Beauty", "Fitness", "Baby"],
    },
    {
      key: "price",
      label: "Price Range",
      type: "select",
      options: ["$10-25", "$25-50", "$50+"],
    },
    {
      key: "channel",
      label: "Ad Channel",
      type: "select",
      options: ["TikTok", "Meta", "Google"],
    },
  ],

  ctaLabel: "Generate Pack",

  prompt: {
    system:
      "You are a senior dropshipping operator. Write in clear, specific, non-hype business language. Do NOT mention that you are an AI.",
    template: `Create a "Monthly Sales Pack" for:
Market: {market}
Category: {category}
Price Range: {price}
Ad Channel: {channel}`,
  },
};

export default skin;
