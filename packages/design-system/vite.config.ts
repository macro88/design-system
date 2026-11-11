import path from "node:path";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));
const testing = process.env.VITEST === "true";

export default defineConfig({
  plugins: testing
    ? []
    : [
        dts({
          entryRoot: "src",
          include: ["src"],
          pathsToAliases: false,
          tsconfigPath: "tsconfig.dts.json",
        }),
      ],
  resolve: testing
    ? {
        alias: {
          "@macro88/motion": path.resolve(packageRoot, "../motion/src/index.ts"),
          "@macro88/patterns": path.resolve(packageRoot, "../patterns/src/index.ts"),
          "@macro88/tokens": path.resolve(packageRoot, "../tokens/src/index.ts"),
          "@macro88/ui": path.resolve(packageRoot, "../ui/src/index.ts"),
        },
      }
    : undefined,
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(packageRoot, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^@macro88\//],
    },
    sourcemap: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
