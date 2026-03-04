/**
 * Smoke tests — all pages load without crash, key elements visible.
 */
import { test, expect } from "@playwright/test";

// All pages use `main` as the reliable check — Next.js always renders it.
// h1/h2 not used because client-side hydration can delay them.
const PAGES = [
  { path: "/",           name: "Home",        check: "main" },
  { path: "/dashboard",  name: "Dashboard",   check: "main" },
  { path: "/parents",    name: "Parents",     check: "main" },
  { path: "/upgrade",    name: "Upgrade",     check: "main" },
  { path: "/trophies",   name: "Trophies",    check: "main" },
  { path: "/rewards",    name: "Rewards",     check: "main" },
  { path: "/shop",       name: "Shop",        check: "main" },
  { path: "/family",     name: "Family",      check: "main" },
  { path: "/daily",      name: "Daily",       check: "main" },
  { path: "/account",    name: "Account",     check: "main" },
  { path: "/agb",        name: "AGB",         check: "main" },
  { path: "/datenschutz", name: "Datenschutz", check: "main" },
  { path: "/impressum",  name: "Impressum",   check: "main" },
];

for (const { path, name, check } of PAGES) {
  test(`${name} page loads without crash`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", err => errors.push(err.message));
    page.on("console", msg => {
      if (msg.type() === "error" && !msg.text().includes("favicon")) {
        errors.push(msg.text());
      }
    });

    const res = await page.goto(path);
    expect(res?.status(), `${name} returned non-2xx`).toBeLessThan(400);

    await expect(page.locator(check).first()).toBeVisible({ timeout: 10_000 });

    // No JS crashes (filter known noise)
    const realErrors = errors.filter(e =>
      !e.includes("ResizeObserver") &&
      !e.includes("Non-Error promise") &&
      !e.includes("favicon")
    );
    expect(realErrors, `JS errors on ${name}: ${realErrors.join(" | ")}`).toHaveLength(0);
  });
}

test("404 page shows custom not-found", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist-xyz");
  // Next.js not-found renders with 404
  expect(res?.status()).toBe(404);
  await expect(page.locator("body")).toBeVisible();
});

test("sitemap.xml is accessible", async ({ page }) => {
  const res = await page.goto("/sitemap.xml");
  expect(res?.status()).toBe(200);
  const body = await page.content();
  expect(body).toContain("cleverli.ch");
});

test("robots.txt is accessible", async ({ page }) => {
  const res = await page.goto("/robots.txt");
  expect(res?.status()).toBe(200);
});
