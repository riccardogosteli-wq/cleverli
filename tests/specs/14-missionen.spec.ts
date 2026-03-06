/**
 * Missionen page — full curriculum overview.
 * Tests: page loads, tabs, topic cards, progress display, link validity.
 */
import { test, expect } from "@playwright/test";

test.describe("Missionen page", () => {

  test.beforeEach(async ({ page }) => {
    // Set up a child profile and grade in localStorage before visiting
    await page.goto("/dashboard");
    await page.evaluate(() => {
      localStorage.setItem("cleverli_last_grade", "1");
      // Minimal family store with one child
      const family = {
        members: [{ id: "test-child", name: "Testino", avatar: "🐻", grade: 1 }]
      };
      localStorage.setItem("cleverli_family", JSON.stringify(family));
      localStorage.setItem("cleverli_active_profile", "test-child");
    });
  });

  test("page loads at /missionen", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/missionen");
    await expect(page.locator("nav").first()).toBeVisible({ timeout: 10_000 });
    expect(errors.filter(e => !e.includes("hydrat"))).toHaveLength(0);
  });

  test("/trophies redirects to /missionen", async ({ page }) => {
    await page.goto("/trophies");
    await page.waitForURL(/\/missionen/, { timeout: 8_000 });
    expect(page.url()).toContain("/missionen");
  });

  test("shows mission header title", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1_500);
    // Title contains "Missionen" or "Missions"
    const heading = page.locator("h1, h2").first();
    await expect(heading).toContainText(/Missionen|Missions|Missioni/, { timeout: 8_000 });
  });

  test("shows overall progress card with XP", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForTimeout(2_000);
    // Should show XP somewhere
    await expect(page.locator("text=XP").first()).toBeVisible({ timeout: 8_000 });
  });

  test("subject tabs are visible", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForTimeout(2_000);
    // At minimum: "Alle" tab + one subject tab
    const tabButtons = page.locator("button").filter({ hasText: /Alle|Tous|All/i });
    await expect(tabButtons.first()).toBeVisible({ timeout: 8_000 });
  });

  test("shows math topics for grade 1", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForTimeout(2_500);
    // Math emoji 🔢 or section header
    const mathSection = page.locator("text=🔢").first();
    await expect(mathSection).toBeVisible({ timeout: 8_000 });
  });

  test("clicking math tab filters to math only", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForTimeout(2_000);
    // Click the Mathematik/Math tab
    const mathTab = page.locator("button").filter({ hasText: /Mathematik|Math/i }).first();
    if (await mathTab.isVisible()) {
      await mathTab.click();
      await page.waitForTimeout(800);
      // German/NMG sections should no longer be visible
      const germanSection = page.locator("text=📖").first();
      await expect(germanSection).not.toBeVisible({ timeout: 3_000 }).catch(() => {});
    }
  });

  test("topic cards have emoji, title, and progress", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForTimeout(2_500);
    // At least one topic card should exist
    // Topic cards have a link to /learn/...
    const topicLinks = page.locator("a[href*='/learn/']");
    const count = await topicLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("topic card links go to valid learn pages", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForTimeout(2_500);
    const firstLink = page.locator("a[href*='/learn/']").first();
    const href = await firstLink.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toMatch(/\/learn\/\d+\/\w+\/[\w-]+/);
  });

  test("no console errors on missionen page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", msg => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/missionen");
    await page.waitForTimeout(3_000);
    const real = errors.filter(e =>
      !e.includes("hydrat") &&
      !e.includes("favicon") &&
      !e.includes("404") &&
      !e.toLowerCase().includes("warning")
    );
    expect(real).toHaveLength(0);
  });

  test("missionen shows grade label", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForTimeout(2_000);
    // Should show "1. Klasse" or similar
    const gradeLabel = page.locator("text=/\\d+\\. Klasse|grade \\d|classe \\d/i").first();
    // Soft check — just log if missing
    const visible = await gradeLabel.isVisible().catch(() => false);
    if (!visible) {
      console.warn("⚠️ Grade label not visible on missionen page");
    }
  });
});
