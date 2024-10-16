import globals from "globals";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  prettier,
  {
    files: ["src/**/*.js"],
    ignores: ["node_modules"],
    rules: {
      eqeqeq: "warn",
      "no-unused-vars": "warn",
      "no-var": "error",
      "prefer-const": "warn",
      "no-undef": "error",
      "callback-return": "warn",
      "no-useless-escape": "warn",
      "no-duplicate-imports": "error",
      "no-console": ["warn", { allow: ["error"] }],
    },
  },
];
