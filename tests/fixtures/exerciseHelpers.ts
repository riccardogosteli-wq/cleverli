/**
 * Helpers for interacting with ExercisePlayer in Playwright tests.
 * Supports all exercise types: multiple-choice, fill-in-blank, counting,
 * drag-drop, memory, number-line, word-search, matching.
 */
import { Page, expect } from "@playwright/test";
import { ExerciseAnswer } from "./answers";

// ── Navigate to a topic ───────────────────────────────────────────────────────
export async function navigateToTopic(page: Page, grade: number, subject: string, topicId: string) {
  await page.goto(`/learn/${grade}/${subject}/${topicId}`);
  // Wait for exercise player to mount
  await expect(page.locator("[data-testid=exercise-player], .exercise-question, button[data-answer]").first())
    .toBeVisible({ timeout: 12_000 });
}

// ── Get current exercise type from the page ───────────────────────────────────
export async function getCurrentExerciseType(page: Page): Promise<string> {
  const type = await page.evaluate(() => {
    // ExercisePlayer renders a data-type attribute we can read
    const el = document.querySelector("[data-exercise-type]");
    return el?.getAttribute("data-exercise-type") ?? "unknown";
  });
  return type;
}

// ── Submit an answer based on exercise type ───────────────────────────────────
export async function submitAnswer(page: Page, answer: ExerciseAnswer, correct: boolean) {
  const value = correct ? answer.correctAnswer : (answer.wrongAnswer ?? answer.correctAnswer);

  switch (answer.type) {
    case "multiple-choice":
    case "counting":
      await answerMultipleChoice(page, value);
      break;

    case "fill-in-blank":
      await answerFillInBlank(page, value);
      break;

    case "drag-drop":
      if (correct && answer.dropAnswers) {
        await answerDragDrop(page, answer.dropAnswers);
      } else {
        // Wrong: drag items to wrong zones (reverse mapping)
        const reversed = reverseDropAnswers(answer.dropAnswers ?? {});
        await answerDragDrop(page, reversed, true);
      }
      break;

    case "memory":
      // Memory is always "correct" — find all pairs
      await answerMemory(page);
      break;

    case "number-line":
      await answerNumberLine(page, value);
      break;

    case "word-search":
      if (answer.wordList && answer.wordList.length > 0) {
        await answerWordSearch(page, answer.wordList[0]);
      }
      break;

    case "matching":
      await answerMatching(page, correct);
      break;

    default:
      // Fallback: try clicking a button with the answer text
      await answerMultipleChoice(page, value);
  }
}

// ── Multiple choice / counting ────────────────────────────────────────────────
async function answerMultipleChoice(page: Page, answer: string) {
  // Try data-answer attribute first (most reliable)
  const byDataAttr = page.locator(`button[data-answer="${answer}"]`);
  if (await byDataAttr.count() > 0) {
    await byDataAttr.first().click();
    return;
  }

  // Try button containing the exact text
  const buttons = page.locator("button").filter({ hasText: answer });
  const count = await buttons.count();
  if (count > 0) {
    // Find the best match (exact text, not partial)
    for (let i = 0; i < count; i++) {
      const text = (await buttons.nth(i).textContent())?.trim();
      if (text === answer || text?.includes(answer)) {
        await buttons.nth(i).click();
        return;
      }
    }
    await buttons.first().click();
  }
}

// ── Fill in blank ─────────────────────────────────────────────────────────────
async function answerFillInBlank(page: Page, answer: string) {
  const input = page.locator("input[type=text], input:not([type=email]):not([type=password])").first();
  await input.fill(answer);

  // Submit via Enter or submit button
  const submitBtn = page.locator("button[type=submit], button:has-text('Überprüfen'), button:has-text('Weiter')").first();
  if (await submitBtn.count() > 0) {
    await submitBtn.click();
  } else {
    await input.press("Enter");
  }
}

