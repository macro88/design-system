function declared(name: string, seen = new Set<string>()): string {
  if (seen.has(name)) throw new Error(`Token ${name} refers to itself.`);
  seen.add(name);
  if (typeof document === "undefined") {
    throw new Error(`Token ${name} is not available.`);
  }
  const inline = document.documentElement.style.getPropertyValue(name).trim();
  const raw = inline || getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) throw new Error(`Missing token ${name}.`);
  const alias = raw.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (alias?.[1]) return declared(alias[1], seen);
  return raw;
}

/** Read a root custom property. Milliseconds stay milliseconds, seconds become milliseconds, and rem becomes pixels. */
export function readToken(name: string): number {
  return parseToken(declared(name));
}

/** Read a cubic-bezier custom property, following a single `var(--…)` alias. */
export function readEase(name: string): [number, number, number, number] {
  const raw = declared(name);
  const match = raw.match(
    /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/,
  );
  if (!match) throw new Error(`Token ${name} is not a cubic bezier.`);
  return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
}

export function parseToken(raw: string): number {
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) throw new Error(`Token value "${raw}" is not a number.`);
  if (raw.endsWith("ms")) return value;
  if (raw.endsWith("s")) return value * 1000;
  if (raw.endsWith("rem")) {
    const fontSize = getComputedStyle(document.documentElement).fontSize;
    const root = Number.parseFloat(fontSize);
    if (!Number.isFinite(root)) throw new Error("Root font size is not a length.");
    return value * root;
  }
  if (raw.endsWith("px")) return value;
  return value;
}
