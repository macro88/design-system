import { readFileSync } from "node:fs";

const tag = process.env.TAG ?? "";
const expected = tag.replace(/^v/, "");
const packages = [
  ["@macro88/tokens", "packages/tokens/package.json"],
  ["@macro88/ui", "packages/ui/package.json"],
  ["@macro88/motion", "packages/motion/package.json"],
  ["@macro88/theme-runifly", "packages/themes/runifly/package.json"],
  ["@macro88/theme-nostr", "packages/themes/nostr/package.json"],
  ["@macro88/theme-exosquare", "packages/themes/exosquare/package.json"],
];

if (!tag.startsWith("v") || expected.length === 0) {
  console.error(`Refusing to release "${tag}". The tag must look like vX.Y.Z.`);
  process.exit(1);
}

const mismatches = [];
for (const [name, file] of packages) {
  const version = JSON.parse(readFileSync(file, "utf8")).version;
  if (version !== expected) mismatches.push(`${name} is ${version}, tag requires ${expected}`);
}

if (mismatches.length > 0) {
  console.error(`Refusing to release ${tag}. The tag version does not match the packages:`);
  for (const line of mismatches) console.error(line);
  process.exit(1);
}

console.log(`${tag} matches tokens, ui, motion, and the three themes.`);
