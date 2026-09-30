const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const BASE = process.env.WORKSHEET_QA_BASE || "http://127.0.0.1:3107";
const OUT = process.env.WORKSHEET_QA_OUT || ".qa/worksheet-topic-pages-20260930";
const pages = [
  ["buchstaben-1-klasse", "Buchstaben Arbeitsblatt für die 1. Klasse", "/worksheets/buchstaben-1-klasse-arbeitsblatt.pdf", "/worksheets/buchstaben-1-klasse-loesungen.pdf", "/learn/1/german/buchstaben"],
  ["einmaleins-2-klasse", "Einmaleins Arbeitsblatt für die 2. Klasse", "/worksheets/einmaleins-2-klasse-arbeitsblatt.pdf", "/worksheets/einmaleins-2-klasse-loesungen.pdf", "/learn/2/math/einmaleins"],
  ["brueche-3-klasse", "Brüche Arbeitsblatt für die 3. Klasse", "/worksheets/beispiel-klasse-3.pdf", "/worksheets/beispiel-klasse-3-loesungen.pdf", "/learn/3/math/brueche"],
  ["schriftlich-multiplizieren-4-klasse", "Schriftlich multiplizieren Arbeitsblatt für die 4. Klasse", "/worksheets/schriftlich-multiplizieren-4-klasse-arbeitsblatt.pdf", "/worksheets/schriftlich-multiplizieren-4-klasse-loesungen.pdf", "/learn/4/math/schriftl-multiplizieren"],
  ["dezimalzahlen-5-klasse", "Dezimalzahlen Arbeitsblatt für die 5. Klasse", "/worksheets/dezimalzahlen-5-klasse-arbeitsblatt.pdf", "/worksheets/dezimalzahlen-5-klasse-loesungen.pdf", "/learn/5/math/dezimalzahlen"],
  ["prozentrechnung-6-klasse", "Prozentrechnung Arbeitsblatt für die 6. Klasse", "/worksheets/prozentrechnung-6-klasse-arbeitsblatt.pdf", "/worksheets/prozentrechnung-6-klasse-loesungen.pdf", "/learn/6/math/prozent"],
];

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, locale: "de-CH" });
    for (const [slug, heading, worksheet, solution, exercise] of pages) {
      const page = await context.newPage();
      const errors = [], failed = [];
      page.on("pageerror", error => errors.push(String(error)));
      page.on("requestfailed", request => failed.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || "failed"}`));
      const response = await page.goto(`${BASE}/arbeitsblaetter/${slug}`, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, slug);
      await page.getByRole("heading", { level: 1, name: heading }).waitFor();
      await page.locator('script[type="application/ld+json"]').first().waitFor({ state: "attached" });
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://www.cleverli.ch/arbeitsblaetter/${slug}`);
      assert.equal(await page.getByRole("link", { name: /Arbeitsblatt kostenlos herunterladen/ }).getAttribute("href"), worksheet);
      assert.equal(await page.getByRole("link", { name: /Lösung herunterladen/ }).first().getAttribute("href"), solution);
      assert.equal(await page.getByRole("link", { name: /online üben/ }).getAttribute("href"), exercise);
      assert.equal(await page.getByRole("navigation", { name: "Weitere kostenlose Arbeitsblätter" }).getByRole("link").count(), 5);
      const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
      const types = schema.flatMap(text => { const value = JSON.parse(text); return (Array.isArray(value) ? value : [value]).map(item => item["@type"]); });
      assert(types.includes("BreadcrumbList"), `${slug} BreadcrumbList`);
      assert(types.includes("LearningResource"), `${slug} LearningResource`);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug} overflow ${viewport.name}`);
      await page.screenshot({ path: path.join(OUT, `${slug}-${viewport.name}.png`), fullPage: true });
      assert.deepEqual(errors, [], `${slug} page errors`);
      assert.deepEqual(failed.filter(line => !/google|doubleclick|facebook|posthog|sentry/i.test(line)), [], `${slug} critical request failures`);
      results.push({ slug, viewport: viewport.name, status: response.status(), overflow: false, pageErrors: 0, criticalRequestFailures: 0 });
      await page.close();
    }
    await context.close();
  }

  const request = await browser.newContext();
  for (const [, , worksheet, solution] of pages) for (const file of [worksheet, solution]) {
    const response = await request.request.get(BASE + file);
    assert.equal(response.status(), 200, file);
    assert.match(response.headers()["content-type"], /application\/pdf/, file);
    assert((await response.body()).subarray(0, 5).equals(Buffer.from("%PDF-")), file);
  }
  const hub = await request.request.get(`${BASE}/arbeitsblaetter`);
  assert.equal(hub.status(), 200);
  const sitemap = await request.request.get(`${BASE}/sitemap.xml`);
  assert.equal(sitemap.status(), 200);
  const sitemapText = await sitemap.text();
  for (const [slug] of pages) assert(sitemapText.includes(`/arbeitsblaetter/${slug}`), slug);
  await request.close();
  await browser.close();
  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify({ base: BASE, pages: pages.length, viewports: 2, screenshots: results.length, pdfChecks: pages.length * 2, results }, null, 2));
  console.log(JSON.stringify({ approved: true, pages: pages.length, viewports: 2, screenshots: results.length, pdfChecks: pages.length * 2 }));
})().catch(error => { console.error(error); process.exit(1); });
