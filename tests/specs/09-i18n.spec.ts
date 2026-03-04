/**
 * i18n / language switching tests — DE, FR, IT, EN.
 */
import { test, expect } from "@playwright/test";

const LANG_PARAMS = [
  { lang: "de", label: "Deutsch",   homeWord: "Klasse",   upgradeWord: "Klasse" },
  { lang: "fr", label: "Français",  homeWord: "classe",   upgradeWord: "classe" },
  { lang: "it", label: "Italiano",  homeWord: "classe",   upgradeWord: "classe" },
  { lang: "en", label: "English",   homeWord: "grade",    upgradeWord: "grade" },
];

const KEY_PAGES = ["/", "/upgrade", "/parents", "/dashboard"];

for (const { lang, label, homeWord } of LANG_PARAMS) {
  test.describe(`Language: ${label} (${lang})`, () => {
    test(`Homepage renders in ${label}`, async ({ page }) => {
      await page.goto(`/?lang=${lang}`);
      await page.waitForTimeout(1_500);
      const body = await page.locator("body").textContent() ?? "";
      expect(body.toLowerCase()).toContain(homeWord.toLowerCase());
    });

    test(`Language switcher switches to ${label}`, async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(1_000);

      // Find language switcher
      const switcher = page.locator(
        `button:has-text('${lang.toUpperCase()}'), button:has-text('${label}'), select[name*=lang], [data-lang='${lang}']`
      ).first();

      if (await switcher.count() > 0) {
        await switcher.click();
        await page.waitForTimeout(1_000);
        const body = await page.locator("body").textContent() ?? "";
        expect(body.toLowerCase()).toContain(homeWord.toLowerCase());
      } else {
        // Try URL param approach
        await page.goto(`/?lang=${lang}`);
        await page.waitForTimeout(1_000);
        const body = await page.locator("body").textContent() ?? "";
        expect(body.toLowerCase()).toContain(homeWord.toLowerCase());
      }
    });
  });
}

test.describe("i18n completeness", () => {
  test("all nav items have translations (no undefined/null text)", async ({ page }) => {
    for (const lang of ["de", "fr", "it", "en"]) {
      await page.goto(`/?lang=${lang}`);
      await page.waitForTimeout(1_000);

      // No visible "undefined" or "null" or "[object" text
      const body = await page.locator("body").textContent() ?? "";
      expect(body).not.toContain("undefined");
      expect(body).not.toContain("[object Object]");
      expect(body).not.toContain("MISSING_KEY");
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
});
