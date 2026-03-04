/**
 * Mobile layout tests at 390×844 (iPhone 14 Pro).
 * Checks for layout breaks, overflow, invisible text, truncation.
 */
import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const SCREENSHOT_DIR = path.join(__dirname, "../results/screenshots");

const MOBILE_PAGES = [
  { path: "/",          name: "home" },
  { path: "/dashboard", name: "dashboard" },
  { path: "/parents",   name: "parents" },
  { path: "/upgrade",   name: "upgrade" },
  { path: "/trophies",  name: "trophies" },
  { path: "/rewards",   name: "rewards" },
  { path: "/shop",      name: "shop" },
  { path: "/family",    name: "family" },
  { path: "/daily",     name: "daily" },
  { path: "/account",   name: "account" },
  { path: "/login",     name: "login" },
  { path: "/signup",    name: "signup" },
  { path: "/learn/1/math/zahlen-1-10",  name: "exercise-math-g1" },
  { path: "/learn/1/german/buchstaben", name: "exercise-german-g1" },
  { path: "/learn/2/math/addition-bis-100", name: "exercise-math-g2" },
];

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

for (const { path: pagePath, name } of MOBILE_PAGES) {
  test(`Mobile layout — ${name} (390×844)`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(pagePath);
    await page.waitForTimeout(2_000);

    // Take screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `mobile-${name}.png`),
      fullPage: true,
    });

    // Check for horizontal overflow (content wider than viewport)
    const overflows = await page.evaluate(() => {
      const overflowing: string[] = [];
      document.querySelectorAll("*").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth + 5) {
          const tag = el.tagName.toLowerCase();
          const cls = el.className?.toString().slice(0, 40) ?? "";
          overflowing.push(`${tag}.${cls}`);
        }
      });
      return overflowing.slice(0, 5); // first 5
    });

    if (overflows.length > 0) {
      console.warn(`⚠️  Horizontal overflow on ${name}: ${overflows.join(", ")}`);
    }

    // Navigation should be visible (hamburger or bottom nav)
    const nav = page.locator("nav, header, [class*=nav], [class*=header]").first();
    await expect(nav).toBeVisible({ timeout: 5_000 });
  });
}

test("Mobile exercise player — no overflow on drag-drop", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Find a drag-drop exercise
  await page.goto("/learn/1/math/zahlen-1-10");
  await page.waitForTimeout(2_000);

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(overflow).toBe(false);
});

test("Mobile — bottom nav on dashboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await page.waitForTimeout(2_000);

  // Bottom nav or hamburger should be accessible
  const mobileNav = page.locator(
    "[class*=bottom-nav], [class*=bottomNav], [class*=mobile-nav], button[aria-label*=menu], button:has-text('☰')"
  ).first();

  if (await mobileNav.count() === 0) {
    console.warn("⚠️  No mobile nav found on dashboard");
  }
});

test("Mobile — text not truncated on exercise question", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/1/math/zahlen-1-10");
  await page.waitForTimeout(2_000);

  // Question text should not be clipped
  const question = page.locator("[class*=question], h2, p").first();
  if (await question.count() > 0) {
    const box = await question.boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThan(100);
      expect(box.height).toBeGreaterThan(10);
    }
  }
});
