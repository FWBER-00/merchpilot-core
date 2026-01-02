// skins/types.ts
export type SkinSelectInput = {
  key: string;
  label: string;
  type: "select";
  options: string[];
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
    template: string; // {key} 치환
  };
};
