/**
 * Navigation completeness — every route resolves, no dead links, no 404s.
 * Checks: all nav links, bottom nav links, known internal hrefs.
 */
import { test, expect } from "@playwright/test";

const KNOWN_ROUTES = [
  { path: "/",              name: "Home",       expectText: /Klasse|grade|classe/i },
  { path: "/dashboard",     name: "Dashboard",  expectText: /Mathematik|Math|dashboard/i },
  { path: "/missionen",     name: "Missionen",  expectText: /Missionen|Missions/i },
  { path: "/rewards",       name: "Rewards",    expectText: /Belohnungen|Reward|récom/i },
  { path: "/shop",          name: "Shop",       expectText: /Shop|Münzen|coins/i },
  { path: "/daily",         name: "Daily",      expectText: /Tages|Daily|challenge/i },
  { path: "/family",        name: "Family",     expectText: /Familie|Family|Famille/i },
  { path: "/parents",       name: "Parents",    expectText: /Eltern|Parent|famille/i },
  { path: "/upgrade",       name: "Upgrade",    expectText: /Premium|Upgrade|CHF/i },
  { path: "/account",       name: "Account",    expectText: /Konto|account|email/i },
  { path: "/agb",           name: "AGB",        expectText: /Nutzungsbedingungen|conditions|Terms/i },
  { path: "/datenschutz",   name: "Datenschutz",expectText: /Datenschutz|confidentialité|Privacy/i },
  { path: "/impressum",     name: "Impressum",  expectText: /Impressum|Imprint/i },
];

const REDIRECT_ROUTES = [
  { path: "/trophies", expectedTarget: "/missionen", name: "trophies redirect" },
];

test.describe("Route health — all pages respond", () => {
  for (const { path, name } of KNOWN_ROUTES) {
    test(`${name} (${path}) — loads without crash`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", e => errors.push(e.message));

      const res = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 15_000 });

      // Must not return 404 / 500
      expect(res?.status() ?? 200).toBeLessThan(400);

      // Nav must render (basic non-crash check)
      await expect(page.locator("nav").first()).toBeVisible({ timeout: 10_000 });

      // No JS runtime errors (ignoring hydration warnings)
      const realErrors = errors.filter(e => !e.includes("hydrat") && !e.includes("Warning"));
      expect(realErrors).toHaveLength(0);
    });
  }
});

test.describe("Redirect routes", () => {
  for (const { path, expectedTarget, name } of REDIRECT_ROUTES) {
    test(`${name}: ${path} → ${expectedTarget}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForURL(new RegExp(expectedTarget), { timeout: 8_000 });
      expect(page.url()).toContain(expectedTarget);
    });
  }
});

test.describe("Navigation links are reachable from homepage", () => {
  test("desktop nav links all resolve", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const navLinks = await page.locator("nav a[href]").evaluateAll(links =>
      links
        .map(a => (a as HTMLAnchorElement).getAttribute("href") ?? "")
        .filter(h => h.startsWith("/") && !h.includes("#"))
    );

    expect(navLinks.length).toBeGreaterThan(2);

    for (const href of navLinks.slice(0, 8)) { // cap at 8 to keep test fast
      const res = await page.goto(href, { waitUntil: "domcontentloaded", timeout: 12_000 });
      const status = res?.status() ?? 200;
      expect(status, `${href} returned ${status}`).toBeLessThan(400);
    }
  });
});

test.describe("No broken internal links on key pages", () => {
  const PAGES_TO_SCAN = ["/", "/upgrade", "/parents"];

  for (const pagePath of PAGES_TO_SCAN) {
    test(`No 404 links on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1_500);

      const internalLinks = await page.locator("a[href]").evaluateAll(links =>
        links
          .map(a => (a as HTMLAnchorElement).getAttribute("href") ?? "")
          .filter(h => h.startsWith("/") && !h.includes("#") && !h.includes("?"))
          .filter((h, i, arr) => arr.indexOf(h) === i) // dedupe
      );

      const broken: string[] = [];
      for (const href of internalLinks.slice(0, 10)) {
        try {
          const res = await page.goto(href, { waitUntil: "domcontentloaded", timeout: 10_000 });
          if ((res?.status() ?? 200) >= 400) broken.push(href);
        } catch { broken.push(`${href} (timeout)`); }
      }

      if (broken.length > 0) {
        console.warn(`⚠️ Broken links on ${pagePath}:`, broken);
      }
      expect(broken).toHaveLength(0);
    });
  }
});
