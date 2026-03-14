/**
 * 21-webkit-safari.spec.ts
 *
 * Tests all key pages against production using real WebKit (Safari engine).
 * Catches React hook ordering violations (error #310) and other iOS-specific crashes.
 *
 * WHY THIS EXISTS:
 * On 2026-03-14, /missionen crashed on iOS Safari + Chrome (both use WebKit on iPhone).
 * Root cause: React hooks (useMemo/useState) were called AFTER early returns in MissionenPage.
 * Android/Chrome tolerates this; iOS WebKit enforces hook ordering strictly → hard crash (React #310).
 * Rule: ALL hooks must be called unconditionally at the top of the component, before any return.
 *
 * Run: npx playwright test tests/specs/21-webkit-safari.spec.ts
 */
import { test, expect, devices } from "@playwright/test";

const PROD = "https://www.cleverli.ch";

// Pages to test as anonymous guest (no auth)
const GUEST_PAGES = [
  { path: "/",           name: "Home" },
  { path: "/missionen",  name: "Missionen" },
  { path: "/dashboard",  name: "Dashboard" },
  { path: "/rewards",    name: "Rewards" },
  { path: "/parents",    name: "Parents" },
  { path: "/upgrade",    name: "Upgrade" },
  { path: "/login",      name: "Login" },
  { path: "/signup",     name: "Signup" },
  { path: "/impressum",  name: "Impressum" },
];

for (const { path, name } of GUEST_PAGES) {
  test(`[WebKit] ${name} — no crash on iOS Safari`, async ({ playwright }) => {
    const browser = await playwright.webkit.launch({ headless: true });
    const ctx = await browser.newContext({ ...devices["iPhone 14"] });
    const page = await ctx.newPage();

    const errors: string[] = [];
    page.on("pageerror", e => {
      // Filter known-safe errors
      if (e.message.includes("Minified React error #418")) return; // hydration noise, not a real crash
      if (e.message.includes("Failed to load resource")) return;
      if (e.message.includes("payrexx.com")) return; // Payrexx iframe CORS in headless — not a real crash
      if (e.message.includes("access control checks")) return; // same
      errors.push(e.message);
    });

    await page.goto(`${PROD}${path}`, { waitUntil: "load", timeout: 30_000 });
    await page.waitForTimeout(2_000);

    const body = await page.innerText("body").catch(() => "");
    const crashed =
      body.includes("Application error") ||
      body.includes("Unhandled Runtime Error") ||
      body.includes("Minified React error #310") || // hooks ordering
      body.includes("Minified React error #423");   // hydration

    await browser.close();

    expect(crashed, `${name} should not show Application Error on WebKit`).toBe(false);
    expect(
      errors.filter(e =>
        !e.includes("Failed to load resource") &&
        !e.includes("payrexx.com") &&
        !e.includes("access control checks")
      ),
      `${name} should have no JS errors on WebKit`
    ).toHaveLength(0);
  });
}
