import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { radiusVars, semanticColorVars, statusRoles } from "./index";

const themeRoot = fileURLToPath(new URL("../../themes", import.meta.url));
const themeIds = ["runifly", "nostr", "exosquare"] as const;

function ruleBodies(css: string): Map<string, string> {
  const bodies = new Map<string, string>();
  let index = 0;

  while (index < css.length) {
    if (css.startsWith("/*", index)) {
      const end = css.indexOf("*/", index + 2);
      index = end === -1 ? css.length : end + 2;
      continue;
    }

    const open = css.indexOf("{", index);
    if (open === -1) break;
    const selector = css.slice(index, open).replace(/\s+/g, " ").trim();
    let depth = 1;
    let cursor = open + 1;

    while (cursor < css.length && depth > 0) {
      if (css.startsWith("/*", cursor)) {
        const end = css.indexOf("*/", cursor + 2);
        cursor = end === -1 ? css.length : end + 2;
        continue;
      }
      if (css[cursor] === "{") depth += 1;
      else if (css[cursor] === "}") depth -= 1;
      cursor += 1;
    }

    const body = css.slice(open + 1, cursor - 1);
    if (selector.startsWith("@")) {
      for (const [nestedSelector, nestedBody] of ruleBodies(body)) {
        bodies.set(nestedSelector, `${bodies.get(nestedSelector) ?? ""}\n${nestedBody}`);
      }
    }
    if (selector) bodies.set(selector, `${bodies.get(selector) ?? ""}\n${body}`);
    index = cursor;
  }

  return bodies;
}

function declarations(body: string): Map<string, string> {
  const values = new Map<string, string>();
  const source = body.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const chunk of source.split(";")) {
    const colon = chunk.indexOf(":");
    if (colon === -1) continue;
    const name = chunk.slice(0, colon).trim();
    const value = chunk.slice(colon + 1).trim();
    if (name.startsWith("--")) values.set(name, value);
  }
  return values;
}

function channel(hex: string, start: number): number {
  const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const normalised = hex.replace("#", "");
  return (
    0.2126 * channel(normalised, 0) +
    0.7152 * channel(normalised, 2) +
    0.0722 * channel(normalised, 4)
  );
}

function contrast(foreground: string, background: string): number {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function requireHex(values: Map<string, string>, name: string): string {
  const value = values.get(name);
  if (!value || !/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`${name} is not a 6-digit colour (${value ?? "missing"})`);
  }
  return value;
}

describe("temporary theme palettes", () => {
  for (const themeId of themeIds) {
    const css = readFileSync(path.join(themeRoot, themeId, "src", "theme.css"), "utf8");
    const rules = ruleBodies(css);
    const light = declarations(rules.get(`[data-theme="${themeId}"]`) ?? "");
    const dark = declarations(rules.get(`[data-theme="${themeId}"][data-scheme="dark"]`) ?? "");

    describe(themeId, () => {
      it("is labelled as a temporary palette", () => {
        if (themeId === "nostr") {
          expect(css).not.toContain("TEMPORARY");
          return;
        }
        expect(css).toContain("TEMPORARY");
      });

      it("defines every semantic colour in light and dark", () => {
        for (const name of semanticColorVars) {
          expect(light.has(name), `light ${name}`).toBe(true);
          expect(dark.has(name), `dark ${name}`).toBe(true);
        }
      });

      it("sets modest radius roles on the theme", () => {
        for (const name of Object.values(radiusVars)) {
          if (name === radiusVars.full) continue;
          const value = light.get(name);
          expect(value, name).toBeTruthy();
          if (value === light.get(radiusVars.full)) continue;
          const pixels = Number.parseFloat(value ?? "");
          expect(pixels).toBeGreaterThan(0);
          expect(pixels).toBeLessThanOrEqual(12);
        }
      });

      it("keeps text pairs at WCAG AA in both schemes", () => {
        for (const scheme of [light, dark]) {
          const pair = (foreground: string, background: string, minimum: number) => {
            const ratio = contrast(requireHex(scheme, foreground), requireHex(scheme, background));
            expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(minimum);
          };

          pair("--color-text", "--color-bg", 4.5);
          pair("--color-text", "--color-surface", 4.5);
          pair("--color-text", "--color-accent-subtle", 4.5);
          pair("--color-muted", "--color-bg", 4.5);
          pair("--color-muted", "--color-surface", 4.5);
          pair("--color-muted", "--color-accent-subtle", 4.5);
          pair("--color-accent-fg", "--color-bg", 4.5);
          pair("--color-accent-fg", "--color-surface", 4.5);
          pair("--color-accent-fg", "--color-accent-subtle", 4.5);
          pair("--color-accent-on", "--color-accent", 4.5);
          pair("--color-focus", "--color-bg", 3);
          pair("--color-focus", "--color-surface", 3);
          pair("--color-border-strong", "--color-bg", 3);
          pair("--color-border-strong", "--color-surface", 3);
          pair("--color-danger-fg", "--color-danger-bg", 4.5);
          pair("--color-danger-fg", "--color-bg", 4.5);
          pair("--color-danger-fg", "--color-surface", 4.5);

          for (const status of statusRoles) {
            const background = scheme.get(`--color-status-${status}-bg`);
            if (!background || !/^#[0-9a-f]{6}$/i.test(background)) continue;
            pair(`--color-status-${status}-fg`, `--color-status-${status}-bg`, 4.5);
            pair("--color-text", `--color-status-${status}-bg`, 4.5);
            pair("--color-muted", `--color-status-${status}-bg`, 4.5);
          }
        }
      });
    });
  }
});
