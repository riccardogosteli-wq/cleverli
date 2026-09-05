import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const base = "https://www.cleverli.ch";
const output = ".qa/full-pattern-review-2026-09-05/live";
mkdirSync(output, { recursive: true });

const cases = [
  {
    name: "r14-desktop",
    url: "/learn/1/german/reime?exercise=r14#exercise",
    includes: ["Was reimt sich auf", "Hand", "Wand", "Hund", "Mond", "Wind"],
    excludes: [],
  },
  {
    name: "sz45-desktop",
    url: "/learn/2/german/satzzeichen?exercise=sz45#exercise",
    includes: ["Immer (z.B.", "Am Ende jeder Aussage", "Bei einer Frage mit W-Fragewort", "Bei einer höflichen Bitte"],
    excludes: ["ein Komma, dann klein weitergeht"],
  },
  {
    name: "g7-mobile",
    url: "/learn/2/science/gesunde-ernaehrung?exercise=g2-science-gesunde-ernaehrung-g7#exercise",
    includes: ["Welche Nahrungsmittel geben uns am meisten Energie", "Kohlenhydrate", "Vitamine aus Obst und Gemüse", "Wasser und ungesüsster Tee"],
    excludes: ["Verdauung", "1–1.5 Liter"],
    mobile: true,
  },
  {
    name: "fd3-10-mobile",
    url: "/learn/3/english/food-drink-3?exercise=fd3-10#exercise",
    includes: ["What is 'Orange' in English?", "orange", "lemon", "grapefruit", "tangerine"],
    excludes: ["🍊"],
    mobile: true,
  },
];

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const test of cases) {
    const context = await browser.newContext(test.mobile ? devices["iPhone 13"] : { viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", request => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`));
    const response = await page.goto(`${base}${test.url}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1200);
    const text = await page.locator("body").innerText();
    const missing = test.includes.filter(value => !text.includes(value));
    const presentExcluded = test.excludes.filter(value => text.includes(value));
    if (missing.length || presentExcluded.length || response?.status() !== 200) {
      throw new Error(`${test.name}: status=${response?.status()} missing=${JSON.stringify(missing)} excluded=${JSON.stringify(presentExcluded)}`);
    }
    await page.screenshot({ path: `${output}/${test.name}.png`, fullPage: true });
    results.push({ name: test.name, status: response.status(), missing, presentExcluded, consoleErrors, failedRequests });
    await context.close();
  }
} finally {
  await browser.close();
}

writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify({ verdict: "approved", results }, null, 2));
