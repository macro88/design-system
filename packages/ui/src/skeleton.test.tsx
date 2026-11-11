import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

function wait(ms: number) {
  return act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

describe("Skeleton", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty("--skeleton-delay");
    document.documentElement.style.removeProperty("--skeleton-min");
  });

  it("waits before showing, then stays for the minimum time", async () => {
    document.documentElement.style.setProperty("--skeleton-delay", "30ms");
    document.documentElement.style.setProperty("--skeleton-min", "80ms");
    const view = render(
      <Skeleton pending label="Loading">
        Ready
      </Skeleton>,
    );

    await wait(10);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await wait(40);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();

    view.rerender(
      <Skeleton pending={false} label="Loading">
        Ready
      </Skeleton>,
    );
    await wait(20);
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    await wait(80);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("does not show when the work finishes during the delay", async () => {
    document.documentElement.style.setProperty("--skeleton-delay", "40ms");
    const view = render(
      <Skeleton pending label="Loading">
        Ready
      </Skeleton>,
    );
    await wait(15);
    view.rerender(
      <Skeleton pending={false} label="Loading">
        Ready
      </Skeleton>,
    );
    await wait(50);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});
