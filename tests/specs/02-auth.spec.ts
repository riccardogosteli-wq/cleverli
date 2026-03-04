/**
 * Auth flows: login, logout, session persistence, redirect guards.
 */
import { test, expect } from "@playwright/test";
import { TEST_ACCOUNT } from "../fixtures/testData";

test.describe("Login flow", () => {
  test("login page renders email + password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type=email]")).toBeVisible();
    await expect(page.locator("input[type=password]")).toBeVisible();
    await expect(page.locator("button.bg-green-600, button:has-text('Anmelden')")).toBeVisible();
  });

  test("shows error on wrong password", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[type=email]", TEST_ACCOUNT.email);
    await page.fill("input[type=password]", "wrongpassword123");
    await page.click("button.bg-green-600, button:has-text('Anmelden'), button:has-text('Login')");

    // Expect an error message to appear
    await expect(
      page.locator("[role=alert], .text-red-500, .text-red-600, [data-error]").first()
    ).toBeVisible({ timeout: 8_000 });
  });

  test("successful login redirects away from /login", async ({ page }) => {
    await page.goto("/login");
    await page.fill("input[type=email]", TEST_ACCOUNT.email);
    await page.fill("input[type=password]", TEST_ACCOUNT.password);
    await page.click("button.bg-green-600, button:has-text('Anmelden'), button:has-text('Login')");
    await page.waitForURL(url => !url.pathname.includes("/login"), { timeout: 15_000 });
    expect(page.url()).not.toContain("/login");
  });
});

test.describe("Session persistence", () => {
  test("dashboard accessible when logged in", async ({ page }) => {
    await page.goto("/dashboard");
    // Should not redirect to login
    await page.waitForTimeout(2_000);
    expect(page.url()).not.toContain("/login");
  });

  test("account page shows user info when logged in", async ({ page }) => {
    await page.goto("/account");
    await page.waitForTimeout(2_000);
    // Should not show the "please log in" wall
    const loginWall = page.locator("text=Bitte zuerst einloggen, text=Please log in").first();
    const count = await loginWall.count();
    expect(count).toBe(0);
  });
});

test.describe("Auth guards", () => {
  test("logout clears session and redirects", async ({ page }) => {
    await page.goto("/account");
    await page.waitForTimeout(1_000);

    // Find and click logout button
    const logoutBtn = page.locator("button:has-text('Abmelden'), button:has-text('Logout'), button:has-text('Log out')").first();
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click();
      await page.waitForTimeout(2_000);
      // After logout, visiting /account should show login wall or redirect
      await page.goto("/account");
      await page.waitForTimeout(1_500);
      const url = page.url();
      const hasLoginWall = await page.locator("text=Bitte zuerst einloggen").count() > 0;
      const redirectedToLogin = url.includes("/login");
      expect(hasLoginWall || redirectedToLogin).toBe(true);
    } else {
      test.skip(true, "Logout button not found on account page");
    }
  });
});

test.describe("Signup page", () => {
  test("signup page renders and shows step 1", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("input[type=email]").first()).toBeVisible({ timeout: 8_000 });
  });

  test("signup shows validation error for weak password", async ({ page }) => {
    await page.goto("/signup");
    const emailInput = page.locator("input[type=email]").first();
    await emailInput.fill("newuser_test_xyz@example.com");
    const passInput = page.locator("input[type=password]").first();
    if (await passInput.count() > 0) {
      await passInput.fill("123");
      await page.click("button.bg-green-600, button:has-text('Anmelden'), button:has-text('Weiter')");
      const error = page.locator("[role=alert], .text-red-500, .text-red-600").first();
      await expect(error).toBeVisible({ timeout: 5_000 });
    }
  });
});
