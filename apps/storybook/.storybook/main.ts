import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(tailwindcss());
    viteConfig.resolve ??= {};
    const alias = [
      {
        find: /^@macro88\/design-system$/,
        replacement: path.join(repoRoot, "packages/design-system/src/index.ts"),
      },
      {
        find: /^@macro88\/motion$/,
        replacement: path.join(repoRoot, "packages/motion/src/index.ts"),
      },
      {
        find: /^@macro88\/patterns$/,
        replacement: path.join(repoRoot, "packages/patterns/src/index.ts"),
      },
      {
        find: /^@macro88\/tokens$/,
        replacement: path.join(repoRoot, "packages/tokens/src/index.ts"),
      },
      {
        find: /^@macro88\/ui$/,
        replacement: path.join(repoRoot, "packages/ui/src/index.ts"),
      },
    ];
    const existing = viteConfig.resolve.alias ?? [];
    const existingList = Array.isArray(existing)
      ? existing
      : Object.entries(existing).map(([find, replacement]) => ({
          find,
          replacement,
        }));
    viteConfig.resolve.alias = [...existingList, ...alias];
    return viteConfig;
  },
};

export default config;
