import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./segmented-control";

describe("SegmentedControl", () => {
  it("moves the selection with the arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        label="Layout"
        defaultValue="list"
        onValueChange={onValueChange}
        options={[
          { value: "list", label: "List" },
          { value: "grid", label: "Grid" },
        ]}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "List" }));
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: "Grid" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("grid");
  });
});
