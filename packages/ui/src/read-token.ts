/** Read a root custom property. Milliseconds stay milliseconds, seconds become milliseconds, and rem becomes pixels. */
export function readToken(name: string): number {
  if (typeof document === "undefined") {
    throw new Error(`Token ${name} is not available.`);
  }
  const inline = document.documentElement.style.getPropertyValue(name).trim();
  const raw = inline || getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) throw new Error(`Missing token ${name}.`);
  return parseToken(raw);
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
