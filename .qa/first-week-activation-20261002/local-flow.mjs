import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3210";
const outputDir = path.resolve(".qa/first-week-activation-20261002/evidence");
await mkdir(outputDir, { recursive: true });

function sessionSeed() {
  localStorage.clear();
  localStorage.setItem("cleverli_session", JSON.stringify({
    email: "qa-activation@cleverli.local",
    name: "Activation QA",
    premium: true,
  }));
  localStorage.setItem("cleverli_new_user", "true");
}

async function answerCurrentExercise(page) {
  const directAnswer = page.locator('button[data-answer]:visible').first();
  const input = page.locator('input[type="text"], input:not([type="email"]):not([type="password"]):not([type="hidden"]):not([type="range"])').first();
  if (await directAnswer.isVisible().catch(() => false)) {
    await directAnswer.click();
    await page.getByRole("button", { name: /Antwort prüfen|Überprüfen|Prüfen|Check/i }).first().click();
  } else if (await input.isVisible().catch(() => false)) {
    await input.fill("1");
    await page.getByRole("button", { name: /Antwort prüfen|Überprüfen|Prüfen|Check/i }).first().click();
  } else {
    const range = page.locator('input[type="range"]').first();
    if (await range.isVisible().catch(() => false)) {
      const value = await range.getAttribute("min") ?? "0";
      await range.fill(value);
      await page.getByRole("button", { name: /Antwort prüfen|Überprüfen|Prüfen|Check/i }).first().click();
    } else {
      throw new Error("Unsupported exercise type in activation QA");
    }
  }

  const next = page.locator("button:enabled").filter({ hasText: /Verstanden.*weiter|Weiter|Nächste|Next/i }).last();
  try {
    await next.waitFor({ state: "visible", timeout: 8_000 });
  } catch (error) {
    const buttons = await page.locator("button").evaluateAll(nodes => nodes.map(node => ({
      text: node.textContent?.trim(),
      disabled: node.disabled,
      visible: Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length),
    })));
    throw new Error(`No enabled progression control: ${JSON.stringify(buttons)}`, { cause: error });
  }
  await next.click();
}

async function run(viewport, label) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport, locale: "de-CH" });
  await context.addInitScript(sessionSeed);
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", request => {
    const url = request.url();
    const errorText = request.failure()?.errorText ?? "failed";
    if (url.startsWith(baseURL) && !errorText.includes("ERR_ABORTED")) {
      failedRequests.push(`${request.method()} ${url}: ${errorText}`);
    }
  });

  await page.goto(`${baseURL}/dashboard`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "In zwei Minuten startklar" }).waitFor();
  await page.screenshot({ path: path.join(outputDir, `${label}-welcome.png`), fullPage: true });
  await page.getByTestId("activation-continue").click();
  await page.locator("#activation-child-name").fill("Lina");
  await page.getByTestId("activation-grade-1").click();
  await page.getByTestId("activation-save-profile").click();
  await page.getByRole("heading", { name: "Was soll heute leichter werden?" }).waitFor();
  const topics = page.locator('[role="radiogroup"] [role="radio"]');
  if (await topics.count() !== 3) throw new Error(`Expected 3 recommended topics, got ${await topics.count()}`);
  await page.screenshot({ path: path.join(outputDir, `${label}-goal.png`), fullPage: true });
  await page.getByTestId("activation-start-mission").click();
  await page.waitForURL(/\/learn\/1\/math\/zahlen-1-10\?first-week=1$/);
  await page.getByText("Aufgabe 1 von 5", { exact: true }).waitFor();

  for (let index = 1; index <= 4; index += 1) {
    await answerCurrentExercise(page);
    await page.getByText(`Aufgabe ${index + 1} von 5`, { exact: true }).waitFor();
  }
  await answerCurrentExercise(page);
  const continueWithoutReview = page.getByRole("button", { name: /Weiter ohne Üben/i });
  if (await continueWithoutReview.waitFor({ state: "visible", timeout: 2_000 }).then(() => true).catch(() => false)) {
    await continueWithoutReview.click();
  }
  try {
    await page.getByText("Erste Mission geschafft", { exact: true }).waitFor({ timeout: 8_000 });
  } catch (error) {
    await page.screenshot({ path: path.join(outputDir, `${label}-mission-debug.png`), fullPage: true });
    const debug = await page.locator("h1, h2, p, button").evaluateAll(nodes => nodes.map(node => node.textContent?.trim()).filter(Boolean));
    throw new Error(`Mission completion missing at ${page.url()}: ${JSON.stringify(debug)}`, { cause: error });
  }
  await page.screenshot({ path: path.join(outputDir, `${label}-mission-complete.png`), fullPage: true });
  await page.getByRole("button", { name: "Zum Lernplan" }).click();
  await page.waitForURL(/\/dashboard\?activation=complete$/);
  await page.getByTestId("activation-checklist").waitFor();
  await page.getByText("Erste Mission geschafft", { exact: true }).waitFor();
  await page.screenshot({ path: path.join(outputDir, `${label}-checklist.png`), fullPage: true });

  const result = {
    label,
    url: page.url(),
    consoleErrors,
    failedRequests,
    horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
  };
  await browser.close();
  return result;
}

const results = [
  await run({ width: 1440, height: 1000 }, "desktop"),
  await run({ width: 390, height: 844 }, "mobile"),
];

for (const result of results) {
  if (result.consoleErrors.length || result.failedRequests.length || result.horizontalOverflow) {
    throw new Error(JSON.stringify(result, null, 2));
  }
}

console.log(JSON.stringify(results, null, 2));
