import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmSheet, sheetTiming } from "./confirm-sheet";

const props = {
  open: true,
  title: "Remove this item?",
  description: "This cannot be undone.",
  confirmLabel: "Remove",
};

describe("ConfirmSheet", () => {
  it("confirms, cancels, and closes from the keyboard", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    const view = render(
      <ConfirmSheet {...props} onOpenChange={onOpenChange} onConfirm={onConfirm} />,
    );

    const dialog = screen.getByRole("alertdialog", { name: "Remove this item?" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    view.rerender(<ConfirmSheet {...props} onOpenChange={onOpenChange} onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    view.rerender(<ConfirmSheet {...props} onOpenChange={onOpenChange} onConfirm={onConfirm} />);
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("stays open when the scrim is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ConfirmSheet {...props} onOpenChange={onOpenChange} onConfirm={vi.fn()} />);

    await user.click(document.querySelector(".sheet-overlay") as Element);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("reads the active theme's sheet, surface, and exit tokens", () => {
    const root = document.documentElement.style;
    root.setProperty("--sheet-enter", "30px");
    root.setProperty("--sheet-exit", "10px");
    root.setProperty("--motion-ease-drawer", "cubic-bezier(0.32, 0.72, 0, 1)");
    root.setProperty("--motion-sheet-duration", "300ms");
    root.setProperty("--motion-sheet-ease", "var(--motion-ease-drawer)");
    root.setProperty("--motion-exit-duration", "150ms");
    root.setProperty("--motion-exit-ease", "cubic-bezier(0.23, 1, 0.32, 1)");
    root.setProperty("--motion-surface-duration", "200ms");
    root.setProperty("--motion-surface-ease", "cubic-bezier(0.2, 0, 0, 1)");

    expect(sheetTiming(false)).toEqual({
      enterY: 30,
      exitY: 10,
      sheetEnter: { type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] },
      sheetExit: { type: "tween", duration: 0.15, ease: [0.23, 1, 0.32, 1] },
      backdropEnter: { type: "tween", duration: 0.2, ease: [0.2, 0, 0, 1] },
      backdropExit: { type: "tween", duration: 0.15, ease: [0.23, 1, 0.32, 1] },
    });

    const source = readFileSync(path.join(process.cwd(), "src/confirm-sheet.tsx"), "utf8");
    expect(source).not.toContain("spring");
  });

  it("uses the danger button when the confirm action is destructive", () => {
    render(<ConfirmSheet {...props} destructive onOpenChange={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Remove" })).toHaveClass("button-danger");
  });
});
