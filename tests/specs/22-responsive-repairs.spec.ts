import { expect, test } from "@playwright/test";
import { getTopics } from "../../src/data/index";

test.use({ storageState: { cookies: [], origins: [] } });

test("mobile topic opens with the exercise in the first viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learn/1/math/zahlen-1-10", { waitUntil: "domcontentloaded" });

  const question = page.getByText("Wie viele Äpfel siehst du?", { exact: true });
  await expect(question).toBeVisible();
  const box = await question.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(844);
});

test("fixed mobile navigation does not cover homepage footer links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");
  await page.waitForTimeout(300);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(150);

  const nav = page.locator('nav[aria-label="Mobile Navigation"]');
  const legalLink = page.getByRole("link", { name: "Datenschutz", exact: true });
  const navBox = await nav.boundingBox();
  const linkBox = await legalLink.boundingBox();
  expect(navBox).not.toBeNull();
  expect(linkBox).not.toBeNull();
  expect(linkBox!.y + linkBox!.height).toBeLessThanOrEqual(navBox!.y);
});

test("blog breadcrumb resolves to a real blog index", async ({ page }) => {
  const response = await page.goto("/blog/kinder-motivieren-zum-lernen", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await page.getByRole("link", { name: "Blog", exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("heading", { level: 1, name: "Lernen mit Freude begleiten" })).toBeVisible();
});

test("exercise voice toggle is at least 44 by 44 pixels", async ({ page }) => {
  await page.goto("/learn/1/math/zahlen-1-10", { waitUntil: "domcontentloaded" });
  const toggle = page.locator("button").filter({ hasText: /🔇|🔊/ }).first();
  await expect(toggle).toBeVisible();
  const box = await toggle.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
});

test("grade selectors keep 44 pixel touch targets at 320 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/kids", { waitUntil: "domcontentloaded" });
  const gradeButtons = page.getByRole("button", { name: /[1-6]\. Kl\./ });
  await expect(gradeButtons.first()).toBeVisible();
  for (let index = 0; index < await gradeButtons.count(); index += 1) {
    const box = await gradeButtons.nth(index).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test("tablet header auth calls-to-action keep 44 pixel height", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  for (const name of ["Anmelden", "Kostenlos starten"]) {
    const link = page.getByRole("link", { name, exact: true }).first();
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test("word-search cells retain 44 pixel touch targets on a narrow phone", async ({ context, page }) => {
  const topic = getTopics(1, "german").find((entry) => entry.id === "einfache-woerter");
  if (!topic) throw new Error("Missing einfache-woerter topic");
  const sorted = [...topic.exercises].sort((a, b) => (a.difficulty ?? 2) - (b.difficulty ?? 2));
  const targetIndex = sorted.findIndex((exercise) => exercise.id === "ew18");
  const correctIds = sorted.slice(0, targetIndex).map((exercise) => exercise.id);
  await context.addInitScript((ids) => {
    localStorage.setItem("cleverli_1_german_einfache-woerter", JSON.stringify({ correctIds: ids, completed: ids.length }));
  }, correctIds);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/learn/1/german/einfache-woerter", { waitUntil: "domcontentloaded" });
  const cell = page.locator("button.aspect-square").first();
  await expect(cell).toBeVisible();
  await page.waitForTimeout(400);
  const box = await cell.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
});

test("1x1 table explains horizontal scrolling before the table", async ({ page }) => {
  await page.goto("/einmaleins-ueben", { waitUntil: "domcontentloaded" });
  const cue = page.getByTestId("times-table-scroll-cue");
  const table = page.getByTestId("times-table");
  await expect(cue).toBeVisible();
  await expect(table).toBeVisible();
  const positions = await page.evaluate(() => {
    const cueBox = document.querySelector('[data-testid="times-table-scroll-cue"]')!.getBoundingClientRect();
    const tableBox = document.querySelector('[data-testid="times-table"]')!.getBoundingClientRect();
    return { cueBottom: cueBox.bottom, tableTop: tableBox.top };
  });
  expect(positions.cueBottom).toBeLessThan(positions.tableTop);
});

test("production CSP permits GTM transport requests", async ({ request }) => {
  const response = await request.get("/");
  const csp = response.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("connect-src");
  expect(csp).toContain("https://www.googletagmanager.com");
});
