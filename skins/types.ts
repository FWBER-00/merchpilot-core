// skins/types.ts
export type SkinSelectInput = {
  key: string;
  label: string;
  type: "select";
  options: string[];
};

export type Winner = any;  // 스킨마다 자유

export type Pack = {
  pack_title: string;
  winners: [Winner, Winner, Winner];
};

export type Skin = {
  id: string;
  brand: {
    headline: string;
    subheadline: string;
  };
  inputs: SkinSelectInput[];
  ctaLabel: string;
  prompt: {
    system: string;
    template: string;
  };
  outputSchema: string;
};