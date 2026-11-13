import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

const styles = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8");
const tokenTheme = readFileSync(path.join(process.cwd(), "../tokens/src/theme.css"), "utf8");
const nostrTheme = readFileSync(path.join(process.cwd(), "../themes/nostr/src/theme.css"), "utf8");

function colourValue(css: string, name: string, occurrence: number): string {
  const values = [...css.matchAll(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`, "g"))];
  const value = values[occurrence]?.[1];
  if (!value) throw new Error(`missing ${name}`);
  return value;
}

function painted(hex: string): string {
  const channels = [0, 2, 4].map((start) => Number.parseInt(hex.slice(start + 1, start + 3), 16));
  return ["rgb", "(", channels.join(", "), ")"].join("");
}

const baseMuted = colourValue(tokenTheme, "--color-muted", 0);
const baseNeutralBg = colourValue(tokenTheme, "--color-status-neutral-bg", 0);
const baseAccent = colourValue(tokenTheme, "--color-accent", 0);
const baseAccentOn = colourValue(tokenTheme, "--color-accent-on", 0);
const darkMuted = colourValue(nostrTheme, "--color-muted", 1);
const darkNeutralBg = colourValue(nostrTheme, "--color-status-neutral-bg", 1);
const darkAccent = colourValue(nostrTheme, "--color-accent", 1);
const darkAccentOn = colourValue(nostrTheme, "--color-accent-on", 1);

function mountTheme() {
  document.getElementById("theme-fixture")?.remove();
  const redeclare = tokenTheme.match(/\[data-theme\],\s*\[data-scheme\]\s*\{[^}]+\}/)?.[0] ?? "";
  const style = document.createElement("style");
  style.id = "theme-fixture";
  style.textContent = `
    :root {
      --color-muted: ${baseMuted};
      --color-status-neutral-bg: ${baseNeutralBg};
      --color-disabled-bg: var(--color-status-neutral-bg);
      --color-disabled-fg: var(--color-muted);
      --color-accent: ${baseAccent};
      --color-accent-on: ${baseAccentOn};
    }
    ${nostrTheme}
    ${redeclare}
    .bg-accent { background-color: var(--color-accent); }
    .text-accent-on { color: var(--color-accent-on); }
    ${styles}
  `;
  document.head.append(style);
}

describe("disabled colours inside a theme", () => {
  it("follows nostr dark when the theme is only on an inner wrapper", () => {
    mountTheme();
    render(
      <div data-theme="nostr" data-scheme="dark">
        <Button disabled>Save</Button>
      </div>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    const style = getComputedStyle(button);
    expect(style.backgroundColor).toBe(painted(darkNeutralBg));
    expect(style.color).toBe(painted(darkMuted));
  });
});

describe("Button", () => {
  it("runs its action from a click and from the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button", { name: "Save" }));
    screen.getByRole("button", { name: "Save" }).focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("uses the same neutral fill for native disabled and aria-disabled", () => {
    const rule =
      styles.match(
        /\.button:disabled:not\(\[aria-busy="true"\]\),\s*\.button\[aria-disabled="true"\]:not\(\[aria-busy="true"\]\)[\s\S]*?\{([^}]+)\}/,
      )?.[1] ?? "";
    expect(rule).toContain("background-color: var(--color-disabled-bg)");
    expect(rule).toContain("color: var(--color-disabled-fg)");
    expect(rule).toContain("border-color: var(--color-border)");
    expect(rule).toContain("border-width: var(--border-width)");
    expect(rule).toContain("box-shadow: none");
    expect(rule).toContain("cursor: not-allowed");
    expect(rule).not.toContain("opacity");

    const { rerender } = render(<Button disabled>Save</Button>);
    const native = screen.getByRole("button", { name: "Save" });
    expect(native).toBeDisabled();
    expect(native).toHaveAttribute("aria-disabled", "true");
    expect(native).toHaveClass("button");

    rerender(<Button pending>Save</Button>);
    const held = screen.getByRole("button", { name: "Save" });
    expect(held).not.toBeDisabled();
    expect(held).toHaveAttribute("aria-disabled", "true");
    expect(held).toHaveClass("button");
  });

  it("does not run its action when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("stays focusable and ignores click, Enter, and Space while aria-disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button pending onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    button.focus();
    expect(button).toHaveFocus();
    await user.click(button);
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps a pending primary on its own colours", () => {
    mountTheme();
    render(
      <div data-theme="nostr" data-scheme="dark">
        <Button pending>Save</Button>
      </div>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    const style = getComputedStyle(button);
    expect(style.backgroundColor).toBe(painted(darkAccent));
    expect(style.color).toBe(painted(darkAccentOn));
    expect(style.backgroundColor).not.toBe(painted(darkNeutralBg));
    expect(style.color).not.toBe(painted(darkMuted));
    expect(style.cursor).toBe("progress");
    expect(getComputedStyle(button, "::before").backgroundColor).toBe(painted(darkAccentOn));
  });

  it("keeps the same width when a button becomes pending", () => {
    mountTheme();
    const view = render(
      <div data-theme="nostr" data-scheme="dark">
        <Button>Save</Button>
      </div>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    const idle = button.getBoundingClientRect().width;
    view.rerender(
      <div data-theme="nostr" data-scheme="dark">
        <Button pending>Save</Button>
      </div>,
    );
    const pending = screen.getByRole("button", { name: "Save" });
    expect(pending.getBoundingClientRect().width).toBe(idle);
    expect(pending).toHaveAccessibleName("Save");
    expect(pending).not.toHaveTextContent("Saving");
    expect(getComputedStyle(pending, "::before").position).toBe("absolute");
  });

  it("keeps its label and ignores activation while pending", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button pending onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps focus while pending", () => {
    const view = render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    button.focus();
    view.rerender(<Button pending>Save</Button>);
    expect(button).toHaveFocus();
    expect(button).not.toBeDisabled();
  });

  it("stops a pending link from navigating", () => {
    render(
      <Button asChild pending>
        <a href="/next">Next</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Next" });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("can render as the child element", () => {
    render(
      <Button asChild>
        <a href="/next">Next</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/next");
  });
});
