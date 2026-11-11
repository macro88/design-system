import { describe, expect, it } from "vitest";
import { focusRingClass, packageName, typeClass } from "./index";

describe("@macro88/ui", () => {
  it("exports the package name, focus ring, and type classes", () => {
    expect(packageName).toBe("@macro88/ui");
    expect(focusRingClass).toBe("focus-ring");
    expect(typeClass.bodyMd).toBe("type-body-md");
    expect(typeClass.tabular).toBe("type-tabular");
  });
});
