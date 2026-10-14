import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import playwright from "eslint-plugin-playwright";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(
  // Astro
  eslintPluginAstro.configs.recommended,
  {
    files: ["src/pages/**/*.astro"],
    rules: {
      "astro/no-exports-from-components": "off", // to use `export const frontmatter` w/ astro-route-generator
    },
  },
  // Global settings
  globalIgnores([
    ".astro/",
    "dist/",
    "doc/",
    "playwright-report/",
    "test-results/",
    "README.md",
    "AGENTS.md",
    // Python virtualenvs (e.g. scripts/nkr-data/.venv) bundle huge minified
    // JS assets that aren't part of this project and are extremely slow to lint.
    "**/.venv/",
    "**/venv/",
  ]),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: true,
      },
    },
  },
  // React & Typescript
  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
      reactHooks.configs.flat["recommended-latest"],
      jsxA11y.flatConfigs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      reactRefresh.configs.recommended,
      prettierPlugin, // should be the last one in the list
    ],

    settings: {
      react: { version: "detect" },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],

      "import/resolver": {
        node: { extensions: [".ts", ".tsx"] },
        typescript: {
          alwaysTryTypes: true,
          tsconfigRootDir: __dirname,
          project: ["tsconfig.json"],
        },
      },
    },

    rules: {
      "no-irregular-whitespace": [
        "error",
        {
          skipTemplates: true,
          skipJSXText: true,
        },
      ],

      // React rules
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: [
            "loader",
            "clientLoader",
            "action",
            "clientAction",
            "ErrorBoundary",
            "HydrateFallback",
            "headers",
            "handle",
            "links",
            "meta",
            "shouldRevalidate",
          ],
        },
      ],

      // TypeScript rules
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { disallowTypeAnnotations: false },
      ],
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
      "@typescript-eslint/only-throw-error": "warn",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@digitalservicebund/icons/index",
              message:
                "Import from '@digitalservicebund/icons' (package root) to prevent all icons from being bundled in dev mode.",
            },
          ],
          patterns: ["@digitalservicebund/icons/index.*"],
        },
      ],
      quotes: ["error", "double", { avoidEscape: true }],

      // Astro virtual modules (e.g. astro:middleware, astro:content) are
      // injected at build time and cannot be resolved statically.
      "import/no-unresolved": ["error", { ignore: ["^astro:"] }],
    },
  },
  // Spec/test files are excluded from the default tsconfig.json, so the
  // type-aware parser needs the test tsconfig to resolve them.
  {
    files: ["**/*.{spec,test}.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.test.json"],
        tsconfigRootDir: __dirname,
      },
    },
  },
  // Additional Rules for test files
  {
    files: ["**/a11y/*.{spec,test}.{ts,tsx}", "**/e2e/*.{spec,test}.{ts,tsx}"],
    extends: [playwright.configs["flat/recommended"]],
    plugins: { "testing-library": testingLibrary },

    rules: {
      // Testing library rules
      "testing-library/await-async-queries": "error",
      "testing-library/no-await-sync-queries": "error",
      "testing-library/no-debugging-utils": "warn",
      "testing-library/no-dom-import": "off",

      // Playwright rules
      "playwright/no-conditional-expect": "off",
      "playwright/no-conditional-in-test": "off",
      "playwright/no-skipped-test": "off",
    },
  },
  // Config files in root folder
  {
    extends: [eslint.configs.recommended],
    ignores: ["**/*", "!*.js", "!*.cjs", "!*.mjs", "!*.ts"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off",
    },
  },
);
