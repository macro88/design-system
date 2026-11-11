import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";

function Mark() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

describe("IconButton", () => {
  it("exposes the required name and runs its action", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton label="Close" onClick={onClick}>
        <Icon>
          <Mark />
        </Icon>
      </IconButton>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("rejects a blank accessible name", () => {
    expect(() =>
      render(
        <IconButton label=" ">
          <Mark />
        </IconButton>,
      ),
    ).toThrow(/accessible name/);
  });
});
