import assert from "node:assert/strict";
import test from "node:test";
import { inspect } from "./lint-visuals.mjs";

test("flags a literal fallback inside var()", () => {
  const findings = inspect(
    "packages/ui/src/fixture.css",
    ".a { transition-duration: var(--x, 120ms); }",
  );
  assert.equal(findings.length, 1);
  assert.match(findings[0].snippet, /120ms/);
});

test("allows a bare var()", () => {
  const findings = inspect("packages/ui/src/fixture.css", ".a { transition-duration: var(--x); }");
  assert.deepEqual(findings, []);
});
