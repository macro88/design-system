import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { radiusVars, semanticColorVars } from "@macro88/tokens";

const css = readFileSync(new URL("./theme.css", import.meta.url), "utf8");

function ruleBodies(source: string): Map<string, string> {
  const bodies = new Map<string, string>();
  let index = 0;

  while (index < source.length) {
    if (source.startsWith("/*", index)) {
      const end = source.indexOf("*/", index + 2);
      index = end === -1 ? source.length : end + 2;
      continue;
    }
    const open = source.indexOf("{", index);
    if (open === -1) break;
    const selector = source.slice(index, open).replace(/\s+/g, " ").trim();
    let depth = 1;
    let cursor = open + 1;
    while (cursor < source.length && depth > 0) {
      if (source.startsWith("/*", cursor)) {
        const end = source.indexOf("*/", cursor + 2);
        cursor = end === -1 ? source.length : end + 2;
        continue;
      }
      if (source[cursor] === "{") depth += 1;
      else if (source[cursor] === "}") depth -= 1;
      cursor += 1;
    }
    const body = source.slice(open + 1, cursor - 1);
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

const rules = ruleBodies(css);
const light = declarations(rules.get('[data-theme="nostr"]') ?? "");
const dark = declarations(rules.get('[data-theme="nostr"][data-scheme="dark"]') ?? "");

const aaPairs: Array<[string, string, number]> = [
  ["--color-text", "--color-bg", 4.5],
  ["--color-text", "--color-surface", 4.5],
  ["--color-text", "--color-selected", 4.5],
  ["--color-text", "--color-today", 4.5],
  ["--color-muted", "--color-bg", 4.5],
  ["--color-muted", "--color-surface", 4.5],
  ["--color-muted", "--color-selected", 4.5],
  ["--color-muted", "--color-today", 4.5],
  ["--color-accent", "--color-bg", 4.5],
  ["--color-accent", "--color-surface", 4.5],
  ["--color-accent-fg", "--color-bg", 4.5],
  ["--color-accent-fg", "--color-surface", 4.5],
  ["--color-accent-fg", "--color-selected", 4.5],
  ["--color-accent-on", "--color-accent", 4.5],
  ["--color-focus", "--color-bg", 3],
  ["--color-focus", "--color-surface", 3],
  ["--color-border-strong", "--color-bg", 3],
  ["--color-border-strong", "--color-surface", 3],
  ["--color-status-failed-fg", "--color-status-failed-bg", 4.5],
  ["--color-status-failed-fg", "--color-bg", 4.5],
  ["--color-status-failed-fg", "--color-surface", 4.5],
  ["--color-text", "--color-status-failed-bg", 4.5],
  ["--color-muted", "--color-status-failed-bg", 4.5],
  ["--color-status-missed-fg", "--color-status-missed-bg", 4.5],
  ["--color-status-missed-fg", "--color-bg", 4.5],
  ["--color-status-missed-fg", "--color-surface", 4.5],
  ["--color-text", "--color-status-missed-bg", 4.5],
  ["--color-muted", "--color-status-missed-bg", 4.5],
];

describe("nostr theme contract", () => {
  it("defines every semantic colour in light and dark", () => {
    for (const name of semanticColorVars) {
      expect(light.has(name), `light ${name}`).toBe(true);
      expect(dark.has(name), `dark ${name}`).toBe(true);
    }
  });

  it("uses the book's radius roles", () => {
    expect(light.get(radiusVars.control)).toBe("4px");
    expect(light.get(radiusVars.field)).toBe("4px");
    expect(light.get(radiusVars.panel)).toBe("8px");
    expect(light.get(radiusVars.overlay)).toBe("8px");
    expect(light.get(radiusVars.badge)).toBe("9999px");
    expect(light.get(radiusVars.full)).toBe("9999px");
  });

  it("keeps ordinary status words on muted with no capsule", () => {
    for (const status of ["draft", "queued", "approved", "signed", "sent"]) {
      expect(light.get(`--color-status-${status}-fg`)).toBe(light.get("--color-muted"));
      expect(dark.get(`--color-status-${status}-fg`)).toBe(dark.get("--color-muted"));
      expect(light.get(`--color-status-${status}-bg`)).toBe("transparent");
      expect(dark.get(`--color-status-${status}-bg`)).toBe("transparent");
    }
  });

  it("sets accent-subtle and the skeleton wash to selected", () => {
    expect(light.get("--color-accent-subtle")).toBe(light.get("--color-selected"));
    expect(dark.get("--color-accent-subtle")).toBe(dark.get("--color-selected"));
    expect(light.get("--color-skeleton")).toBe(light.get("--color-selected"));
    expect(dark.get("--color-skeleton")).toBe(dark.get("--color-selected"));
  });

  it("meets AA for the role pairs in both schemes", () => {
    for (const scheme of [light, dark]) {
      for (const [foreground, background, minimum] of aaPairs) {
        const ratio = contrast(scheme.get(foreground) ?? "", scheme.get(background) ?? "");
        expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(minimum);
      }
    }
  });

  it("defines the ink chop class on the theme", () => {
    expect(css).toContain(".ink-rule");
  });

  it("leaves the ink chop out of shared components", () => {
    const uiRoot = fileURLToPath(new URL("../../../ui/src", import.meta.url));
    const files = collectSources(uiRoot);
    for (const file of files) {
      expect(readFileSync(file, "utf8"), path.relative(uiRoot, file)).not.toContain("ink-rule");
    }
  });
});

function collectSources(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectSources(fullPath));
    else if (/\.(tsx?|css)$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}
