import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

const tokenTheme = readFileSync(path.join(process.cwd(), "../tokens/src/theme.css"), "utf8");
const nostrTheme = readFileSync(path.join(process.cwd(), "../themes/nostr/src/theme.css"), "utf8");

function declared(css: string, name: string, occurrence = 0): string {
  const values = [...css.matchAll(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`, "g"))].map(
    (match) => match[1]?.toLowerCase() ?? "",
  );
  const value = values[occurrence];
  if (!value) throw new Error(`missing ${name}`);
  return value;
}

function mountCascade() {
  document.getElementById("danger-solid-fixture")?.remove();
  const style = document.createElement("style");
  style.id = "danger-solid-fixture";
  style.textContent = `
    :root {
      --color-danger-solid: ${declared(tokenTheme, "--color-danger-solid")};
      --color-danger-solid-hover: ${declared(tokenTheme, "--color-danger-solid-hover")};
      --color-danger-solid-on: ${declared(tokenTheme, "--color-danger-solid-on")};
    }
    ${tokenTheme}
    ${nostrTheme}
  `;
  document.head.append(style);
}

afterEach(() => {
  document.getElementById("danger-solid-fixture")?.remove();
});

function solid(element: Element) {
  const style = getComputedStyle(element);
  return {
    fill: style.getPropertyValue("--color-danger-solid").trim().toLowerCase(),
    hover: style.getPropertyValue("--color-danger-solid-hover").trim().toLowerCase(),
    on: style.getPropertyValue("--color-danger-solid-on").trim().toLowerCase(),
  };
}

describe("solid danger cascade", () => {
  it("keeps nostr solids inside a base page and a dark page", () => {
    mountCascade();
    render(
      <div>
        <div data-testid="base" />
        <div data-theme="nostr" data-scheme="dark" data-testid="nostr-dark" />
        <div data-scheme="dark">
          <div data-theme="nostr" data-scheme="light" data-testid="nostr-light" />
        </div>
      </div>,
    );

    expect(solid(screen.getByTestId("base"))).toEqual({
      fill: declared(tokenTheme, "--color-danger-solid"),
      hover: declared(tokenTheme, "--color-danger-solid-hover"),
      on: declared(tokenTheme, "--color-danger-solid-on"),
    });
    expect(solid(screen.getByTestId("nostr-dark"))).toEqual({
      fill: declared(nostrTheme, "--color-danger-solid", 1),
      hover: declared(nostrTheme, "--color-danger-solid-hover", 1),
      on: declared(nostrTheme, "--color-danger-solid-on", 1),
    });
    expect(solid(screen.getByTestId("nostr-light"))).toEqual({
      fill: declared(nostrTheme, "--color-danger-solid"),
      hover: declared(nostrTheme, "--color-danger-solid-hover"),
      on: declared(nostrTheme, "--color-danger-solid-on"),
    });
  });
});
