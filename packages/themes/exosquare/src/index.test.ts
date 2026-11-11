import { describe, expect, it } from "vitest";
import { packageName, palette, themeId } from "./index";

describe("@macro88/theme-exosquare", () => {
  it("exports the package name and a temporary palette id", () => {
    expect(packageName).toBe("@macro88/theme-exosquare");
    expect(themeId).toBe("exosquare");
    expect(palette).toBe("temporary");
  });
});
