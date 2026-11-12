import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "./button";
import { EmptyState } from "./empty-state";
import { Input } from "./input";

const styles = readFileSync(path.join(process.cwd(), "src/styles.css"), "utf8");
const tokenTheme = readFileSync(path.join(process.cwd(), "../tokens/src/theme.css"), "utf8");
const nostrTheme = readFileSync(path.join(process.cwd(), "../themes/nostr/src/theme.css"), "utf8");

function mountFaces() {
  document.getElementById("face-fixture")?.remove();
  const style = document.createElement("style");
  style.id = "face-fixture";
  style.textContent = `
    ${tokenTheme}
    ${nostrTheme}
    .font-display { font-family: var(--font-display); }
    .font-body { font-family: var(--font-body); }
    .bg-surface { background-color: var(--color-surface); }
    ${styles.replace(/^@import[^;]+;\s*/, "")}
  `;
  document.head.append(style);
}

afterEach(() => {
  document.getElementById("face-fixture")?.remove();
});

describe("control and prose faces", () => {
  it("sets Button and Input in the nostr display face and leaves prose in the body face", () => {
    mountFaces();
    render(
      <div data-theme="nostr">
        <Button>Save</Button>
        <Input label="Title" />
        <EmptyState title="Nothing here">A note in the body face.</EmptyState>
      </div>,
    );

    const button = getComputedStyle(screen.getByRole("button", { name: "Save" })).fontFamily;
    const label = getComputedStyle(screen.getByText("Title")).fontFamily;
    const field = getComputedStyle(screen.getByLabelText("Title")).fontFamily;
    const prose = getComputedStyle(screen.getByText("A note in the body face.")).fontFamily;

    expect(button).toContain("Be Vietnam Pro");
    expect(label).toContain("Be Vietnam Pro");
    expect(field).toContain("Be Vietnam Pro");
    expect(prose).toContain("Literata");
    expect(prose).not.toContain("Be Vietnam Pro");
  });

  it("gives a toast padding, a border, and a lift above a plain surface", () => {
    mountFaces();
    render(
      <div data-theme="nostr">
        <div className="bg-surface" data-testid="surface">
          Sheet
        </div>
        <div data-sonner-toast data-styled="true">
          Saved
        </div>
      </div>,
    );

    const toast = getComputedStyle(screen.getByText("Saved"));
    const surface = getComputedStyle(screen.getByTestId("surface"));

    expect(toast.paddingTop).not.toBe("0px");
    expect(toast.paddingRight).not.toBe("0px");
    expect(toast.borderTopWidth).not.toBe("0px");
    expect(toast.borderTopStyle).toBe("solid");
    expect(toast.boxShadow).not.toBe("none");
    expect(toast.boxShadow).not.toBe(surface.boxShadow);
    expect(toast.fontFamily).toContain("Be Vietnam Pro");
  });

  it("imports the Sonner stylesheet from the library styles", () => {
    expect(styles.startsWith('@import "sonner/dist/styles.css"')).toBe(true);
  });
});
