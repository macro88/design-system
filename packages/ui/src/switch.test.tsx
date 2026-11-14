import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

function declarations(css: string, selector: string): Map<string, string> {
  let body = "";
  for (const match of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const selectors = (match[1] ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (selectors.length === 1 && selectors[0] === selector) {
      body = match[2] ?? "";
      break;
    }
  }
  const values = new Map<string, string>();
  for (const chunk of body.split(";")) {
    const colon = chunk.indexOf(":");
    if (colon === -1) continue;
    const name = chunk.slice(0, colon).trim();
    const value = chunk
      .slice(colon + 1)
      .replace(/\s+/g, " ")
      .trim();
    if (name.startsWith("--") || name.length > 0) values.set(name, value);
  }
  return values;
}

function tokenLengths(): Map<string, number> {
  const css = readFileSync(path.join(process.cwd(), "../tokens/src/theme.css"), "utf8");
  const lengths = new Map<string, number>();
  for (const block of css.matchAll(/:root\s*\{([^}]*)\}/g)) {
    for (const [name, value] of declarations(block[0].replace(":root", "root"), "root")) {
      if (value.endsWith("px")) lengths.set(name, Number.parseFloat(value));
      if (value.endsWith("rem")) lengths.set(name, Number.parseFloat(value) * 16);
    }
  }
  return lengths;
}

function lengthPx(value: string, tokens: Map<string, number>): number {
  const resolved = value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
    const length = tokens.get(name);
    if (length === undefined) throw new Error(`missing ${name}`);
    return String(length);
  });
  const expression = resolved.replace(/^calc\((.*)\)$/, "$1").trim();
  if (expression.endsWith("px")) return Number.parseFloat(expression);
  if (expression.endsWith("rem")) return Number.parseFloat(expression) * 16;
  const compact = expression.replace(/\s+/g, "");
  if (!/^[\d.+*-]+$/.test(compact)) throw new Error(expression);
  const parts = compact.match(/[+-]?[^+-]+/g) ?? [];
  return parts.reduce((sum, part) => {
    const sign = part.startsWith("-") ? -1 : 1;
    const factors = part.replace(/^[+-]/, "").split("*").map(Number);
    return sum + sign * factors.reduce((product, factor) => product * factor, 1);
  }, 0);
}

function mountSwitchStyles() {
  document.getElementById("switch-fixture")?.remove();
  const style = document.createElement("style");
  style.id = "switch-fixture";
  const tokens = readFileSync(path.join(process.cwd(), "../tokens/src/theme.css"), "utf8");
  const nostr = readFileSync(path.join(process.cwd(), "../themes/nostr/src/theme.css"), "utf8");
  const css = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8").replace(
    /^@import[^;]+;\s*/,
    "",
  );
  style.textContent = `
    ${tokens}
    ${nostr}
    .border-strong-swatch { background: var(--color-border-strong); }
    ${css}
  `;
  document.head.append(style);
}

afterEach(() => {
  document.documentElement.style.removeProperty("--radius-switch");
  document.getElementById("switch-fixture")?.remove();
});

describe("Switch", () => {
  it("toggles with Space and reports aria-checked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Reminders" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole("switch", { name: "Reminders" });
    expect(control).toHaveAttribute("aria-checked", "false");
    control.focus();
    await user.keyboard(" ");

    expect(control).toBeChecked();
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not change while disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Reminders" disabled defaultChecked onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch", { name: "Reminders" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch", { name: "Reminders" })).toBeChecked();
  });

  it("follows the switch radius, paints the off thumb with the strong border, and casts no shadow", () => {
    mountSwitchStyles();
    const view = render(
      <div data-theme="nostr">
        <Switch label="Off" />
        <div className="border-strong-swatch" data-testid="border-strong" />
      </div>,
    );
    view.container.querySelector("[data-theme]")?.setAttribute("style", "--radius-switch: 48px");

    const track = screen.getByRole("switch", { name: "Off" });
    const thumb = track.querySelector(".switch-thumb");
    expect(thumb).not.toBeNull();
    const thumbNode = thumb as HTMLElement;
    const swatch = getComputedStyle(screen.getByTestId("border-strong")).backgroundColor;
    expect(getComputedStyle(track).borderRadius).toBe("48px");
    expect(getComputedStyle(thumbNode).borderRadius).toBe("48px");
    expect(getComputedStyle(thumbNode).backgroundColor).toBe(swatch);
    expect(getComputedStyle(thumbNode).boxShadow).toBe("none");
  });

  it("uses the nostr full radius when the theme redeclares it", () => {
    mountSwitchStyles();
    render(
      <div data-theme="nostr">
        <Switch label="Off" />
      </div>,
    );

    const track = screen.getByRole("switch", { name: "Off" });
    const full = getComputedStyle(track.parentElement as HTMLElement).getPropertyValue(
      "--radius-full",
    );
    expect(full.trim()).toBe("9999px");
    expect(document.documentElement.style.getPropertyValue("--radius-switch")).toBe("");
    expect(getComputedStyle(track).borderRadius).toBe("9999px");
  });

  it("keeps an even inset around the checked thumb", () => {
    const css = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8");
    const tokens = tokenLengths();
    const track = declarations(css, ".switch");
    const thumb = declarations(css, ".switch-thumb");
    const border = tokens.get("--border-width");
    const padding = lengthPx(track.get("padding") ?? "", tokens);
    const width = lengthPx(track.get("width") ?? "", tokens);
    const height = lengthPx(track.get("height") ?? "", tokens);
    const travel = lengthPx(track.get("--switch-travel") ?? "", tokens);
    const thumbWidth = lengthPx(thumb.get("width") ?? "", tokens);
    const thumbHeight = lengthPx(thumb.get("height") ?? "", tokens);
    if (border === undefined) throw new Error("missing border width");

    const left = border + padding;
    const right = width - (border + padding + thumbWidth + travel);
    const top = border + padding;
    const bottom = height - (border + padding + thumbHeight);

    expect(right).toBeCloseTo(left);
    expect(top).toBeCloseTo(left);
    expect(bottom).toBeCloseTo(left);
  });

  it("moves the thumb with the fast feedback tokens and drops that motion when reduced", () => {
    const css = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8");
    expect(css).toMatch(
      /\.switch-thumb\s*\{[^}]*transition:\s*transform var\(--motion-duration-fast\) var\(--motion-ease-standard\)/,
    );
    expect(css).toMatch(
      /prefers-reduced-motion:\s*reduce[\s\S]*\.switch-thumb\s*\{[^}]*transition:\s*none/,
    );
  });
});
