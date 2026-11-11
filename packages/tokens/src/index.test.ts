import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  colorRoles,
  elevationVars,
  controlHeightVars,
  disabledOpacityVar,
  fieldAreaMinHeightVar,
  focusRingClass,
  focusVars,
  iconStrokeVar,
  borderWidthVar,
  layerVars,
  packageName,
  scrimVar,
  sheetTravelVars,
  toastLayoutVars,
  radiusVars,
  semanticColorVars,
  spaceSteps,
  spaceVars,
  statusTones,
  typeRoles,
  typeVars,
} from "./index";

const themeCss = readFileSync(new URL("./theme.css", import.meta.url), "utf8");

describe("@macro88/tokens", () => {
  it("exports the package name", () => {
    expect(packageName).toBe("@macro88/tokens");
  });

  it("names the semantic colour roles and the status tones", () => {
    expect(colorRoles).toEqual([
      "bg",
      "surface",
      "text",
      "muted",
      "accent",
      "accent-fg",
      "accent-on",
      "accent-subtle",
      "selected",
      "today",
      "skeleton",
      "border",
      "border-strong",
      "focus",
      "danger-fg",
      "danger-bg",
    ]);
    expect(statusTones).toEqual(["neutral", "accent", "success", "warning", "danger", "info"]);
    expect(semanticColorVars).toHaveLength(colorRoles.length + statusTones.length * 2);
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
    expect(themeCss).toContain(`${iconStrokeVar}:`);
    expect(themeCss).toContain(`${disabledOpacityVar}:`);
    expect(themeCss).toContain(`${controlHeightVars.lg}:`);
    expect(themeCss).toContain(`${fieldAreaMinHeightVar}:`);
    for (const name of Object.values(layerVars)) {
      expect(themeCss).toContain(`${name}:`);
    }
    expect(themeCss).toContain(`${borderWidthVar}:`);
    expect(themeCss).toContain(`${scrimVar}:`);
    for (const name of Object.values(toastLayoutVars)) {
      expect(themeCss).toContain(`${name}:`);
    }
    for (const name of Object.values(sheetTravelVars)) {
      expect(themeCss).toContain(`${name}:`);
    }
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
    expect(themeCss).not.toContain("prefers-color-scheme");
  });
});
