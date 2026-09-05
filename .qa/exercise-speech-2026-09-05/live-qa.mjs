import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium, devices } from "playwright";

const baseUrl = process.env.CLEVERLI_QA_BASE_URL ?? "https://www.cleverli.ch";
const outputDir = new URL("./live/", import.meta.url).pathname;
mkdirSync(outputDir, { recursive: true });

const checks = [
  {
    id: "v29",
    url: `${baseUrl}/learn/1/math/verdoppeln-halbieren?exercise=v29#exercise`,
    expected: "Was ist das Doppelte von zwei?",
  },
  {
    id: "z6",
    url: `${baseUrl}/learn/1/math/zahlen-1-10?exercise=z6#exercise`,
    expected: "Welche Zahl kommt nach sieben?",
  },
];

const viewports = [
  { id: "desktop", viewport: { width: 1440, height: 1100 } },
  { id: "mobile", device: devices["iPhone 13"] },
];

const failures = [];
for (const viewport of viewports) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(viewport.device ?? { viewport: viewport.viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", request => {
    const url = request.url();
    if (url.includes("cleverli.ch") && !url.includes("/api/tts")) failedRequests.push(`${url}: ${request.failure()?.errorText ?? "failed"}`);
  });

  for (const check of checks) {
    try {
      const response = await page.goto(check.url, { waitUntil: "networkidle", timeout: 45_000 });
      assert.equal(response?.status(), 200, "page must return HTTP 200");
      const readButton = page.getByRole("button", { name: "Vorlesen" });
      await readButton.waitFor({ state: "visible", timeout: 20_000 });
      await readButton.scrollIntoViewIfNeeded();
      const ttsRequest = page.waitForRequest(request => new URL(request.url()).pathname === "/api/tts", { timeout: 20_000 });
      await readButton.click();
      const request = await ttsRequest;
      const spokenText = new URL(request.url()).searchParams.get("text");
      assert.equal(spokenText, check.expected, "TTS request text must be semantic and child-friendly");
      await page.screenshot({ path: `${outputDir}${check.id}-${viewport.id}.png`, fullPage: true });
    } catch (error) {
      failures.push(`${check.id}/${viewport.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (consoleErrors.length) failures.push(`${viewport.id}: console errors: ${consoleErrors.join(" | ")}`);
  if (failedRequests.length) failures.push(`${viewport.id}: failed same-origin requests: ${failedRequests.join(" | ")}`);
  await browser.close();
}

console.log(JSON.stringify({ baseUrl, checks: checks.length * viewports.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
