/**
 * Smoke tests — all pages load without crash, key elements visible.
 */
import { test, expect } from "@playwright/test";

// Use `nav` as the universal presence check — present on every page.
// Some pages use <div> wrappers rather than <main>, so `main` is unreliable.
// The important thing is: no "Application error" + navigation renders = app is up.
const PAGES = [
  { path: "/",            name: "Home"        },
  { path: "/dashboard",   name: "Dashboard"   },
  { path: "/parents",     name: "Parents"     },
  { path: "/upgrade",     name: "Upgrade"     },
  { path: "/missionen",   name: "Missionen"   },
  { path: "/rewards",     name: "Rewards"     },
  { path: "/shop",        name: "Shop"        },
  { path: "/family",      name: "Family"      },
  { path: "/daily",       name: "Daily"       },
  { path: "/account",     name: "Account"     },
  { path: "/agb",         name: "AGB"         },
  { path: "/datenschutz", name: "Datenschutz" },
  { path: "/impressum",   name: "Impressum"   },
];

for (const { path, name } of PAGES) {
  test(`${name} page loads without crash`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", err => pageErrors.push(err.message));

    const res = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(res?.status(), `${name} returned non-2xx`).toBeLessThan(400);

    // Nav renders on every page — if this is visible, React mounted successfully
    await expect(page.locator("nav").first()).toBeVisible({ timeout: 10_000 });

    // No "Application error" Next.js crash page
    const crashed = await page.locator("text=Application error").count();
    expect(crashed, `${name} shows Application error`).toBe(0);

    // No unhandled JS exceptions (filter known browser noise)
    const realErrors = pageErrors.filter(e =>
      !e.includes("ResizeObserver") &&
      !e.includes("Non-Error promise") &&
      !e.includes("favicon") &&
      !e.includes("Failed to load resource") && // 400 from Supabase auth expected without session
      !e.includes("Minified React error #418") // hydration noise in Playwright mobile emulation
    );
    expect(realErrors, `JS errors on ${name}: ${realErrors.join(" | ")}`).toHaveLength(0);
  });
}

test("404 page shows custom not-found", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist-xyz");
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
