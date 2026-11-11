import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster, showError, showSuccess, showUndo } from "./toast";

describe("Toaster", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty("--toast-duration-success");
    document.documentElement.style.removeProperty("--toast-duration-undo");
  });

  it("dismisses a success message and keeps an error", async () => {
    document.documentElement.style.setProperty("--toast-duration-success", "30ms");
    const user = userEvent.setup();
    render(
      <>
        <Toaster />
        <button type="button" onClick={() => showSuccess("Saved")}>
          Succeed
        </button>
        <button type="button" onClick={() => showError("Failed")}>
          Fail
        </button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Succeed" }));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    await act(() => new Promise((resolve) => setTimeout(resolve, 80)));
    expect(document.querySelector("[data-sonner-toast]")).toHaveAttribute("data-removed", "true");

    await user.click(screen.getByRole("button", { name: "Fail" }));
    expect(await screen.findByText("Failed")).toBeInTheDocument();
    await act(() => new Promise((resolve) => setTimeout(resolve, 80)));
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("runs undo and pauses while hovered", async () => {
    document.documentElement.style.setProperty("--toast-duration-undo", "40ms");
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(
      <>
        <Toaster />
        <button type="button" onClick={() => showUndo("Removed", onUndo)}>
          Remove
        </button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Remove" }));
    const message = await screen.findByText("Removed");
    message.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    await act(() => new Promise((resolve) => setTimeout(resolve, 80)));
    expect(screen.getByText("Removed")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it("keeps at most three messages", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toaster />
        <button
          type="button"
          onClick={() => {
            showSuccess("One");
            showSuccess("Two");
            showSuccess("Three");
            showSuccess("Four");
          }}
        >
          Stack
        </button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Stack" }));
    expect(await screen.findByText("Four")).toBeInTheDocument();
    const visible = document.querySelectorAll('[data-sonner-toast][data-visible="true"]');
    expect(visible.length).toBeLessThanOrEqual(3);
  });
});
