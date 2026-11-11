import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";
import { Textarea } from "./textarea";

describe("Input", () => {
  it("associates the label and reports an error", async () => {
    const user = userEvent.setup();
    render(<Input label="City" error="Enter a city." />);

    const field = screen.getByRole("textbox", { name: "City" });
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter a city.")).toBeInTheDocument();
    await user.type(field, "York");
    expect(field).toHaveValue("York");
  });
});

describe("Textarea", () => {
  it("associates the label, hint, and typed value", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Message" hint="A short line." />);

    const field = screen.getByRole("textbox", { name: "Message" });
    expect(screen.getByText("A short line.")).toBeInTheDocument();
    await user.type(field, "Hello");
    expect(field).toHaveValue("Hello");
  });
});
