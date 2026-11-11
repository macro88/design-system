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
    const alias = {
      "@macro88/design-system": path.join(repoRoot, "packages/design-system/src/index.ts"),
      "@macro88/motion": path.join(repoRoot, "packages/motion/src/index.ts"),
      "@macro88/patterns": path.join(repoRoot, "packages/patterns/src/index.ts"),
      "@macro88/tokens": path.join(repoRoot, "packages/tokens/src/index.ts"),
      "@macro88/ui": path.join(repoRoot, "packages/ui/src/index.ts"),
    };
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      ...alias,
    };
    return viteConfig;
  },
};

export default config;
