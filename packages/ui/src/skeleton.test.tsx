import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits before showing, then stays for the minimum time", async () => {
    const view = render(
      <Skeleton pending label="Loading">
        Ready
      </Skeleton>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(199);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();

    view.rerender(
      <Skeleton pending={false} label="Loading">
        Ready
      </Skeleton>,
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(399);
    });
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("does not show when the work finishes during the delay", async () => {
    const view = render(
      <Skeleton pending label="Loading">
        Ready
      </Skeleton>,
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(199);
    });
    view.rerender(
      <Skeleton pending={false} label="Loading">
        Ready
      </Skeleton>,
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});
