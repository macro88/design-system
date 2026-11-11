import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("shows a title, a line, and the action", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState title="Nothing here" action={<Button onClick={onClick}>Continue</Button>}>
        Try another step.
      </EmptyState>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Nothing here" })).toBeInTheDocument();
    expect(screen.getByText("Try another step.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses the requested heading level", () => {
    render(<EmptyState title="Nothing here" headingLevel={3} />);
    expect(screen.getByRole("heading", { level: 3, name: "Nothing here" })).toBeInTheDocument();
  });
});
