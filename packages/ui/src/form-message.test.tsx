import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormMessage, InlineError } from "./form-message";

describe("FormMessage", () => {
  it("exposes an error as an alert and a hint as text", () => {
    render(
      <>
        <InlineError>That could not be saved.</InlineError>
        <FormMessage>Optional detail.</FormMessage>
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("That could not be saved.");
    expect(screen.getByText("Optional detail.")).toBeInTheDocument();
  });
});
