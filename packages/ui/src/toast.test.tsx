import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
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
});
