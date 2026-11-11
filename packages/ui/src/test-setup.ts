import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";

const tokenDefaults: Record<string, string> = {
  "--skeleton-delay": "200ms",
  "--skeleton-min": "400ms",
  "--toast-gap": "0.5rem",
  "--toast-offset": "1.5rem",
  "--toast-duration-success": "4000ms",
  "--toast-duration-undo": "6000ms",
  "--sheet-enter": "1.75rem",
  "--sheet-exit": "1rem",
  "--shimmer-duration": "1.4s",
};

beforeEach(() => {
  for (const [name, value] of Object.entries(tokenDefaults)) {
    document.documentElement.style.setProperty(name, value);
  }
});

afterEach(() => {
  cleanup();
});

Element.prototype.scrollIntoView = () => {};

window.requestAnimationFrame = (callback) => window.setTimeout(() => callback(Date.now()), 0);
window.cancelAnimationFrame = (handle) => window.clearTimeout(handle);

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}

if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
