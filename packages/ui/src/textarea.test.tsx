import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("associates the label, hint, and typed value", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Message" hint="A short line." />);

    const field = screen.getByRole("textbox", { name: "Message" });
    expect(screen.getByText("A short line.")).toBeInTheDocument();
    await user.type(field, "Hello");
    expect(field).toHaveValue("Hello");
  });

  it("reports an error", () => {
    render(<Textarea label="Message" error="Enter a message." />);
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("Enter a message.")).toBeInTheDocument();
  });
});
