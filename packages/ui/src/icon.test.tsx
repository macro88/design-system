import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";

describe("Icon", () => {
  it("renders the supplied graphic", () => {
    const { container } = render(
      <Icon>
        <svg data-testid="mark" viewBox="0 0 24 24">
          <path d="M4 12h16" />
        </svg>
      </Icon>,
    );

    expect(container.querySelector("svg")).not.toBeNull();
  });
});
