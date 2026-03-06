/**
 * Screenshot capture for visual/UX audit via Haiku.
 * This spec doesn't assert much — it captures screenshots of every page/state
 * at mobile and desktop, saved to tests/screenshots/ for haiku-visual-review.py.
 *
 * Run: npx playwright test 18-all-routes-screenshot.spec.ts
 * Then: python tests/haiku-visual-review.py
 */
import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const OUT_DIR = path.join(__dirname, "../screenshots");
fs.mkdirSync(OUT_DIR, { recursive: true });

type Viewport = { name: string; width: number; height: number };
const VIEWPORTS: Viewport[] = [
  { name: "mobile",  width: 390,  height: 844  },
  { name: "desktop", width: 1280, height: 800  },
];

const ROUTES = [
  { path: "/",                name: "home" },
  { path: "/dashboard",       name: "dashboard" },
  { path: "/missionen",       name: "missionen" },
  { path: "/rewards",         name: "rewards" },
  { path: "/shop",            name: "shop" },
  { path: "/daily",           name: "daily" },
  { path: "/family",          name: "family" },
  { path: "/parents",         name: "parents" },
  { path: "/upgrade",         name: "upgrade" },
  { path: "/account",         name: "account" },
  { path: "/login",           name: "login" },
  { path: "/agb",             name: "agb" },
  { path: "/datenschutz",     name: "datenschutz" },
  { path: "/impressum",       name: "impressum" },
  { path: "/learn/1/math/zahlen-1-10",     name: "topic-g1-math" },
  { path: "/learn/1/german/buchstaben",    name: "topic-g1-german" },
  { path: "/learn/2/math/zahlen-bis-100",  name: "topic-g2-math" },
  { path: "/learn/3/science/unsere-erde",  name: "topic-g3-science" },
];

// Also capture specific states
const LANG_ROUTES = [
  { path: "/?lang=fr",      name: "home-fr" },
  { path: "/?lang=it",      name: "home-it" },
  { path: "/?lang=en",      name: "home-en" },
  { path: "/upgrade?lang=fr", name: "upgrade-fr" },
];

test.describe("Screenshot capture for Haiku visual audit", () => {
  for (const vp of VIEWPORTS) {
    test.describe(`Viewport: ${vp.name} (${vp.width}×${vp.height})`, () => {

      test.use({ viewport: { width: vp.width, height: vp.height } });

      for (const { path: routePath, name } of ROUTES) {
        test(`Capture ${name} [${vp.name}]`, async ({ page }) => {
          // Inject test profile data
          await page.goto("/dashboard");
          await page.evaluate(() => {
            const profile = {
              xp: 150, dailyStreak: 3, totalExercises: 22,
              coins: 45, achievements: [], avatar: "🐸",
            };
            localStorage.setItem("cleverli_profile", JSON.stringify(profile));
            const family = {
              members: [
                { id: "child-1", name: "Emma",   avatar: "🐸", grade: 2 },
                { id: "child-2", name: "Luca",   avatar: "🦁", grade: 4 },
              ]
            };
            localStorage.setItem("cleverli_family", JSON.stringify(family));
            localStorage.setItem("cleverli_active_profile", "child-1");
            localStorage.setItem("cleverli_last_grade", "2");
            // Some progress for visual richness
            localStorage.setItem("cleverli_2_math_zahlen-bis-100", JSON.stringify({ completed: 7, stars: 2 }));
            localStorage.setItem("cleverli_2_german_nomen-artikel", JSON.stringify({ completed: 10, stars: 3 }));
            localStorage.setItem("cleverli_2_math_addition-subtraktion", JSON.stringify({ completed: 3, stars: 1 }));
          });

          const response = await page.goto(routePath, { waitUntil: "domcontentloaded", timeout: 15_000 });
          await page.waitForTimeout(2_500); // let animations settle

          const status = response?.status() ?? 200;
          expect(status).toBeLessThan(400);

          const filename = `${vp.name}--${name}.png`;
          await page.screenshot({
            path: path.join(OUT_DIR, filename),
            fullPage: routePath.startsWith("/learn"), // full-page for exercise routes
          });
        });
      }

      // Language variant screenshots
      for (const { path: routePath, name } of LANG_ROUTES) {
        test(`Capture ${name} [${vp.name}]`, async ({ page }) => {
          await page.goto(routePath, { waitUntil: "domcontentloaded", timeout: 15_000 });
          await page.waitForTimeout(2_000);
          const filename = `${vp.name}--${name}.png`;
          await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: false });
        });
      }
    });
  }
});
