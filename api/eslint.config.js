import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  ...ts.configs.recommended,
  prettier,
  {
    files: ["src/**/*.ts"],
    ignores: ["node_modules"],
    rules: {
      eqeqeq: "warn",
      "no-unused-vars": "off",
      "no-var": "error",
      "prefer-const": "warn",
      "no-undef": "error",
      "callback-return": "warn",
      "no-useless-escape": "warn",
      "no-duplicate-imports": "error",
      // TODO: Remove `allow` after implementing custom logging
      "no-console": ["warn", { allow: ["info", "error"] }],
    },
  },
];
