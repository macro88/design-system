import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { ConfirmSheet } from "./confirm-sheet";
import { Toaster, showError, showSuccess, showUndo } from "./toast";

async function settle() {
  await act(async () => {
    for (let step = 0; step < 6; step += 1) {
      await vi.advanceTimersByTimeAsync(0);
    }
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(250);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(250);
  });
}

describe("Toaster", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    toast.dismiss();
    await settle();
    vi.useRealTimers();
  });

  it("dismisses a success message and keeps an error until it is closed", async () => {
    render(<Toaster />);

    await act(async () => {
      showSuccess("Saved");
    });
    await settle();
    expect(screen.getByText("Saved")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    await settle();
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();

    await act(async () => {
      showError("Failed");
    });
    await settle();
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
    expect(screen.getByRole("button", { name: "Close" })).toHaveAccessibleName("Close");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });
    await settle();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Failed").closest("[data-sonner-toast]")).toHaveAttribute(
      "data-removed",
      "false",
    );

    screen.getByRole("button", { name: "Close" }).click();
    await settle();
    expect(screen.queryByText("Failed")).not.toBeInTheDocument();
  });

  it("runs undo and pauses while hovered", async () => {
    const onUndo = vi.fn();
    render(<Toaster />);

    await act(async () => {
      showUndo("Removed", onUndo);
    });
    await settle();
    const message = screen.getByText("Removed");
    message.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000);
    });
    await settle();
    expect(screen.getByText("Removed")).toBeInTheDocument();
    expect(message.closest("[data-sonner-toast]")).toHaveAttribute("data-removed", "false");

    screen.getByRole("button", { name: "Undo" }).click();
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it("keeps at most three messages and does not evict an undo toast first", async () => {
    render(<Toaster />);
    await act(async () => {
      showUndo("Keep this", () => undefined);
      showSuccess("One");
      showSuccess("Two");
      showSuccess("Three");
    });
    await settle();

    const undo = screen.getByText("Keep this").closest("[data-sonner-toast]");
    expect(undo).toHaveAttribute("data-removed", "false");
    expect(undo).toHaveAttribute("data-visible", "true");
    expect(screen.queryByText("One")).not.toBeInTheDocument();
    const visible = document.querySelectorAll(
      '[data-sonner-toast][data-visible="true"]:not([data-removed="true"])',
    );
    expect(visible.length).toBeLessThanOrEqual(3);
  });

  it("does not let an undo toast expire while it is hidden", async () => {
    render(<Toaster />);
    let id = "";
    await act(async () => {
      id = showUndo("Keep this", () => undefined);
    });
    await settle();

    const undo = document.querySelector(`[data-toast-id="${id}"]`)?.closest("[data-sonner-toast]");
    expect(undo).not.toBeNull();
    await act(async () => {
      undo?.setAttribute("data-visible", "false");
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20000);
    });
    await settle();

    expect(document.querySelector(`[data-toast-id="${id}"]`)).toBeInTheDocument();
    expect(undo).toHaveAttribute("data-removed", "false");
  });

  it("keeps a toast clear of the sheet actions", async () => {
    const viewportHeight = 900;
    const sheetHeight = 260;
    const sheetTop = viewportHeight - sheetHeight;
    const toastHeight = 64;
    const original = HTMLElement.prototype.getBoundingClientRect;

    HTMLElement.prototype.getBoundingClientRect = function () {
      if (this.classList.contains("sheet")) {
        return new DOMRect(0, sheetTop, 800, sheetHeight);
      }
      if (this instanceof HTMLButtonElement && this.closest(".sheet")) {
        const x = this.textContent?.includes("Remove") ? 120 : 16;
        return new DOMRect(x, sheetTop + 180, 96, 44);
      }
      if (this.hasAttribute("data-sonner-toast") || this.hasAttribute("data-sonner-toaster")) {
        const onTop =
          document.querySelector("[data-sonner-toaster]")?.getAttribute("data-y-position") ===
          "top";
        if (onTop) return new DOMRect(16, 24, 360, toastHeight);
        const clearance = Number.parseFloat(
          document.documentElement.style.getPropertyValue("--sheet-clearance"),
        );
        const gapRaw = getComputedStyle(document.documentElement)
          .getPropertyValue("--toast-gap")
          .trim();
        const gap = Number.parseFloat(gapRaw) * (gapRaw.endsWith("rem") ? 16 : 1);
        const inset =
          (Number.isFinite(clearance) ? clearance : 0) + (Number.isFinite(gap) ? gap : 0);
        return new DOMRect(220, viewportHeight - inset - toastHeight, 360, toastHeight);
      }
      return original.call(this);
    };

    function overlaps(a: DOMRect, b: DOMRect) {
      return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }

    async function openSheet() {
      render(
        <>
          <Toaster />
          <ConfirmSheet
            open
            title="Remove this item?"
            description="This cannot be undone."
            confirmLabel="Remove"
            destructive
            onOpenChange={vi.fn()}
            onConfirm={vi.fn()}
          />
        </>,
      );
      await act(async () => {
        showSuccess("Saved");
      });
      await settle();
    }

    try {
      document.documentElement.style.setProperty("--toast-sheet-place", "top");
      await openSheet();
      const narrowToast = screen.getByText("Saved").closest("[data-sonner-toast]");
      const narrowToaster = narrowToast?.closest("[data-sonner-toaster]");
      expect(narrowToaster).toHaveAttribute("data-y-position", "top");
      const narrowBox = narrowToast?.getBoundingClientRect();
      for (const name of ["Cancel", "Remove"]) {
        const action = screen.getByRole("button", { name }).getBoundingClientRect();
        expect(narrowBox && overlaps(narrowBox, action)).toBe(false);
      }

      toast.dismiss();
      await settle();
      cleanup();
      document.documentElement.style.removeProperty("--toast-sheet-place");

      await openSheet();
      const wideToast = screen.getByText("Saved").closest("[data-sonner-toast]");
      const wideToaster = wideToast?.closest("[data-sonner-toaster]");
      expect(wideToaster).toHaveAttribute("data-y-position", "bottom");
      const wideBox = wideToast?.getBoundingClientRect();
      const sheet = document.querySelector(".sheet")?.getBoundingClientRect();
      expect(wideBox && sheet && wideBox.bottom <= sheet.top).toBe(true);
      for (const name of ["Cancel", "Remove"]) {
        const action = screen.getByRole("button", { name }).getBoundingClientRect();
        expect(wideBox && overlaps(wideBox, action)).toBe(false);
      }
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original;
      document.documentElement.style.removeProperty("--toast-sheet-place");
      document.documentElement.style.removeProperty("--sheet-clearance");
      delete document.documentElement.dataset.sheetOpen;
    }
  });
});
