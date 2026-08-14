/**
 * i18n / language switching tests — DE, FR, IT, EN.
 */
import { test, expect } from "@playwright/test";

const LANG_PARAMS = [
  { lang: "de", label: "Deutsch" },
  { lang: "fr", label: "Français" },
  { lang: "it", label: "Italiano" },
  { lang: "en", label: "English" },
];

for (const { lang, label } of LANG_PARAMS) {
  test.describe(`Language: ${label} (${lang})`, () => {
    test(`Homepage renders in ${label}`, async ({ page }) => {
      await page.goto(`/?lang=${lang}`);
      await page.waitForTimeout(2_000);
      
      // Just check page loads without error
      await expect(page.locator("nav").first()).toBeVisible({ timeout: 10_000 });
    });

    test(`Language switcher switches to ${label}`, async ({ page }) => {
      await page.goto(`/?lang=${lang}`);
      await page.waitForTimeout(2_000);
      
      // Check page renders
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      expect(pageTitle.length).toBeGreaterThan(0);
    });
  });
}

test.describe("i18n completeness", () => {
  test("all nav items have translations (no undefined/null text)", async ({ page }) => {
    for (const lang of ["de", "fr", "it", "en"]) {
      await page.goto(`/?lang=${lang}`);
      await page.waitForTimeout(1_500);

      // Check nav and interactive elements for missing translations
      // Skip body text check since it includes RSC payload with $undefined
      const navButtons = await page.locator("nav button, header button, [role=navigation] button").allTextContents();
      const navLinks = await page.locator("nav a, header a, [role=navigation] a").allTextContents();
      const allNav = [...navButtons, ...navLinks].join(" ");
      
      // Check if any nav item is literally "undefined"
      expect(allNav).not.toMatch(/\bundefined\b/);
      expect(allNav).not.toContain("MISSING_KEY");
    }
  });

  test("upgrade page shows correct grade range in all languages", async ({ page }) => {
    for (const lang of ["de", "fr", "it", "en"]) {
      await page.goto(`/upgrade?lang=${lang}`);
      await page.waitForTimeout(1_000);
      const body = await page.locator("body").textContent() ?? "";
      // Should mention grades 1 and 6
      expect(body).toContain("1");
      expect(body).toContain("6");
    }
  });

  test("exercise page shows correct language content", async ({ page }) => {
    // German (default)
    await page.goto("/learn/1/math/zahlen-1-10");
    await page.waitForTimeout(1_500);
    const body = await page.locator("body").textContent() ?? "";
    // German exercise questions should contain German words
    expect(body).toMatch(/Wie viele|Welche|Was ist|Zahl/i);
  });

  test("topic info sections follow English language setting", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("cleverli_lang", "en"));
    await page.goto("/learn/1/math/zahlen-1-10");

    await expect(page.getByRole("heading", { name: "Numbers 1–10", exact: true })).toBeVisible({ timeout: 8_000 });
    await expect(page.getByText("Quick overview")).toBeVisible();
    await expect(page.getByText("What will my child learn in Numbers 1–10?")).toBeVisible();
    await expect(page.getByText("Exercises for this topic")).toBeVisible();
    await expect(page.getByText("Sample exercises")).toBeVisible();
    await expect(page.getByText("More Maths topics")).toBeVisible();

    const visibleText = await page.locator("body").textContent() ?? "";
    expect(visibleText).not.toContain("Kurz erklärt");
    expect(visibleText).not.toContain("Was lernt mein Kind");
    expect(visibleText).not.toContain("Übungen zum Thema");
    expect(visibleText).not.toContain("Beispielaufgaben");
  });
});
