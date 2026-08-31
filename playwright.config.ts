import { defineConfig } from "@playwright/test";

const vercelProtectionBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "./tests",
  // Resolve @/ imports from src/ (same as Next.js tsconfig paths)
  // Playwright uses its own TS compiler — we pass the paths via the global config
  // (actual resolution done in tsconfig below)
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,   // keep sequential — tests share localStorage state
  retries: 1,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "tests/results/report.json" }],
    ["html", { outputFolder: "tests/results/html", open: "never" }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "https://www.cleverli.ch",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 390, height: 844 },   // iPhone 14 Pro — default for all tests
    locale: "de-CH",
    extraHTTPHeaders: vercelProtectionBypass
      ? {
          "x-vercel-protection-bypass": vercelProtectionBypass,
          "x-vercel-set-bypass-cookie": "true",
        }
      : undefined,
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        storageState: "tests/.auth/state.json",
      },
      dependencies: ["setup"],
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
