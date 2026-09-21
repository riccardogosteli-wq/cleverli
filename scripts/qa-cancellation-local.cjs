/* eslint-disable @typescript-eslint/no-require-imports -- Standalone local-only CommonJS browser runner. */
// Safe local-only browser fixture. Never run against production or real credentials.
// Start a credential-free build with NEXT_PUBLIC_SUPABASE_URL=https://cancellation-fixture.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=offline-fixture-not-a-real-key, then next start on 127.0.0.1:3319.
const { chromium, expect: baseExpect } = require('@playwright/test');
const expect = baseExpect.configure({ timeout: 20000 });
const fs = require('node:fs');
const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:3319';
const target = new URL(origin);
if (!['127.0.0.1', 'localhost'].includes(target.hostname) || target.protocol !== 'http:') throw Error('Local HTTP fixture only');
const userId = '00000000-0000-4000-8000-000000000019';
const endAt = '2099-01-01T00:00:00.000Z';
let billing = { state: 'active', endAt, accessActive: true, canCancel: true }, failCancel = false, failRead = false, posts = 0, checks = 0;
const output = '.qa/cancellation-confirmation';
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [], consoleErrors = [], requestFailures = [], httpErrors = [];
  async function fixture(width = 1440, lang = 'de') {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: 'block' });
    await context.route('**/*', async route => {
      const req = route.request(), url = new URL(req.url());
      const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
      if (url.hostname === 'cancellation-fixture.supabase.co') {
        if (url.pathname.includes('/parent_profiles')) return json({ id: userId, email: 'fixture@example.invalid', name: 'Lokale Testfamilie', premium: true, premium_plan: 'monthly', premium_until: endAt, cancelled: false });
        if (url.pathname.includes('/teacher_accounts')) return json(null);
        if (url.pathname.includes('/auth/')) return json({ id: userId, email: 'fixture@example.invalid', user_metadata: { name: 'Lokale Testfamilie' } });
        return json([]);
      }
      if (url.origin !== target.origin) return route.fulfill({ status: 200, contentType: 'text/plain', body: '' });
      if (url.pathname === '/api/cancel-subscription') {
        if (req.method() === 'POST') {
          posts++;
          if (failCancel) return json({ error: 'cancellation_failed' }, 502);
          billing = { ...billing, state: 'cancelled', canCancel: false };
          return json({ ok: true, billing });
        }
        return failRead ? json({ error: 'billing_unavailable' }, 503) : json({ billing });
      }
      if (url.pathname === '/api/retention-offer') return json({ ok: true, yearlyPriceChf: 66, effectiveAt: endAt });
      if (url.pathname.startsWith('/api/')) return json({ ok: true });
      return route.continue();
    });
    await context.addInitScript(({ userId, endAt, lang }) => {
      if (!['127.0.0.1', 'localhost'].includes(location.hostname)) return;
      const user = { id: userId, aud: 'authenticated', role: 'authenticated', email: 'fixture@example.invalid', app_metadata: { provider: 'email' }, user_metadata: { name: 'Lokale Testfamilie' }, created_at: '2026-01-01T00:00:00Z' };
      const encode = value => btoa(JSON.stringify(value)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      // Entirely synthetic local SDK fixture, never accepted by a production server.
      const token = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: userId, exp: 4070908800, aud: 'authenticated' })}.offline-fixture-signature`;
      if (!localStorage.getItem('cleverli_supabase_session')) localStorage.setItem('cleverli_supabase_session', JSON.stringify({ access_token: token, refresh_token: 'offline-fixture-refresh', token_type: 'bearer', expires_in: 999999, expires_at: 4070908800, user }));
      localStorage.setItem('cleverli_session', JSON.stringify({ email: user.email, name: 'Lokale Testfamilie', userId, premium: true, premiumPlan: 'monthly', premiumUntil: endAt }));
      localStorage.setItem('cleverli_lang', lang);
      let hash = 5381; for (const char of userId) hash = (hash * 33) ^ char.charCodeAt(0);
      localStorage.setItem(`cleverli_parent_unlocked__account_${(hash >>> 0).toString(36)}`, JSON.stringify({ until: Date.now() + 3600000 }));
    }, { userId, endAt, lang });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('requestfailed', r => requestFailures.push({ path: new URL(r.url()).pathname, error: r.failure()?.errorText }));
    page.on('response', r => { if (r.status() >= 400) httpErrors.push({ path: new URL(r.url()).pathname, status: r.status() }); });
    if (process.env.QA_DEBUG) { page.on('console', m => console.log('CONSOLE', m.type(), m.text())); page.on('request', r => console.log('REQUEST', r.method(), new URL(r.url()).pathname)); }
    await page.goto(origin + '/account');
    await expect(page.getByTestId('account-billing-status')).toBeVisible();
    return { context, page };
  }
  try {
    let { context, page } = await fixture();
    await expect(page.getByTestId('account-billing-status')).toContainText('Premium aktiv'); checks++;
    await page.getByRole('button', { name: 'Abonnement kündigen', exact: true }).click();
    await page.getByRole('button', { name: 'Mein Kind nutzt es zu wenig', exact: true }).click();
    await expect(page.getByText('Bleib für CHF 66/Jahr')).toHaveCount(0); checks++;
    await page.getByRole('button', { name: 'Zu teuer', exact: true }).click();
    await expect(page.getByText('Bleib für CHF 66/Jahr')).toBeVisible(); checks++;
    failCancel = true;
    await page.getByRole('button', { name: 'Trotzdem kündigen', exact: true }).click();
    await expect(page.getByText('Die Änderung konnte nicht bestätigt werden.', { exact: false })).toBeVisible();
    await expect(page.getByTestId('account-billing-status')).not.toContainText('Abonnement gekündigt'); checks++;
    failCancel = false;
    await page.getByRole('button', { name: 'Zurück', exact: true }).click();
    await page.getByRole('button', { name: 'Trotzdem kündigen', exact: true }).click();
    await expect(page.getByTestId('account-billing-status')).toContainText('Abonnement gekündigt');
    await expect(page.getByTestId('account-billing-status').locator('time')).toHaveAttribute('datetime', endAt);
    await expect(page.getByTestId('account-billing-status')).toContainText('Keine automatische Verlängerung.'); checks++;
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${output}/desktop-cancelled.png`, fullPage: true });
    await page.reload();
    await expect(page.getByTestId('account-billing-status')).toContainText('Abonnement gekündigt');
    await expect(page.getByRole('button', { name: 'Abonnement kündigen', exact: true })).toHaveCount(0); checks++;
    await context.close();
    ({ context, page } = await fixture(375));
    await expect(page.getByTestId('account-billing-status')).toContainText('Abonnement gekündigt'); checks++;
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${output}/mobile-cancelled.png`, fullPage: true });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Mobile overflow'); checks++;
    await context.close();
    for (const [lang, label] of [['de','Abonnement gekündigt'],['fr','Abonnement résilié'],['it','Abbonamento annullato'],['en','Subscription cancelled']]) {
      ({ context, page } = await fixture(375, lang));
      await expect(page.getByTestId('account-billing-status')).toContainText(label); checks++;
      await context.close();
    }
    for (const [state, label, accessActive, canCancel] of [['scheduled','Kündigung zu einem späteren Termin',true,true],['trial','Premium in der Testphase',true,true],['ended','Abonnement beendet',false,false],['lifetime','Lebenslanger Zugang freigeschaltet',true,false]]) {
      billing = { state, endAt: state === 'lifetime' ? null : endAt, accessActive, canCancel };
      ({ context, page } = await fixture());
      await expect(page.getByTestId('account-billing-status')).toContainText(label); checks++;
      await expect(page.getByRole('button', { name: 'Abonnement kündigen', exact: true })).toHaveCount(canCancel ? 1 : 0); checks++;
      if (state === 'scheduled') { await expect(page.getByTestId('account-billing-status')).toContainText('weitere automatische Verlängerungen möglich'); await expect(page.getByTestId('account-billing-status')).not.toContainText('Keine automatische Verlängerung.'); checks++; await page.screenshot({ path: `${output}/scheduled-termination.png`, fullPage: true }); }
      await context.close();
    }
    billing = { state: 'active', endAt, accessActive: true, canCancel: true };
    ({ context, page } = await fixture());
    await page.getByRole('button', { name: 'Abonnement kündigen', exact: true }).click();
    await page.getByRole('button', { name: 'Zu teuer', exact: true }).click();
    await page.getByRole('button', { name: 'CHF 66/Jahr sichern', exact: true }).click();
    await expect(page.getByText('CHF 66/Jahr gesichert', { exact: false })).toBeVisible(); checks++;
    await expect(page.getByTestId('account-billing-status')).toContainText('Premium aktiv'); checks++;
    await context.close();
    billing = { state: 'cancelled', endAt: null, accessActive: true, canCancel: false };
    ({ context, page } = await fixture());
    await expect(page.getByTestId('account-billing-status')).toContainText('Das genaue Enddatum ist derzeit nicht verfügbar.'); checks++;
    await context.close();
    failRead = true;
    ({ context, page } = await fixture());
    await expect(page.getByTestId('account-billing-status')).toContainText('konnte nicht bestätigt werden');
    await expect(page.getByRole('button', { name: 'Abonnement kündigen', exact: true })).toHaveCount(0); checks++;
    await context.close();
    if (errors.length) throw Error(errors.join('\n'));
    fs.writeFileSync(`${output}/browser-result.json`, JSON.stringify({ checks, posts, pageErrors: errors, consoleErrors, requestFailures, httpErrors, boundary: 'Loopback app only. Synthetic local identity; all APIs and external hosts intercepted. No real authentication, customer data, payments, emails or Stripe traffic.' }, null, 2));
    console.log(`${checks} local browser checks passed; ${posts} MOCK cancellation POSTs; no page errors.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
