/* eslint-disable @typescript-eslint/no-require-imports -- Offline email rendering, no transport. */
const fs = require('node:fs'), ts = require('typescript'), vm = require('node:vm');
const { chromium, expect } = require('@playwright/test');
function load(file, mocks = {}) {
  const mod = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText,
    { module: mod, exports: mod.exports, require: name => mocks[name] || require(name), Date, Intl, Set });
  return mod.exports;
}
(async () => {
  const billing = load('src/lib/accountBilling.ts');
  const mail = load('src/lib/cancellationEmail.ts', { './accountBilling': billing });
  const output = '.qa/cancellation-mail'; fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [], requests = []; let scenarios = 0;
  try {
    for (const lang of ['de', 'fr', 'it', 'en']) {
      const payload = mail.cancellationEmail('fixture@example.invalid', '2099-01-01T00:00:00.000Z', lang, true);
      fs.writeFileSync(`${output}/${lang}.html`, payload.html); fs.writeFileSync(`${output}/${lang}.txt`, payload.text);
      for (const width of [1440, 375]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, serviceWorkers: 'block' });
        await page.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
        page.on('pageerror', error => errors.push(error.message));
        await page.setContent(payload.html);
        await expect(page.getByRole('heading', { name: payload.subject })).toBeVisible();
        await expect(page.locator('body')).toContainText('Europe/Zurich');
        if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error(`Overflow ${lang}/${width}`);
        if (lang === 'de') await page.screenshot({ path: `${output}/${width === 375 ? 'mobile' : 'desktop'}.png`, fullPage: true });
        scenarios++; await page.close();
      }
    }
    if (errors.length || requests.length) throw Error('Unexpected page error or network access');
    fs.writeFileSync(`${output}/render-result.json`, JSON.stringify({ scenarios, errors, requests, sent: 0, mode: 'Offline HTML render only. Actual customer copy with synthetic date/recipient. No email provider or customer access.' }, null, 2));
    console.log(`${scenarios} offline email browser render scenarios passed. No external requests, errors or sends.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
