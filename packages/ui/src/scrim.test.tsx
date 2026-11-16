import { readFileSync } from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

const tokenTheme = readFileSync(path.join(process.cwd(), "../tokens/src/theme.css"), "utf8");
const nostrTheme = readFileSync(path.join(process.cwd(), "../themes/nostr/src/theme.css"), "utf8");
const styles = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8").replace(
  /^@import[^;]+;\s*/,
  "",
);

function mountScrim() {
  document.getElementById("scrim-fixture")?.remove();
  const style = document.createElement("style");
  style.id = "scrim-fixture";
  style.textContent = `${tokenTheme}\n${nostrTheme}\n${styles}`;
  document.head.append(style);
}

afterEach(() => {
  document.getElementById("scrim-fixture")?.remove();
});

function wash(theme: string, scheme: "light" | "dark") {
  const view = render(
    <div data-theme={theme} data-scheme={scheme}>
      <div className="sheet-overlay" />
      <div className="sheet" />
    </div>,
  );
  const overlay = view.container.querySelector(".sheet-overlay");
  const sheet = view.container.querySelector(".sheet");
  if (!overlay || !sheet) throw new Error("missing sheet");
  const match = getComputedStyle(overlay).backgroundColor.match(
    /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\/\s*([\d.]+)\)/,
  );
  if (!match) throw new Error(getComputedStyle(overlay).backgroundColor);
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: Number(match[4]),
    borderTopWidth: getComputedStyle(sheet).borderTopWidth,
  };
}

describe("sheet scrim", () => {
  it("mixes a black base at the scheme opacity, and nostr dark uses its own wash", () => {
    mountScrim();
    const light = wash("runifly", "light");
    const dark = wash("runifly", "dark");
    const nostrLight = wash("nostr", "light");
    const nostrDark = wash("nostr", "dark");

    expect(light.r).toBeCloseTo(0);
    expect(light.g).toBeCloseTo(0);
    expect(light.b).toBeCloseTo(0);
    expect(light.a).toBeCloseTo(0.4);
    expect(dark.a).toBeCloseTo(0.6);
    expect(nostrLight.r).toBeCloseTo(7 / 255);
    expect(nostrLight.g).toBeCloseTo(8 / 255);
    expect(nostrLight.a).toBeCloseTo(0.4);
    expect(nostrDark.r).toBeCloseTo(7 / 255);
    expect(nostrDark.a).toBeCloseTo(0.64);
    expect(nostrDark.a).not.toBeCloseTo(dark.a);
    expect(nostrDark.borderTopWidth).toBe("1px");
  });
});
