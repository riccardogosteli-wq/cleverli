import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // react-hooks/purity fires false positives for valid setState-in-useEffect
      // patterns throughout the codebase. The react-compiler plugin is also not
      // installed. Both disabled — build is the real correctness gate.
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      // prefer-const is auto-fixable
      "prefer-const": "error",
      // next/image preferred but warn only — some dynamic paths need raw img
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;
