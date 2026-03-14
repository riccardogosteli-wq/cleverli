#!/usr/bin/env ts-node
/**
 * check-hooks-order.ts
 *
 * Static analysis: detect React hooks called after early returns.
 * This is the root cause of React error #310 (iOS Safari hard crash).
 *
 * Rule: In a React component, all hook calls must come BEFORE any `return` statement.
 *
 * Run: npx ts-node scripts/check-hooks-order.ts
 * Or add to package.json: "lint:hooks": "npx ts-node scripts/check-hooks-order.ts"
 */

import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";

const HOOK_PATTERN = /\b(useState|useEffect|useMemo|useCallback|useRef|useContext|useReducer|useLayoutEffect|useLang|useSession|useProfileContext|useVoice)\s*[(<(]/;
const RETURN_PATTERN = /^\s*(return\s+|return;)/;

// Files to scan
const files = glob.sync("src/**/*.{tsx,ts}", {
  cwd: path.resolve(__dirname, ".."),
  absolute: true,
  ignore: ["**/*.d.ts", "**/node_modules/**", "**/.next/**"],
});

let violations = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");

  // Simple heuristic: find function components (lines with "function" + uppercase or "const X = ")
  // and track first return, then look for hooks after it.
  // This is intentionally conservative — false negatives are OK, false positives are noise.

  let inComponent = false;
  let componentName = "";
  let braceDepth = 0;
  let componentBraceStart = 0;
  let firstReturnLine = -1;
  let componentStart = 0;
  const fileViolations: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect component start: "export default function Foo" or "function Foo(" (uppercase)
    const funcMatch = line.match(/(?:export\s+default\s+function|export\s+function|^function)\s+([A-Z][a-zA-Z0-9]*)\s*\(/);
    if (funcMatch && !inComponent) {
      inComponent = true;
      componentName = funcMatch[1];
      componentStart = i + 1;
      componentBraceStart = braceDepth;
      firstReturnLine = -1;
    }

    if (inComponent) {
      // Track brace depth to know when component ends
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      if (braceDepth <= componentBraceStart && i > componentStart) {
        // Component ended
        inComponent = false;
        firstReturnLine = -1;
        continue;
      }

      // Skip comments
      if (line.trim().startsWith("//") || line.trim().startsWith("*")) continue;

      // Track first early return (not the final return at end of component)
      if (firstReturnLine === -1 && RETURN_PATTERN.test(line)) {
        firstReturnLine = i + 1;
      }

      // Check for hooks after first return
      if (firstReturnLine !== -1 && i + 1 > firstReturnLine && HOOK_PATTERN.test(line)) {
        // Skip if inside a useEffect/useMemo callback (indented inside hook)
        const hookMatch = line.match(HOOK_PATTERN);
        if (hookMatch) {
          fileViolations.push(
            `  Line ${i + 1}: \`${line.trim().substring(0, 80)}\` (after return on line ${firstReturnLine})`
          );
        }
      }
    }
  }

  if (fileViolations.length > 0) {
    const relPath = path.relative(path.resolve(__dirname, ".."), file);
    console.error(`\n🚨 ${relPath} — hooks after early return in component:`);
    fileViolations.forEach(v => console.error(v));
    violations += fileViolations.length;
  }
}

if (violations === 0) {
  console.log("✅ No hooks-after-return violations found.");
  process.exit(0);
} else {
  console.error(`\n❌ Found ${violations} hooks-after-return violation(s).`);
  console.error("Fix: Move all hook calls to the TOP of the component, before any return statement.");
  console.error("See: https://react.dev/errors/310");
  process.exit(1);
}
