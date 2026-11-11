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

test("flags timing, length, border, opacity, and z-index literals", () => {
  const source = `
    :root {
      --skeleton-delay: 200ms;
      --skeleton-min: 400ms;
      --toast-duration-success: 4000ms;
      --toast-duration-undo: 6000ms;
      --shimmer-duration: 1.4s;
      --toast-gap: 0.5rem;
      --toast-offset: 1.5rem;
      --sheet-enter: 1.75rem;
      --sheet-exit: 1rem;
    }
    .sheet { z-index: 30; border: 1px solid var(--color-border); }
    .sheet-overlay { z-index: 20; background: var(--color-text); opacity: 0.32; }
  `;
  const findings = inspect("packages/ui/src/fixture.css", source);
  const snippets = findings.map((finding) => finding.snippet);
  for (const literal of [
    "200ms",
    "400ms",
    "4000ms",
    "6000ms",
    "1.4s",
    "0.5rem",
    "1.5rem",
    "1.75rem",
    "1rem",
    "1px",
    "z-index: 30",
    "z-index: 20",
    "opacity: 0.32",
  ]) {
    assert.ok(
      snippets.some((snippet) => snippet.includes(literal)),
      `expected a finding for ${literal}, got ${snippets.join(" | ")}`,
    );
  }
});

test("allows tokenised timing, scrim, border width, and layers", () => {
  const source = `
    .sheet { z-index: var(--layer-modal); border-width: var(--border-width); }
    .sheet-overlay { z-index: var(--layer-overlay); background: var(--color-scrim); }
    .motion-shimmer { animation-duration: var(--shimmer-duration); }
    .toast { gap: var(--toast-gap); }
  `;
  assert.deepEqual(inspect("packages/ui/src/fixture.css", source), []);
});
