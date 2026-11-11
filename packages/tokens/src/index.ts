/** Neutral semantic token contract. Themes supply values; this package supplies names. */
export const packageName = "@macro88/tokens";

export const colorRoles = [
  "bg",
  "surface",
  "text",
  "muted",
  "accent",
  "accent-fg",
  "accent-on",
  "accent-subtle",
  "border",
  "border-strong",
  "focus",
] as const;

export type ColorRole = (typeof colorRoles)[number];

export const statusRoles = [
  "draft",
  "queued",
  "approved",
  "signed",
  "sent",
  "failed",
  "missed",
] as const;

export type StatusRole = (typeof statusRoles)[number];
export type StatusPart = "fg" | "bg";

export const radiusRoles = ["control", "field", "panel", "badge", "overlay", "full"] as const;

export type RadiusRole = (typeof radiusRoles)[number];

/** 4px scale, including the 2px half-step. */
export const spaceSteps = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80] as const;

export type SpaceStep = (typeof spaceSteps)[number];

export const typeRoles = [
  "display-lg",
  "display-md",
  "display-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "caption",
  "eyebrow",
] as const;

export type TypeRole = (typeof typeRoles)[number];

export function colorVar(role: ColorRole): `--color-${ColorRole}` {
  return `--color-${role}`;
}

export function statusColorVar(
  role: StatusRole,
  part: StatusPart,
): `--color-status-${StatusRole}-${StatusPart}` {
  return `--color-status-${role}-${part}`;
}

export const semanticColorVars = [
  ...colorRoles.map((role) => colorVar(role)),
  ...statusRoles.flatMap(
    (role) => [statusColorVar(role, "fg"), statusColorVar(role, "bg")] as const,
  ),
] as const;

export const radiusVars = {
  control: "--radius-control",
  field: "--radius-field",
  panel: "--radius-panel",
  badge: "--radius-badge",
  overlay: "--radius-overlay",
  full: "--radius-full",
} as const satisfies Record<RadiusRole, string>;

export const elevationVars = {
  rest: "--elevation-rest",
  hover: "--elevation-hover",
  lift: "--elevation-lift",
  shadowColour: "--elevation-shadow-colour",
  strength: "--elevation-strength",
} as const;

export const focusVars = {
  width: "--focus-width",
  offset: "--focus-offset",
  colour: "--color-focus",
} as const;

export const fontVars = {
  display: "--font-display",
  body: "--font-body",
} as const;

export const spaceVars = {
  2: "--space-2",
  4: "--space-4",
  8: "--space-8",
  12: "--space-12",
  16: "--space-16",
  20: "--space-20",
  24: "--space-24",
  32: "--space-32",
  40: "--space-40",
  48: "--space-48",
  64: "--space-64",
  80: "--space-80",
} as const satisfies Record<SpaceStep, string>;

export const typeVars = {
  "display-lg": {
    size: "--text-display-lg",
    lineHeight: "--text-display-lg--line-height",
    weight: "--text-display-lg--font-weight",
    tracking: "--text-display-lg--letter-spacing",
  },
  "display-md": {
    size: "--text-display-md",
    lineHeight: "--text-display-md--line-height",
    weight: "--text-display-md--font-weight",
    tracking: "--text-display-md--letter-spacing",
  },
  "display-sm": {
    size: "--text-display-sm",
    lineHeight: "--text-display-sm--line-height",
    weight: "--text-display-sm--font-weight",
    tracking: "--text-display-sm--letter-spacing",
  },
  "body-lg": {
    size: "--text-body-lg",
    lineHeight: "--text-body-lg--line-height",
    weight: "--text-body-lg--font-weight",
    tracking: "--text-body-lg--letter-spacing",
  },
  "body-md": {
    size: "--text-body-md",
    lineHeight: "--text-body-md--line-height",
    weight: "--text-body-md--font-weight",
    tracking: "--text-body-md--letter-spacing",
  },
  "body-sm": {
    size: "--text-body-sm",
    lineHeight: "--text-body-sm--line-height",
    weight: "--text-body-sm--font-weight",
    tracking: "--text-body-sm--letter-spacing",
  },
  caption: {
    size: "--text-caption",
    lineHeight: "--text-caption--line-height",
    weight: "--text-caption--font-weight",
    tracking: "--text-caption--letter-spacing",
  },
  eyebrow: {
    size: "--text-eyebrow",
    lineHeight: "--text-eyebrow--line-height",
    weight: "--text-eyebrow--font-weight",
    tracking: "--text-eyebrow--letter-spacing",
  },
} as const satisfies Record<
  TypeRole,
  { size: string; lineHeight: string; weight: string; tracking: string }
>;

/** Class that draws the keyboard focus ring from the focus slots. */
export const focusRingClass = "focus-ring";
