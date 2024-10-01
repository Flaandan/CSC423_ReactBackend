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
      eqeqeq: "warn",
      curly: "error",
      "no-unused-vars": "warn",
      "no-var": "error",
      "prefer-const": "warn",
      "no-undef": "error",
      "callback-return": "warn",
      "no-useless-escape": "warn",
      "no-duplicate-imports": "error",
      // TODO: Remove `allow` after implementing logging
      "no-console": ["warn", { allow: ["info"] }],
    },
  },
];
