/**
 * Auth setup — runs once before all tests.
 * Logs in with the test account and saves browser state (cookies + localStorage).
 */
import { test as setup, expect } from "@playwright/test";
import { TEST_ACCOUNT, TEST_CHILD } from "./fixtures/testData";
import path from "path";
import fs from "fs";

const AUTH_FILE = path.join(__dirname, ".auth/state.json");

setup("authenticate and seed child profile", async ({ page }) => {
  // ── 1. Log in ──────────────────────────────────────────────────────────────
  await page.goto("/login");
  await expect(page.locator("input[type=email]")).toBeVisible({ timeout: 10_000 });

  await page.fill("input[type=email]", TEST_ACCOUNT.email);
  await page.fill("input[type=password]", TEST_ACCOUNT.password);
  // Login button uses onClick (not type=submit)
  await page.click("button.bg-green-600, button:has-text('Anmelden'), button:has-text('Login')");

  // Wait for redirect away from login page
  await page.waitForURL(url => !url.pathname.includes("/login"), { timeout: 15_000 });

  // ── 2. Seed a test child profile in localStorage ───────────────────────────
  await page.evaluate(({ childName, grade }) => {
    const childId = "test-child-001";
    const family = {
      children: [{
        id: childId,
        name: childName,
        grade,
        avatar: "🦊",
        createdAt: new Date().toISOString(),
      }],
    };
    localStorage.setItem("cleverli_family", JSON.stringify(family));
    localStorage.setItem("cleverli_active_profile", childId);

    // Seed a basic profile for the child
    const profile = {
      id: childId,
      name: childName,
      grade,
      xp: 0,
      totalExercises: 0,
      correctAnswers: 0,
      currentStreak: 0,
      lastPlayedDate: null,
      achievements: [],
      coins: 0,
      ownedItems: [],
      equippedItems: {},
    };
    localStorage.setItem(`cleverli_profile_${childId}`, JSON.stringify(profile));
  }, { childName: TEST_CHILD.name, grade: TEST_CHILD.grade });

  // ── 3. Remove Supabase internal session token before saving state
  //    (prevents expired-token crashes when storageState is replayed in tests)
  await page.evaluate(() => {
    localStorage.removeItem("cleverli_supabase_session");
    // Also remove any sb-* keys that Supabase might have set
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith("sb-") || k === "cleverli_supabase_session") {
        localStorage.removeItem(k);
      }
    });
  });

  // ── 4. Save auth state ─────────────────────────────────────────────────────
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });

  console.log("✅ Auth setup complete — state saved to", AUTH_FILE);
});
