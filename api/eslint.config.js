import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.js"],
    ignores: ["/node_modules"],
    rules: {
      eqeqeq: "warn", // Enforce strict equality
      curly: "error", // Require curly braces for control statements
      "no-unused-vars": "warn", // Warn on unused variables

      "no-var": "error", // Disallow var, enforce let/const
      "prefer-const": "warn", // Prefer const when variables are not reassigned
      "no-undef": "error", // Disallow the use of undeclared variables

      "callback-return": "warn", // Warn if callback is not returned

      "no-useless-escape": "warn", // Warn for unnecessary escape sequences
      "no-duplicate-imports": "error", // Disallow duplicate import statements
    },
  },
];