// ── Drag and drop ─────────────────────────────────────────────────────────────
async function answerDragDrop(page: Page, dropAnswers: Record<string, string>, forceWrong = false) {
  // dropAnswers: itemId → zoneId
  const entries = Object.entries(dropAnswers);
  if (forceWrong && entries.length >= 2) {
    // Swap first two for a wrong answer
    [entries[0], entries[1]] = [entries[1], entries[0]];
  }

  for (const [itemId, zoneId] of entries) {
    const item = page.locator(`[data-drag-id="${itemId}"], [data-item-id="${itemId}"]`).first();
    const zone = page.locator(`[data-drop-id="${zoneId}"], [data-zone-id="${zoneId}"]`).first();

    if (await item.count() === 0 || await zone.count() === 0) continue;

    const itemBox = await item.boundingBox();
    const zoneBox = await zone.boundingBox();
    if (!itemBox || !zoneBox) continue;

    await page.mouse.move(itemBox.x + itemBox.width / 2, itemBox.y + itemBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(zoneBox.x + zoneBox.width / 2, zoneBox.y + zoneBox.height / 2, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(200);
  }

  // Click check button
  const checkBtn = page.locator("button:has-text('Prüfen'), button:has-text('Überprüfen'), button:has-text('Check')").first();
  if (await checkBtn.count() > 0) await checkBtn.click();
}

function reverseDropAnswers(dropAnswers: Record<string, string>): Record<string, string> {
  const entries = Object.entries(dropAnswers);
  if (entries.length < 2) return dropAnswers;
  const result = { ...dropAnswers };
  const [k0, k1] = [entries[0][0], entries[1][0]];
  [result[k0], result[k1]] = [result[k1], result[k0]];
  return result;
}

// ── Memory ────────────────────────────────────────────────────────────────────
async function answerMemory(page: Page) {
  // Click all cards in order — they'll match when pairs are found
  const cards = page.locator("[data-memory-card], .memory-card, [data-pair-id]");
  const count = await cards.count();

  for (let i = 0; i < count; i++) {
    if (await cards.nth(i).isVisible()) {
      await cards.nth(i).click();
      await page.waitForTimeout(600); // wait for flip animation
    }
  }
}

// ── Number line ───────────────────────────────────────────────────────────────
async function answerNumberLine(page: Page, answer: string) {
  const slider = page.locator("input[type=range]").first();
  if (await slider.count() > 0) {
    await slider.fill(answer);
    await slider.dispatchEvent("input");
    await slider.dispatchEvent("change");
  }

  const confirmBtn = page.locator("button:has-text('Überprüfen'), button:has-text('OK'), button:has-text('Bestätigen')").first();
  if (await confirmBtn.count() > 0) await confirmBtn.click();
}

// ── Word search ───────────────────────────────────────────────────────────────
async function answerWordSearch(page: Page, _word: string) {
  // Word search is complex — just verify the grid renders and skip deep interaction
  const grid = page.locator("[data-word-search], .word-search-grid, table").first();
  await expect(grid).toBeVisible({ timeout: 5_000 });
}

// ── Matching ──────────────────────────────────────────────────────────────────
async function answerMatching(page: Page, correct: boolean) {
  const leftItems = page.locator("[data-match-left], .match-left").all();
  const rightItems = page.locator("[data-match-right], .match-right").all();

  const lefts = await leftItems;
  const rights = await rightItems;

  if (lefts.length === 0 || rights.length === 0) return;

  // Click first left, then first right (correct) or second right (wrong)
  await lefts[0].click();
  await page.waitForTimeout(200);
  const rightIndex = correct ? 0 : Math.min(1, rights.length - 1);
  await rights[rightIndex].click();
}

// ── Wait for answer feedback ──────────────────────────────────────────────────
export async function waitForFeedback(page: Page): Promise<"correct" | "wrong" | "timeout"> {
  try {
    await Promise.race([
      page.waitForSelector(".text-green-600, [data-result=correct], .correct-feedback", { timeout: 5_000 }),
      page.waitForSelector(".text-red-600, [data-result=wrong], .wrong-feedback", { timeout: 5_000 }),
    ]);

    const isCorrect = await page.locator(".text-green-600, [data-result=correct]").count() > 0;
    return isCorrect ? "correct" : "wrong";
  } catch {
    return "timeout";
  }
}

// ── Click "Next" / "Weiter" ───────────────────────────────────────────────────
export async function clickNext(page: Page) {
  const nextBtn = page.locator("button:has-text('Weiter'), button:has-text('Nächste'), button:has-text('Next')").first();
  if (await nextBtn.count() > 0 && await nextBtn.isEnabled()) {
    await nextBtn.click();
    await page.waitForTimeout(500);
  }
}

// ── Check if hint button exists and click it ──────────────────────────────────
export async function clickHint(page: Page): Promise<boolean> {
  const hintBtn = page.locator("button:has-text('Tipp'), button:has-text('Hilfe'), button[data-hint], button:has-text('💡')").first();
  if (await hintBtn.count() > 0 && await hintBtn.isVisible()) {
    await hintBtn.click();
    await page.waitForTimeout(300);
    return true;
  }
  return false;
}

// ── Check if voice/TTS button exists ─────────────────────────────────────────
export async function hasVoiceButton(page: Page): Promise<boolean> {
  const voiceBtn = page.locator("button:has-text('🔊'), button[data-voice], button[aria-label*=voice], button[aria-label*=laut]").first();
  return (await voiceBtn.count()) > 0;
}
