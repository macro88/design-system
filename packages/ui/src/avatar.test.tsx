import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, initials } from "./avatar";

describe("Avatar", () => {
  it("exposes the name and short initials", () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveTextContent("AL");
    expect(initials("Studio")).toBe("ST");
  });
});
