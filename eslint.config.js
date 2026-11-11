import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/storybook-static/**", "coverage/**"],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
  },
  {
    files: ["**/*.stories.@(ts|tsx)"],
    plugins: { storybook },
    rules: {
      "storybook/default-exports": "error",
      "storybook/hierarchy-separator": "warn",
      "storybook/no-redundant-story-name": "warn",
      "storybook/no-renderer-packages": "error",
      "storybook/prefer-pascal-case": "warn",
      "storybook/story-exports": "error",
    },
  },
  {
    files: ["**/.storybook/main.@(ts|js|mjs|cjs)"],
    plugins: { storybook },
    rules: {
      "storybook/no-uninstalled-addons": [
        "error",
        { packageJsonLocation: "apps/storybook/package.json" },
      ],
    },
  },
  prettier,
);
