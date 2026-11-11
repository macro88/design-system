import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  colorRoles,
  elevationVars,
  focusRingClass,
  focusVars,
  packageName,
  radiusVars,
  semanticColorVars,
  spaceSteps,
  spaceVars,
  statusRoles,
  typeRoles,
  typeVars,
} from "./index";

const themeCss = readFileSync(new URL("./theme.css", import.meta.url), "utf8");

/** Held brand values. The contract and the temporary palettes must not use them. */
const heldBrandHexes = [
  "#F6F1E8",
  "#FFFDF8",
  "#1C1915",
  "#534E46",
  "#B54E24",
  "#8A3A18",
  "#F3E4D8",
  "#E6DFD3",
  "#8A7F6C",
  "#4A453C",
  "#EDE6D8",
  "#3F4A28",
  "#E5E8D4",
  "#1F5344",
  "#E0EBE4",
  "#165534",
  "#D8EBDC",
  "#7A241C",
  "#F3D2CC",
  "#5C4010",
  "#F1E4C4",
  "#1A1714",
  "#24201C",
  "#F4EFE6",
  "#B3ABA0",
  "#E07A4A",
  "#F0A07A",
  "#3A261C",
  "#3A342C",
  "#7A7368",
  "#F0EAE0",
  "#2F2C28",
  "#F3B08C",
  "#C8D2A0",
  "#2A3020",
  "#B4D8C4",
  "#20342C",
  "#A8D8B4",
  "#1A3024",
  "#F3B2A8",
  "#3A221E",
  "#F0D08A",
  "#3C2E18",
];

describe("@macro88/tokens", () => {
  it("exports the package name", () => {
    expect(packageName).toBe("@macro88/tokens");
  });

  it("names the semantic colour roles and the status roles", () => {
    expect(colorRoles).toEqual([
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
    ]);
    expect(statusRoles).toEqual([
      "draft",
      "queued",
      "approved",
      "signed",
      "sent",
      "failed",
      "missed",
    ]);
    expect(semanticColorVars).toHaveLength(colorRoles.length + statusRoles.length * 2);
  });

  it("declares every semantic colour, radius role, space step, and type role", () => {
    for (const name of semanticColorVars) {
      expect(themeCss).toContain(`${name}:`);
    }
    for (const name of Object.values(radiusVars)) {
      expect(themeCss).toContain(`${name}:`);
    }
    for (const step of spaceSteps) {
      expect(themeCss).toContain(`${spaceVars[step]}:`);
    }
    for (const role of typeRoles) {
      expect(themeCss).toContain(`${typeVars[role].size}:`);
      expect(themeCss).toContain(`${typeVars[role].lineHeight}:`);
      expect(themeCss).toContain(`${typeVars[role].weight}:`);
      expect(themeCss).toContain(`${typeVars[role].tracking}:`);
    }
    expect(themeCss).toContain(`${focusVars.width}: 2px`);
    expect(themeCss).toContain(`${focusVars.offset}: 2px`);
    expect(themeCss).toContain(focusRingClass);
  });

  it("builds elevation from a themeable shadow colour and strength", () => {
    for (const name of Object.values(elevationVars)) {
      expect(themeCss).toContain(`${name}:`);
    }
    for (const level of ["rest", "hover", "lift"] as const) {
      const declaration = themeCss.match(new RegExp(`${elevationVars[level]}:[^;]+;`))?.[0] ?? "";
      expect(declaration).toContain("var(--elevation-shadow-colour)");
      expect(declaration).toContain("var(--elevation-strength)");
    }
    expect(themeCss).toContain(':root[data-scheme="dark"]');
    expect(themeCss).toMatch(
      /:root\[data-scheme="dark"\]\s*\{[^}]*--elevation-strength:\s*0\.08;/s,
    );
  });

  it("does not embed held brand colours", () => {
    const haystack = themeCss.toLowerCase();
    for (const hex of heldBrandHexes) {
      expect(haystack).not.toContain(hex.toLowerCase());
    }
  });
});
