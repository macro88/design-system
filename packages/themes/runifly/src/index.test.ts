import { describe, expect, it } from "vitest";
import { packageName, palette, themeId } from "./index";

describe("@macro88/theme-runifly", () => {
  it("exports the package name and a temporary palette id", () => {
    expect(packageName).toBe("@macro88/theme-runifly");
    expect(themeId).toBe("runifly");
    expect(palette).toBe("temporary");
  });
});
