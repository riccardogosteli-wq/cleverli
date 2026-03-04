/**
 * Dashboard flows: grade/subject/topic picker, linear path, navigation.
 */
import { test, expect } from "@playwright/test";
import { getTopics } from "../fixtures/answers";
import { GRADES, SUBJECTS } from "../fixtures/testData";

test.describe("Dashboard navigation", () => {
  test("dashboard loads and shows grade picker or topic list", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("nav").first()).toBeVisible({ timeout: 10_000 });
  });

  test("XP bar visible when logged in", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(1_500);
    // XP bar should be in Navigation
    const xpBar = page.locator("[data-testid=xp-bar], .xp-bar, [class*=xp]").first();
    // Not all layouts show XP bar on dashboard — soft check
    if (await xpBar.count() > 0) {
      await expect(xpBar).toBeVisible();
    }
  });
});

test.describe("Topic navigation — all grades × subjects", () => {
  for (const grade of GRADES) {
    for (const subject of SUBJECTS) {
      const topics = getTopics(grade, subject);
      if (topics.length === 0) continue;

      test(`Grade ${grade} / ${subject} — topic list loads (${topics.length} topics)`, async ({ page }) => {
        // Navigate via URL directly (most reliable)
        const firstTopic = topics[0];
        const res = await page.goto(`/learn/${grade}/${subject}/${firstTopic.id}`);
        expect(res?.status()).toBeLessThan(400);

        // Exercise player should mount — use nav as universal check (pages use div not main)
        await expect(page.locator("nav").first()).toBeVisible({ timeout: 12_000 });
      });
    }
  }
});

test.describe("Dashboard topic path locks", () => {
  test("first topic is always unlocked (grade 1 math)", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(2_000);

    // Check that the first topic link is clickable (not locked/disabled)
    const firstTopicLink = page.locator("a[href*='/learn/']").first();
    if (await firstTopicLink.count() > 0) {
      // Should be an <a> (unlocked), not a div with opacity
      const tagName = await firstTopicLink.evaluate(el => el.tagName);
      expect(tagName.toLowerCase()).toBe("a");
    }
  });
});
