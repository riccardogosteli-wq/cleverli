import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`${viewport.name}: app navigation responds without a main-thread lock`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const pageErrors: string[] = [];
    page.on("pageerror", error => pageErrors.push(error.message));

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    const startedAt = Date.now();
    await page.locator("a[href='/rewards']:visible").first().click({ noWaitAfter: true });
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 1_500 }).toBe("/rewards");

    expect(Date.now() - startedAt).toBeLessThan(1_500);
    expect(pageErrors).toEqual([]);
  });

  test(`${viewport.name}: app shell does not preload the full exercise catalogue`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1_500);

    const scriptSizes = await page.evaluate(() =>
      performance.getEntriesByType("resource")
        .filter(entry => entry.initiatorType === "script")
        .map(entry => (entry as PerformanceResourceTiming).decodedBodySize),
    );

    expect(Math.max(0, ...scriptSizes)).toBeLessThan(1_000_000);
    expect(scriptSizes.reduce((sum, size) => sum + size, 0)).toBeLessThan(3_000_000);
  });
}
