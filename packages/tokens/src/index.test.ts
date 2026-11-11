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
      "selected",
      "today",
      "skeleton",
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
    expect(themeCss).not.toContain("prefers-color-scheme");
  });
});
