/** Composed type styles. Sizes come from the token contract, in rem. */
export const typeClass = {
  displayLg: "type-display-lg",
  displayMd: "type-display-md",
  displaySm: "type-display-sm",
  bodyLg: "type-body-lg",
  bodyMd: "type-body-md",
  bodySm: "type-body-sm",
  caption: "type-caption",
  eyebrow: "type-eyebrow",
  tabular: "type-tabular",
} as const;

export type TypeClass = (typeof typeClass)[keyof typeof typeClass];
