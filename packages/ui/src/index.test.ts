import { describe, expect, it } from "vitest";
import { packageName } from "./index";

describe("@macro88/ui", () => {
  it("exports the package name", () => {
    expect(packageName).toBe("@macro88/ui");
  });
});
