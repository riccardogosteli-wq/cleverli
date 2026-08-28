import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { getTopics } from "../src/data/index";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "https://www.cleverli.ch";
const OUT = path.resolve(".qa/responsive-audit-2026-08-28/exercise-types");

const CASES = [
  { type: "counting", grade: 1, subject: "math", topic: "zahlen-1-10", id: "z1" },
  { type: "multiple-choice", grade: 1, subject: "math", topic: "zahlen-1-10", id: "z4" },
  { type: "fill-in-blank", grade: 1, subject: "math", topic: "zahlen-1-10", id: "z6" },
  { type: "number-line", grade: 1, subject: "math", topic: "zahlen-1-10", id: "z11" },
  { type: "drag-drop", grade: 1, subject: "math", topic: "zahlen-1-10", id: "z25" },
  { type: "memory", grade: 1, subject: "science", topic: "pflanzen-gr1", id: "p2" },
  { type: "word-search", grade: 1, subject: "german", topic: "einfache-woerter", id: "ew18" },
  { type: "matching", grade: 2, subject: "science", topic: "berufe", id: "g2-science-berufe-b2" },
  { type: "self-review", grade: 2, subject: "german", topic: "wortfamilien", id: "wf50" },
] as const;

const VIEWPORTS = [
  { name: "iphone-se", width: 320, height: 568 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
];

function progressBefore(grade: number, subject: string, topicId: string, targetId: string) {
  const topic = getTopics(grade, subject).find((entry) => entry.id === topicId);
  if (!topic) throw new Error(`Missing topic ${grade}/${subject}/${topicId}`);
  const sorted = [...topic.exercises].sort((a, b) => (a.difficulty ?? 2) - (b.difficulty ?? 2));
  const index = sorted.findIndex((exercise) => exercise.id === targetId);
  if (index < 0) throw new Error(`Missing exercise ${targetId}`);
  return {
    question: sorted[index].question,
    correctIds: sorted.slice(0, index).map((exercise, exerciseIndex) => exercise.id ?? `exercise-${exerciseIndex}`),
  };
}

async function interact(page: import("@playwright/test").Page, type: string) {
  const before = await page.locator("body").innerText();
  if (type === "counting" || type === "multiple-choice") {
    await page.locator("button[data-answer]").first().click();
    const check = page.getByRole("button", { name: /Überprüfen|Prüfen/ }).first();
    if (await check.isEnabled().catch(() => false)) await check.click();
  } else if (type === "fill-in-blank") {
    await page.locator("input").first().fill("1");
    await page.getByRole("button", { name: /Überprüfen|Prüfen/ }).first().click();
  } else if (type === "number-line") {
    const range = page.locator("input[type=range]").first();
    await range.focus();
    await page.keyboard.press("ArrowRight");
    await page.getByRole("button", { name: /Überprüfen|Prüfen/ }).first().click();
  } else if (type === "memory") {
    const buttons = page.locator("button.aspect-square");
    await buttons.nth(0).click();
    await buttons.nth(1).click();
  } else if (type === "matching") {
    const buttons = page.locator(".grid.grid-cols-2 button");
    await buttons.nth(0).click();
    await buttons.nth(Math.max(1, Math.floor((await buttons.count()) / 2))).click();
  } else if (type === "word-search") {
    const buttons = page.locator("button.aspect-square");
    await buttons.nth(0).click();
    await buttons.nth(1).click();
  } else if (type === "self-review") {
    await page.locator("textarea").fill("sehen, ansehen, zusehen");
    await page.getByRole("button", { name: /Antwort selbst prüfen/ }).first().click();
  } else if (type === "drag-drop") {
    const tile = page.locator("div[style*='touch-action: none']").first();
    const zone = page.locator("div.border-dashed").first();
    const tileBox = await tile.boundingBox();
    const zoneBox = await zone.boundingBox();
    if (!tileBox || !zoneBox) throw new Error("Drag/drop tile or zone missing");
    await page.mouse.move(tileBox.x + tileBox.width / 2, tileBox.y + tileBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(zoneBox.x + zoneBox.width / 2, zoneBox.y + zoneBox.height / 2, { steps: 8 });
    await page.mouse.up();
  }
  await page.waitForTimeout(250);
  const after = await page.locator("body").innerText();
  return before !== after;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results: Array<Record<string, unknown>> = [];

  for (const testCase of CASES) {
    const forced = progressBefore(testCase.grade, testCase.subject, testCase.topic, testCase.id);
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        storageState: undefined,
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.width < 768,
        hasTouch: viewport.width < 768,
        locale: "de-CH",
      });
      await context.addInitScript(({ key, correctIds }) => {
        if (!location.hostname.endsWith("cleverli.ch")) return;
          localStorage.setItem(key, JSON.stringify({ correctIds, completed: correctIds.length }));
          localStorage.setItem("cleverli_active_profile", "responsive-audit-child");
          localStorage.setItem("cleverli_anon_exercises", "0");
      }, {
        key: `cleverli_${testCase.grade}_${testCase.subject}_${testCase.topic}`,
        correctIds: forced.correctIds,
      });
      const page = await context.newPage();
      const consoleErrors: string[] = [];
      const badResponses: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("response", (entry) => {
        if (entry.status() >= 400) badResponses.push(`${entry.status()} ${entry.url()}`);
      });
      const url = `${BASE_URL}/learn/${testCase.grade}/${testCase.subject}/${testCase.topic}`;
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });
      const targetVisible = testCase.type === "memory"
        ? await page.locator("button.aspect-square").count() > 0
        : await page.getByText(forced.question, { exact: true }).count() > 0;
      if (!targetVisible) {
        await page.evaluate(({ key, correctIds }) => {
          localStorage.setItem(key, JSON.stringify({ correctIds, completed: correctIds.length }));
        }, {
          key: `cleverli_${testCase.grade}_${testCase.subject}_${testCase.topic}`,
          correctIds: forced.correctIds,
        });
        await page.reload({ waitUntil: "domcontentloaded", timeout: 20_000 });
      }
      if (testCase.type === "memory") {
        await page.locator("button.aspect-square").first().waitFor({ timeout: 10_000 });
      } else {
        await page.getByText(forced.question, { exact: true }).waitFor({ timeout: 10_000 });
      }
      await page.waitForTimeout(300);
      const exerciseAnchor = testCase.type === "memory"
        ? page.locator("button.aspect-square").first()
        : page.getByText(forced.question, { exact: true }).first();
      await exerciseAnchor.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -120));
      await page.waitForTimeout(150);
      const layout = await page.evaluate<{ overflow: boolean; documentWidth: number; small: string[] }>(`(() => {
        const width = window.innerWidth;
        const small = [];
        for (const el of Array.from(document.querySelectorAll("button, input, textarea, [role='button']"))) {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          if (rect.width <= 0 || rect.height <= 0 || style.visibility === 'hidden' || el.classList.contains('sr-only')) continue;
          if (rect.width < 44 || rect.height < 44) {
            small.push(el.tagName.toLowerCase() + ' :: ' + (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 50) + ' [' + Math.round(rect.width) + 'x' + Math.round(rect.height) + ']');
          }
        }
        return { overflow: document.documentElement.scrollWidth > width + 1, documentWidth: document.documentElement.scrollWidth, small };
      })()`);
      const screenshot = path.join(OUT, `${viewport.name}--${testCase.type}.png`);
      if (viewport.width === 390) {
        await page.screenshot({ path: screenshot, fullPage: false });
      }
      let changed = false;
      let interactionError = "";
      try {
        changed = await interact(page, testCase.type);
      } catch (error) {
        interactionError = error instanceof Error ? error.message : String(error);
      }
      results.push({
        type: testCase.type,
        exerciseId: testCase.id,
        route: new URL(url).pathname,
        viewport,
        status: response?.status() ?? 0,
        renderedQuestion: forced.question,
        layout,
        interactionChangedUi: changed,
        interactionError,
        consoleErrors: [...new Set(consoleErrors)],
        badResponses: [...new Set(badResponses)],
        screenshot: viewport.width === 390 ? path.relative(process.cwd(), screenshot) : null,
      });
      console.log(`${testCase.type} ${viewport.width}px: overflow=${layout.overflow} small=${layout.small.length} changed=${changed} error=${interactionError || "none"}`);
      await page.close({ runBeforeUnload: false });
      await context.close();
    }
  }

  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
