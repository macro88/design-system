import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "./button";
import { EmptyState } from "./empty-state";
import { Input } from "./input";
import { Toaster, showSuccess } from "./toast";
import { toast } from "sonner";

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
  toast.dismiss();
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

  it("gives a rendered success toast padding, a border, and a lift", async () => {
    mountFaces();
    render(
      <div data-theme="nostr">
        <Toaster />
        <div className="bg-surface" data-testid="surface">
          Sheet
        </div>
      </div>,
    );
    showSuccess("Saved");

    const host = await waitFor(() => {
      const node = screen.getByText("Saved").closest("[data-sonner-toast]");
      expect(node).not.toBeNull();
      expect(node).toHaveAttribute("data-mounted", "true");
      return node as HTMLElement;
    });

    const painted = getComputedStyle(host);
    const surface = getComputedStyle(screen.getByTestId("surface"));
    expect(host).toHaveAttribute("data-styled", "false");
    expect(painted.paddingTop).not.toBe("0px");
    expect(painted.paddingRight).not.toBe("0px");
    expect(painted.borderTopWidth).not.toBe("0px");
    expect(painted.borderTopStyle).toBe("solid");
    expect(painted.borderTopColor).not.toBe(["rgba", "(0, 0, 0, 0)"].join(""));
    expect(painted.borderTopColor).not.toBe("transparent");
    expect(painted.boxShadow).not.toBe("none");
    expect(painted.boxShadow).not.toBe(surface.boxShadow);
  });

  it("imports the Sonner stylesheet from the library styles", () => {
    expect(styles.startsWith('@import "sonner/dist/styles.css"')).toBe(true);
  });
});
