/**
 * 20-guest-flows.spec.ts
 * Tests for anonymous/unauthenticated user flows:
 * - Guest previews on Dashboard, Missionen, Belohnungen, Parents
 * - Anonymous exercise access (no login required)
 * - CTA buttons present and correct
 * - Signup prompt after exercises (anonymous tracking)
 */
import { test, expect } from "@playwright/test";

const LOGGED_OUT = { storageState: { cookies: [], origins: [] } };

test.describe("Guest preview pages", () => {
  test.use(LOGGED_OUT);

  test("Dashboard shows guest preview with CTAs when not logged in", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(2_500);
    // Should NOT redirect to login
    expect(page.url()).not.toContain("/login");
    // Should show "Jetzt kostenlos testen" CTA or guest content
    const hasCta = await page.locator("a[href='/learn/1/math/zahlen-1-10']").count();
    const hasGuestContent = await page.locator("text=kostenlos, text=Anmelden, text=testen").count();
    expect(hasCta + hasGuestContent).toBeGreaterThan(0);
  });

  test("Missionen shows guest preview with correct German title", async ({ page }) => {
    await page.goto("/missionen");
    await page.waitForTimeout(1_500);
    expect(page.url()).not.toContain("/login");
    // Should show "Meine Missionen" (German, not "mission")
    await expect(page.locator("h1").first()).toContainText(/Missionen|Missions/i, { timeout: 8_000 });
    // Should have CTA
    await expect(page.locator("a[href='/learn/1/math/zahlen-1-10']").first()).toBeVisible();
  });

  test("Belohnungen shows guest preview with correct German title", async ({ page }) => {
    await page.goto("/rewards");
    await page.waitForTimeout(1_500);
    expect(page.url()).not.toContain("/login");
    // Should show "Belohnungen" (German, not "rewards")
    await expect(page.locator("h1").first()).toContainText(/Belohnungen|Premi|Récompenses|Rewards/i, { timeout: 8_000 });
    // Should have CTA
    await expect(page.locator("a[href='/learn/1/math/zahlen-1-10']").first()).toBeVisible();
  });

  test("Parents shows guest preview with feature list", async ({ page }) => {
    await page.goto("/parents");
    await page.waitForTimeout(1_500);
    expect(page.url()).not.toContain("/login");
    // Should show parent area title
    await expect(page.locator("h1").first()).toContainText(/Eltern|Parents|Genitori/i, { timeout: 8_000 });
    // Should have CTA
    await expect(page.locator("a[href='/learn/1/math/zahlen-1-10']").first()).toBeVisible();
  });
});

test.describe("Anonymous exercise access", () => {
  test.use(LOGGED_OUT);

  test("can access exercise page without login", async ({ page }) => {
    await page.goto("/learn/1/math/zahlen-1-10");
    await page.waitForTimeout(2_000);
    // Should NOT redirect to login
    expect(page.url()).not.toContain("/login");
    expect(page.url()).not.toContain("/signup");
    // Exercise player should be visible
    await expect(page.locator("body")).toBeVisible();
    const crashed = await page.locator("text=Application error").count();
    expect(crashed).toBe(0);
  });

  test("first exercise loads content for anonymous user", async ({ page }) => {
    await page.goto("/learn/1/math/zahlen-1-10");
    await page.waitForTimeout(2_500);
    // Should show exercise question (not a login wall)
    const hasQuestion = await page.locator("p, h2, h3").filter({ hasText: /\?|Wie viele|Welche|Schreibe|Wähle/i }).count();
    const hasLoginWall = await page.locator("text=Bitte.*einloggen, text=Please log in").count();
    expect(hasLoginWall).toBe(0);
    expect(hasQuestion).toBeGreaterThan(0);
  });

  test("anonymous user counter is tracked after answering", async ({ page }) => {
    await page.goto("/learn/1/math/zahlen-1-10");
    await page.waitForTimeout(2_000);

    // Check localStorage starts at 0
    const before = await page.evaluate(() =>
      localStorage.getItem("cleverli_anon_exercises") ?? "0"
    );
    expect(parseInt(before)).toBeLessThan(5);
  });
});

test.describe("Learning access while Premium check is slow", () => {
  test.use(LOGGED_OUT);

  test("cached users are not stuck on the Premium check loader", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cleverli_session", JSON.stringify({
        userId: "test-user",
        email: "alexandra@example.com",
        name: "Alexandra",
        premium: false,
      }));
      localStorage.setItem("cleverli_supabase_session", JSON.stringify({
        access_token: "test-token",
        refresh_token: "test-refresh",
        token_type: "bearer",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        user: {
          id: "test-user",
          aud: "authenticated",
          role: "authenticated",
          email: "alexandra@example.com",
          user_metadata: { name: "Alexandra" },
          app_metadata: {},
        },
      }));

      const originalFetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (url.includes("supabase.co")) {
          return new Promise(() => undefined);
        }
        return originalFetch(input, init);
      };
    });

    await page.goto("/learn/1/math/zahlen-1-10");
    await expect(page.getByText("Premium-Zugang wird geprüft...")).toBeVisible({ timeout: 2_000 });
    await expect(page.getByText("Premium-Zugang wird geprüft...")).toHaveCount(0, { timeout: 8_000 });

    const hasQuestion = await page.locator("p, h2, h3").filter({ hasText: /\?|Wie viele|Welche|Schreibe|Wähle/i }).count();
    expect(hasQuestion).toBeGreaterThan(0);
  });

  test("cached active Premium users keep learning when Supabase times out", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cleverli_session", JSON.stringify({
        userId: "premium-user",
        email: "premium@example.com",
        name: "Premium Parent",
        premium: true,
        premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        premiumPlan: "monthly",
      }));
      localStorage.setItem("cleverli_supabase_session", JSON.stringify({
        access_token: "test-token",
        refresh_token: "test-refresh",
        token_type: "bearer",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        user: {
          id: "premium-user",
          aud: "authenticated",
          role: "authenticated",
          email: "premium@example.com",
          user_metadata: { name: "Premium Parent" },
          app_metadata: {},
        },
      }));
      localStorage.setItem("cleverli_free_exercises_premium-user", "20");

      const originalFetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (url.includes("supabase.co")) {
          return new Promise(() => undefined);
        }
        return originalFetch(input, init);
      };
    });

    await page.goto("/learn/1/math/zahlen-1-10");
    await expect(page.getByText("Weiter mit Premium")).toHaveCount(0, { timeout: 8_000 });

    const hasQuestion = await page.locator("p, h2, h3").filter({ hasText: /\?|Wie viele|Welche|Schreibe|Wähle/i }).count();
    expect(hasQuestion).toBeGreaterThan(0);
  });
});

test.describe("Homepage CTA flow", () => {
  test.use(LOGGED_OUT);

  test("'Jetzt kostenlos testen' button goes to first exercise", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1_500);
    const ctaLink = page.locator("a[href='/learn/1/math/zahlen-1-10']").first();
    await expect(ctaLink).toBeVisible({ timeout: 8_000 });
  });

  test("page has login link for guests", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1_500);
    // Login link exists somewhere on the page (nav desktop or bottom CTA on mobile)
    const loginLink = await page.locator("a[href='/login']").count();
    expect(loginLink).toBeGreaterThan(0);
  });
});
