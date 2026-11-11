/**
 * Reject hard-coded visual values under packages/ui and packages/patterns.
 *
 * Hex colours, colour functions, Tailwind arbitrary visual values, and inline
 * style objects that set colour, font, radius, spacing, or motion all fail
 * the check. Token utility classes, var(--…) references, and composition
 * helpers are allowed.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const roots = [path.join(repoRoot, "packages", "ui"), path.join(repoRoot, "packages", "patterns")];

const HEX_COLOUR =
  /(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![A-Za-z0-9_])/g;
const COLOUR_FUNCTION = /(?<![\w-])(?:rgba?|hsla?|hwb|oklch|oklab|color-mix)\(/gi;
const ARBITRARY_UTILITY = /(?<![\w-])!?-?(?:[A-Za-z0-9_-]+:)*(-?[A-Za-z][\w-]*)-\[([^\]]+)\]/g;

const VISUAL_UTILITY_PREFIXES = [
  "accent",
  "bg",
  "border",
  "bottom",
  "caret",
  "decoration",
  "delay",
  "divide",
  "duration",
  "ease",
  "end",
  "fill",
  "font",
  "from",
  "gap",
  "gap-x",
  "gap-y",
  "h",
  "inset",
  "inset-x",
  "inset-y",
  "leading",
  "left",
  "m",
  "max-h",
  "max-w",
  "mb",
  "me",
  "min-h",
  "min-w",
  "ml",
  "mr",
  "ms",
  "mt",
  "mx",
  "my",
  "outline",
  "p",
  "pb",
  "pe",
  "placeholder",
  "pl",
  "pr",
  "ps",
  "pt",
  "px",
  "py",
  "right",
  "ring",
  "rounded",
  "shadow",
  "size",
  "space-x",
  "space-y",
  "start",
  "stroke",
  "text",
  "to",
  "top",
  "tracking",
  "via",
  "w",
];

const VISUAL_PROP_PREFIXES = [
  "animation",
  "background",
  "border",
  "boxshadow",
  "font",
  "gap",
  "height",
  "inset",
  "letterspacing",
  "lineheight",
  "margin",
  "maxheight",
  "maxwidth",
  "minheight",
  "minwidth",
  "outline",
  "padding",
  "rowgap",
  "columngap",
  "transition",
  "width",
];

const VISUAL_PROP_EXACT = new Set([
  "accentcolor",
  "bottom",
  "caretcolor",
  "color",
  "fill",
  "left",
  "right",
  "stroke",
  "top",
]);

function maskComments(source) {
  let out = "";
  let mode = "code";
  let index = 0;

  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];

    if (mode === "code") {
      if (current === "/" && next === "/") {
        out += "  ";
        index += 2;
        mode = "line";
        continue;
      }
      if (current === "/" && next === "*") {
        out += "  ";
        index += 2;
        mode = "block";
        continue;
      }
      if (current === "'" || current === '"' || current === "`") {
        out += current;
        mode = current;
        index += 1;
        continue;
      }
      out += current;
      index += 1;
      continue;
    }

    if (mode === "line") {
      if (current === "\n") {
        out += "\n";
        mode = "code";
      } else {
        out += " ";
      }
      index += 1;
      continue;
    }

    if (mode === "block") {
      if (current === "*" && next === "/") {
        out += "  ";
        index += 2;
        mode = "code";
        continue;
      }
      out += current === "\n" ? "\n" : " ";
      index += 1;
      continue;
    }

    if (current === "\\") {
      out += current;
      if (next === undefined) {
        index += 1;
        continue;
      }
      out += next === "\n" ? "\n" : next;
      index += 2;
      continue;
    }

    out += current;
    if (current === mode) mode = "code";
    index += 1;
  }

  return out;
}

function lineNumberAt(source, index) {
  let line = 1;
  for (let offset = 0; offset < index; offset += 1) {
    if (source.charCodeAt(offset) === 10) line += 1;
  }
  return line;
}

function isVisualUtility(name) {
  const normalised = name.startsWith("-") ? name.slice(1) : name;
  return VISUAL_UTILITY_PREFIXES.some(
    (prefix) => normalised === prefix || normalised.startsWith(`${prefix}-`),
  );
}

function skipSpace(source, index) {
  let offset = index;
  while (source[offset] === " " || source[offset] === "\t" || source[offset] === "\n") offset += 1;
  return offset;
}

function isTokenExpression(value) {
  const source = value.trim();
  let index = 0;

  function parseVar() {
    if (!source.startsWith("var(", index)) return false;
    index += 4;
    index = skipSpace(source, index);
    if (!source.startsWith("--", index)) return false;
    index += 2;
    const name = source.slice(index).match(/^[\w-]+/);
    if (!name) return false;
    index += name[0].length;
    index = skipSpace(source, index);
    if (source.startsWith(",", index)) {
      index += 1;
      if (!parseValue()) return false;
      index = skipSpace(source, index);
    }
    if (!source.startsWith(")", index)) return false;
    index += 1;
    return true;
  }

  function parseCalcInner() {
    index = skipSpace(source, index);
    if (source[index] === ")") return true;
    while (index < source.length && source[index] !== ")") {
      index = skipSpace(source, index);
      if (source.startsWith("var(", index)) {
        if (!parseVar()) return false;
      } else if (source[index] === "(") {
        index += 1;
        if (!parseCalcInner()) return false;
        if (source[index] !== ")") return false;
        index += 1;
      } else if (source[index] && "+-*/%".includes(source[index])) {
        index += 1;
      } else {
        return false;
      }
      index = skipSpace(source, index);
    }
    return true;
  }

  function parseValue() {
    index = skipSpace(source, index);
    if (source.startsWith("var(", index)) return parseVar();
    if (source.startsWith("calc(", index)) {
      index += 5;
      if (!parseCalcInner()) return false;
      if (source[index] !== ")") return false;
      index += 1;
      return true;
    }
    return false;
  }

  if (!parseValue()) return false;
  index = skipSpace(source, index);
  return index === source.length;
}

