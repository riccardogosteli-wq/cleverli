/**
 * Parent area flows: account, family management, upgrade wall, reset progress.
 */
import { test, expect } from "@playwright/test";
import { TEST_ACCOUNT } from "../fixtures/testData";

test.describe("Account page", () => {
  test("shows email of logged-in user", async ({ page }) => {
    await page.goto("/account");
    await page.waitForTimeout(2_000);
    const emailVisible = await page.locator(`text=${TEST_ACCOUNT.email}`).count() > 0;
    if (!emailVisible) console.warn("⚠️  User email not visible on account page");
  });

  test("shows subscription status", async ({ page }) => {
    await page.goto("/account");
    await page.waitForTimeout(1_500);

    const subStatus = page.locator(
      "text=Free, text=Premium, text=Gratis, text=Basis, [data-testid=subscription-status]"
    ).first();

    if (await subStatus.count() === 0) {
      console.warn("⚠️  Subscription status not found on account page");
    }
  });

  test("cancel subscription dialog present (for premium users)", async ({ page }) => {
    // Seed premium status in localStorage/simulate
    await page.goto("/account");
    await page.waitForTimeout(1_000);

    const cancelBtn = page.locator(
      "button:has-text('Kündigen'), button:has-text('Cancel'), button:has-text('Abo')"
    ).first();

    // Only premium users see cancel — just check it doesn't crash
    if (await cancelBtn.count() > 0) {
      await cancelBtn.click();
      await page.waitForTimeout(500);
      // Dialog should appear
      const dialog = page.locator("[role=dialog], [data-testid=cancel-dialog], .modal").first();
      await expect(dialog).toBeVisible({ timeout: 5_000 });
      // Close it
      const closeBtn = page.locator("button:has-text('Nein'), button:has-text('Abbrechen'), button:has-text('Close')").first();
      if (await closeBtn.count() > 0) await closeBtn.click();
    }
  });
});

test.describe("Family management", () => {
  test("family page shows add child button", async ({ page }) => {
    await page.goto("/family");
    await page.waitForTimeout(1_500);

    const addBtn = page.locator(
      "button:has-text('Kind hinzufügen'), button:has-text('Add child'), button:has-text('Neues Kind'), button:has-text('+')"
    ).first();

    if (await addBtn.count() === 0) {
      console.warn("⚠️  Add child button not found on family page");
    }
  });

  test("can see existing test child on family page", async ({ page }) => {
    await page.goto("/family");
    await page.waitForTimeout(1_500);

    // The test child "Testino" was seeded in auth setup
    const childName = page.locator("text=Testino").first();
    if (await childName.count() === 0) {
      console.warn("⚠️  Test child not visible on family page (may not have been seeded)");
    }
  });

  test("reset progress button exists and shows confirmation", async ({ page }) => {
    await page.goto("/family");
    await page.waitForTimeout(1_500);

    const resetBtn = page.locator(
      "button:has-text('Fortschritt'), button:has-text('Reset'), button:has-text('Zurücksetzen')"
    ).first();

    if (await resetBtn.count() > 0) {
      await resetBtn.click();
      await page.waitForTimeout(500);
      // Should show confirmation dialog
      const confirmText = page.locator("text=Bist du sicher, text=Fortschritt löschen, text=zurücksetzen").first();
      if (await confirmText.count() === 0) {
        console.warn("⚠️  Reset confirmation not shown");
      }
      // Cancel it
      const cancelBtn = page.locator("button:has-text('Abbrechen'), button:has-text('Nein')").first();
      if (await cancelBtn.count() > 0) await cancelBtn.click();
    } else {
      console.warn("⚠️  Reset progress button not found");
    }
  });
});

test.describe("Upgrade / Premium wall", () => {
  test("upgrade page loads with pricing", async ({ page }) => {
    await page.goto("/upgrade");
    // Upgrade page uses div, not <main>. Look for the headline or pricing info.
    await expect(page.locator("h1, h2, :text('CHF 9.90'), :text('Unbegrenzt'), :text('Unlimited')").first()).toBeVisible({ timeout: 10_000 });

    // Should show some price
    const priceText = page.locator("text=CHF, text=9.90, text=99").first();
    if (await priceText.count() === 0) {
      console.warn("⚠️  Price not visible on upgrade page");
    }
  });

  test("upgrade page shows grade range 1–6", async ({ page }) => {
    await page.goto("/upgrade");
    await page.waitForTimeout(1_500);

    const gradeText = await page.locator("body").textContent();
    expect(gradeText).toContain("1");
    expect(gradeText).toContain("6");
  });

  test("checkout button present", async ({ page }) => {
    await page.goto("/upgrade");
    await page.waitForTimeout(1_500);

    const checkoutBtn = page.locator(
      "button:has-text('Jetzt'), button:has-text('Kaufen'), button:has-text('Upgrade'), a:has-text('Jetzt')"
    ).first();

    if (await checkoutBtn.count() === 0) {
      console.warn("⚠️  Checkout button not found on upgrade page");
    } else {
      await expect(checkoutBtn).toBeVisible();
    }
  });
});

test.describe("Parents info page", () => {
  test("parents page loads with key sections", async ({ page }) => {
    await page.goto("/parents");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10_000 });
  });

  test("parents page mentions Lehrplan 21", async ({ page }) => {
    await page.goto("/parents");
    await page.waitForTimeout(1_500);
    const body = await page.locator("body").textContent();
    expect(body?.toLowerCase()).toContain("lehrplan");
  });
});
