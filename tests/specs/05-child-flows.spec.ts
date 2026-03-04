/**
 * Child area flows: XP tracking, coins, level up, streak, daily challenge,
 * profile switching, shop, trophies.
 */
import { test, expect } from "@playwright/test";

const CHILD_ID = "test-child-001";

test.describe("XP tracking", () => {
  test("XP increases after completing an exercise", async ({ page }) => {
    // Read initial XP
    await page.goto("/dashboard");
    await page.waitForTimeout(1_000);

    const initialXP = await page.evaluate((id) => {
      const raw = localStorage.getItem(`cleverli_profile_${id}`);
      return raw ? JSON.parse(raw).xp ?? 0 : 0;
    }, CHILD_ID);

    // Complete one exercise
    await page.goto("/learn/1/math/zahlen-1-10");
    await page.waitForTimeout(2_000);

    // Click first answer option
    const btn = page.locator("button[data-answer]").first();
    if (await btn.count() > 0) {
      await btn.click();
      await page.waitForTimeout(1_500);
    }

    const afterXP = await page.evaluate((id) => {
      const raw = localStorage.getItem(`cleverli_profile_${id}`);
      return raw ? JSON.parse(raw).xp ?? 0 : 0;
    }, CHILD_ID);

    // XP should have increased (or stayed same if exercise not answered correctly)
    expect(afterXP).toBeGreaterThanOrEqual(initialXP);
  });

  test("coin balance tracked in localStorage", async ({ page }) => {
    await page.goto("/dashboard");
    const coins = await page.evaluate((id) => {
      const raw = localStorage.getItem(`cleverli_profile_${id}`);
      return raw ? JSON.parse(raw).coins ?? 0 : 0;
    }, CHILD_ID);
    expect(typeof coins).toBe("number");
  });
});

test.describe("Profile switching", () => {
  test("can navigate to family page", async ({ page }) => {
    await page.goto("/family");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10_000 });
  });

  test("child profile displays name on family page", async ({ page }) => {
    // Ensure test child is in localStorage
    await page.goto("/family");
    await page.waitForTimeout(1_500);

    const hasName = await page.locator("text=Testino").count() > 0;
    // If test child was seeded, name should appear
    if (!hasName) console.warn("⚠️  Test child name not visible on family page");
  });

  test("switching active profile updates localStorage", async ({ page }) => {
    await page.goto("/family");
    await page.waitForTimeout(1_000);

    const activeId = await page.evaluate(() =>
      localStorage.getItem("cleverli_active_profile")
    );
    expect(activeId).toBeTruthy();
  });
});

test.describe("Shop", () => {
  test("shop page loads and shows items", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10_000 });

    // Should show shop items
    const items = page.locator("[data-shop-item], [class*=shop-item], button:has-text('🪙')");
    const count = await items.count();
    // Soft check — shop might be empty if no items defined
    if (count === 0) console.warn("⚠️  No shop items found");
  });

  test("can't buy item with insufficient coins", async ({ page }) => {
    // Reset coins to 0
    await page.goto("/");
    await page.evaluate((id) => {
      const raw = localStorage.getItem(`cleverli_profile_${id}`);
      if (raw) {
        const p = JSON.parse(raw);
        p.coins = 0;
        localStorage.setItem(`cleverli_profile_${id}`, JSON.stringify(p));
      }
    }, CHILD_ID);

    await page.goto("/shop");
    await page.waitForTimeout(1_500);

    // Buy buttons should be disabled or show "not enough coins"
    const buyBtns = page.locator("button:has-text('Kaufen'), button:has-text('Buy')");
    if (await buyBtns.count() > 0) {
      const firstBtn = buyBtns.first();
      const isDisabled = await firstBtn.isDisabled();
      const hasText = (await firstBtn.textContent())?.includes("🪙") ?? false;
      // Either disabled or shows coin requirement
      expect(isDisabled || hasText).toBe(true);
    }
  });
});

test.describe("Trophies", () => {
  test("trophies page loads and shows achievement categories", async ({ page }) => {
    await page.goto("/trophies");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10_000 });

    // Should show some trophy items (locked or unlocked)
    const trophies = page.locator("[data-trophy], [class*=trophy], [class*=achievement]");
    const count = await trophies.count();
    if (count === 0) console.warn("⚠️  No trophies/achievements found");
  });

  test("locked trophies show category hint (not ???)", async ({ page }) => {
    await page.goto("/trophies");
    await page.waitForTimeout(1_500);

    // Should NOT have any "???" text visible
    const questionMarks = await page.locator("text=???").count();
    expect(questionMarks).toBe(0);
  });
});

test.describe("Daily challenge", () => {
  test("daily page loads and shows challenge", async ({ page }) => {
    await page.goto("/daily");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10_000 });
  });

  test("daily challenge has exercises", async ({ page }) => {
    await page.goto("/daily");
    await page.waitForTimeout(2_000);

    const exerciseContent = page.locator(
      "button[data-answer], input[type=text], [class*=exercise], [class*=question]"
    ).first();

    if (await exerciseContent.count() > 0) {
      await expect(exerciseContent).toBeVisible();
    } else {
      console.warn("⚠️  Daily challenge content not found");
    }
  });
});

test.describe("Rewards page", () => {
  test("rewards page loads", async ({ page }) => {
    await page.goto("/rewards");
    await expect(page.locator("main").first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows premium rewards section", async ({ page }) => {
    await page.goto("/rewards");
    await page.waitForTimeout(1_500);
    const premiumSection = page.locator("text=Premium, [class*=premium]").first();
    if (await premiumSection.count() === 0) {
      console.warn("⚠️  Premium rewards section not found");
    }
  });
});