function isVisualProperty(name) {
  const normalised = name.toLowerCase().replaceAll("-", "");
  if (VISUAL_PROP_EXACT.has(normalised) || normalised.endsWith("color")) return true;
  return VISUAL_PROP_PREFIXES.some(
    (prefix) => normalised === prefix || normalised.startsWith(prefix),
  );
}

function isAllowedStyleValue(value) {
  const trimmed = value.trim().replace(/,$/, "").trim();
  const quoted = trimmed.match(/^(["'`])([\s\S]*)\1$/);
  if (quoted) return isTokenExpression(quoted[2]);
  return /^[A-Za-z_$][\w$]*$/.test(trimmed);
}

function matchingBrace(source, openIndex) {
  let depth = 0;
  let mode = "code";

  for (let index = openIndex; index < source.length; index += 1) {
    const current = source[index];
    const next = source[index + 1];

    if (mode === "code") {
      if (current === "'" || current === '"' || current === "`") {
        mode = current;
        continue;
      }
      if (current === "{") depth += 1;
      if (current === "}") {
        depth -= 1;
        if (depth === 0) return index;
      }
      continue;
    }

    if (current === "\\") {
      index += 1;
      continue;
    }
    if (current === mode) mode = "code";
    if (mode === "line" && current === "\n") mode = "code";
    void next;
  }

  return -1;
}

function styleProperties(body) {
  const properties = [];
  const pattern = /(?:^|,)\s*(['"]?)([A-Za-z_$][\w$-]*)\1\s*:\s*([^,\n]+)/g;
  let match = pattern.exec(body);

  while (match) {
    properties.push({
      name: match[2],
      value: match[3],
      index: match.index,
    });
    match = pattern.exec(body);
  }

  return properties;
}

async function collectFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function displayPath(file) {
  return path.relative(repoRoot, file).split(path.sep).join("/");
}

function addFinding(findings, file, source, index, snippet) {
  findings.push({
    file: displayPath(file),
    line: lineNumberAt(source, index),
    snippet: snippet.trim(),
  });
}

function inspect(file, source) {
  const findings = [];
  const masked = maskComments(source);

  for (const match of masked.matchAll(HEX_COLOUR)) {
    addFinding(findings, file, source, match.index ?? 0, match[0]);
  }

  for (const match of masked.matchAll(COLOUR_FUNCTION)) {
    addFinding(findings, file, source, match.index ?? 0, match[0]);
  }

  for (const match of masked.matchAll(ARBITRARY_UTILITY)) {
    const name = match[1] ?? "";
    const value = match[2] ?? "";
    if (!isVisualUtility(name) || isTokenExpression(value)) continue;
    addFinding(findings, file, source, match.index ?? 0, match[0]);
  }

  const styleAttribute = /style\s*=\s*\{/g;
  for (const match of masked.matchAll(styleAttribute)) {
    const openIndex = (match.index ?? 0) + match[0].length - 1;
    const closeIndex = matchingBrace(masked, openIndex);
    if (closeIndex < 0) continue;
    const expression = masked.slice(openIndex + 1, closeIndex);
    const objectOffset = expression.indexOf("{");
    if (objectOffset < 0) continue;
    const objectOpen = openIndex + 1 + objectOffset;
    const objectClose = matchingBrace(masked, objectOpen);
    if (objectClose < 0) continue;
    const body = masked.slice(objectOpen + 1, objectClose);

    for (const property of styleProperties(body)) {
      if (!isVisualProperty(property.name) || isAllowedStyleValue(property.value)) continue;
      addFinding(
        findings,
        file,
        source,
        objectOpen + 1 + property.index,
        `${property.name}: ${property.value.trim()}`,
      );
    }
  }

  return findings;
}

async function main() {
  const files = [];
  for (const root of roots) {
    files.push(...(await collectFiles(root)));
  }
  const findings = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    findings.push(...inspect(file, source));
  }

  if (findings.length === 0) {
    console.log("packages/ui and packages/patterns: no hard-coded visual values.");
    return;
  }

  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line}: ${finding.snippet}`);
  }
  console.error(`${findings.length} hard-coded visual value${findings.length === 1 ? "" : "s"}.`);
  process.exitCode = 1;
}

await main();
