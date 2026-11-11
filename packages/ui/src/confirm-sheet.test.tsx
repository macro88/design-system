import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmSheet } from "./confirm-sheet";

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

  it("uses the danger button when the confirm action is destructive", () => {
    render(<ConfirmSheet {...props} destructive onOpenChange={vi.fn()} onConfirm={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Remove" })).toHaveClass("button-danger");
  });
});
