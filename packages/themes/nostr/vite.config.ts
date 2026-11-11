import path from "node:path";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));
const testing = process.env.VITEST === "true";

export default defineConfig({
  resolve: testing
    ? {
        alias: [
          {
            find: /^@macro88\/motion$/,
            replacement: path.resolve(packageRoot, "../../motion/src/index.ts"),
          },
          {
            find: /^@macro88\/tokens$/,
            replacement: path.resolve(packageRoot, "../../tokens/src/index.ts"),
          },
        ],
      }
    : undefined,
  plugins: testing
    ? []
    : [
        dts({
          entryRoot: "src",
          include: ["src"],
          exclude: ["src/**/*.test.ts"],
          pathsToAliases: false,
          tsconfigPath: "tsconfig.dts.json",
        }),
      ],
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
