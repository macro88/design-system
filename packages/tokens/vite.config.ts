import path from "node:path";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [dts({ entryRoot: "src", include: ["src"] })],
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(packageRoot, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
    sourcemap: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
