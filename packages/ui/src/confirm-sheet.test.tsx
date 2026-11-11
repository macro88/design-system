import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmSheet } from "./confirm-sheet";

describe("ConfirmSheet", () => {
  it("confirms, cancels, and closes from the keyboard", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    const view = render(
      <ConfirmSheet
        open
        onOpenChange={onOpenChange}
        title="Remove this item?"
        description="This cannot be undone."
        confirmLabel="Remove"
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Remove this item?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    view.rerender(
      <ConfirmSheet
        open
        onOpenChange={onOpenChange}
        title="Remove this item?"
        description="This cannot be undone."
        confirmLabel="Remove"
        onConfirm={onConfirm}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    view.rerender(
      <ConfirmSheet
        open
        onOpenChange={onOpenChange}
        title="Remove this item?"
        description="This cannot be undone."
        confirmLabel="Remove"
        onConfirm={onConfirm}
      />,
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
