/* eslint-disable @typescript-eslint/no-require-imports -- Offline CommonJS VM test harness. */
// Offline only: actual policy/route/component modules, in-memory Stripe and database adapters.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript');
function load(file, mocks = {}) {
  const mod = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require: name => name in mocks ? mocks[name] : require(name), Date, console, process: { env: {} }, Set });
  return mod.exports;
}
const policy = load('src/lib/accountBilling.ts');
const profile = () => ({ stripe_subscription_id: 'sub_fixture', stripe_customer_id: 'cus_fixture', premium_plan: 'monthly', premium: true, premium_until: '2099-01-01T00:00:00.000Z', cancelled: false, email: 'fixture@example.invalid' });
const sub = extra => ({ id: 'sub_fixture', customer: 'cus_fixture', metadata: { userId: 'fixture-user' }, status: 'active', cancel_at_period_end: false, cancel_at: null, ended_at: null, items: { data: [{ current_period_end: 4070908800 }] }, ...extra });
function stripeFixture(initial = sub(), options = {}) {
  let current = initial, updates = 0, reads = 0, lists = 0;
  return { get updates() { return updates; }, get reads() { return reads; }, get lists() { return lists; }, subscriptions: {
    retrieve: async () => { reads++; if (options.readFail) throw Error('offline failure'); return current; },
    update: async (_id, patch) => { updates++; assert.deepEqual(JSON.parse(JSON.stringify(patch)), { cancel_at_period_end: true }); if (options.updateFail) throw Error('offline failure'); if (!options.noConfirm) current = { ...current, ...patch }; return current; },
    list: args => { lists++; assert.equal(args.customer, 'cus_fixture'); assert.equal(args.status, 'all'); return (async function* () { for (const item of options.candidates || []) yield item; })(); },
  } };
}
for (const [name, input, expected] of [
  ['active', {}, 'active'], ['trial', { status: 'trialing', trial_end: 4070908700 }, 'trial'],
  ['cancelled active', { cancel_at_period_end: true }, 'cancelled'], ['cancelled trial', { status: 'trialing', trial_end: 4070908700, cancel_at_period_end: true }, 'cancelled'],
  ['explicit scheduled end', { cancel_at: 4070908600 }, 'cancelled'], ['ended', { status: 'canceled', ended_at: 1700000000 }, 'ended'],
  ['expired cancellation', { cancel_at_period_end: true, items: { data: [{ current_period_end: 1700000000 }] } }, 'ended'],
  ['past due', { status: 'past_due' }, 'attention'], ['unpaid', { status: 'unpaid' }, 'attention'],
]) test(`classifies ${name}`, () => assert.equal(policy.subscriptionBilling(sub(input)).state, expected));
test('exact trial end wins over item end', () => assert.equal(policy.subscriptionEnd(sub({ status: 'trialing', trial_end: 1700000000 })), '2023-11-14T22:13:20.000Z'));
test('cancel_at wins over item end', () => assert.equal(policy.subscriptionEnd(sub({ cancel_at: 1700000000 })), '2023-11-14T22:13:20.000Z'));
test('unknown and mixed ends are never invented', () => { assert.equal(policy.subscriptionEnd(sub({ items: { data: [] } })), null); assert.equal(policy.subscriptionEnd(sub({ items: { data: [{ current_period_end: 1 }, { current_period_end: 2 }] } })), null); });
test('legacy Stripe period supported', () => assert.equal(policy.subscriptionEnd(sub({ current_period_end: 1700000000 })), '2023-11-14T22:13:20.000Z'));
test('lifetime is separate', () => assert.equal(policy.nonSubscriptionBilling({ ...profile(), premium_plan: 'schooltime' }).state, 'lifetime'));
test('free has no cancellation CTA', () => assert.equal(policy.nonSubscriptionBilling({ ...profile(), premium: false }).canCancel, false));
test('legacy cancelled flag cannot prove Stripe cancellation', () => assert.throws(() => policy.nonSubscriptionBilling({ ...profile(), cancelled: true }), /subscription_not_found/));
test('readback required after update', async () => { const s = stripeFixture(); const result = await policy.confirmCancellation(s, profile(), 'fixture-user'); assert.equal(result.billing.state, 'cancelled'); assert.equal(s.reads, 2); assert.equal(s.updates, 1); });
test('Stripe write failure rejects', async () => { const s = stripeFixture(sub(), { updateFail: true }); await assert.rejects(policy.confirmCancellation(s, profile(), 'fixture-user')); });
test('Stripe read failure rejects without update', async () => { const s = stripeFixture(sub(), { readFail: true }); await assert.rejects(policy.confirmCancellation(s, profile(), 'fixture-user')); assert.equal(s.updates, 0); });
test('unconfirmed Stripe response rejects', async () => { const s = stripeFixture(sub(), { noConfirm: true }); await assert.rejects(policy.confirmCancellation(s, profile(), 'fixture-user'), /cancellation_not_confirmed/); });
test('repeat confirmed cancellation does not update again', async () => { const s = stripeFixture(sub({ cancel_at_period_end: true })); await policy.confirmCancellation(s, profile(), 'fixture-user'); assert.equal(s.updates, 0); });
for (const [name, patch] of [['wrong metadata', { metadata: { userId: 'someone-else' } }], ['wrong customer', { customer: 'cus_other' }]]) test(`rejects ${name}`, async () => { const s = stripeFixture(sub(patch)); await assert.rejects(policy.confirmCancellation(s, profile(), 'fixture-user'), /identity_mismatch/); assert.equal(s.updates, 0); });
test('legacy exact stored customer and subscription remains supported', () => assert.equal(policy.ownsSubscription(sub({ metadata: {} }), profile(), 'fixture-user'), true));
test('unbound metadata-free identity rejected', () => assert.equal(policy.ownsSubscription(sub({ metadata: {} }), { ...profile(), stripe_customer_id: null }, 'fixture-user'), false));
test('lifetime cannot mutate Stripe', async () => { const s = stripeFixture(); await assert.rejects(policy.confirmCancellation(s, { ...profile(), premium_plan: 'schooltime' }, 'fixture-user'), /lifetime_access/); assert.equal(s.reads, 0); assert.equal(s.updates, 0); });
test('missing subscription cannot report success', async () => { const s = stripeFixture(); await assert.rejects(policy.confirmCancellation(s, { ...profile(), stripe_subscription_id: null }, 'fixture-user'), /subscription_not_found/); });
test('customer fallback includes trial and paginates iterable', async () => { const s = stripeFixture(sub({ status: 'trialing' }), { candidates: [sub({ status: 'canceled' }), sub({ status: 'trialing' })] }); await policy.confirmCancellation(s, { ...profile(), stripe_subscription_id: null }, 'fixture-user'); assert.equal(s.updates, 1); });
test('ambiguous customer subscriptions fail closed', async () => { const s = stripeFixture(sub(), { candidates: [sub(), sub({ id: 'sub_second' })] }); await assert.rejects(policy.confirmCancellation(s, { ...profile(), stripe_subscription_id: null }, 'fixture-user'), /multiple_subscriptions/); assert.equal(s.updates, 0); });

function routeFixture(options = {}) {
  const stripe = stripeFixture(options.sub || sub(), options);
  const writes = [], filters = [], logs = [];
  const db = { auth: { getUser: async () => ({ data: { user: options.unauthorized ? null : { id: 'fixture-user' } }, error: null }) }, from: () => {
    let writing = false;
    const q = { select: () => writing ? Promise.resolve({ data: options.dbFail ? [] : [{ id: 'fixture-user' }], error: options.dbFail ? Error('db') : null }) : q,
      eq: (key, value) => { filters.push([key, value]); return q; }, is: (key, value) => { filters.push([key, value]); return q; },
      single: async () => ({ data: options.profile || profile(), error: options.profileFail ? Error('db') : null }),
      update: patch => { writing = true; writes.push(patch); return q; } };
    return q;
  } };
  const route = load('src/app/api/cancel-subscription/route.ts', { '@/lib/accountBilling': policy, '@sentry/nextjs': { captureException() {}, captureMessage() {} }, stripe: function () { return stripe; }, '@supabase/supabase-js': { createClient: () => db }, '@/lib/userActivityServer': { logUserActivity: async entry => { logs.push(entry); } } });
  const request = (method = 'POST', body = { userId: 'fixture-user' }, token = true) => new (require('next/server').NextRequest)('http://localhost/api/cancel-subscription', { method, headers: token ? { authorization: 'Bearer offline-fixture', 'content-type': 'application/json' } : {}, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });
  return { route, stripe, writes, filters, logs, request };
}
test('route denies missing token without Stripe or DB write', async () => { const f = routeFixture(); assert.equal((await f.route.POST(f.request('POST', {}, false))).status, 400); assert.equal((await f.route.POST(f.request('POST', { userId: 'fixture-user' }, false))).status, 401); assert.equal(f.stripe.reads, 0); assert.equal(f.writes.length, 0); });
test('route denies different user identity', async () => { const f = routeFixture(); assert.equal((await f.route.POST(f.request('POST', { userId: 'other' }))).status, 401); assert.equal(f.stripe.reads, 0); });
test('route profile failure writes nothing', async () => { const f = routeFixture({ profileFail: true }); assert.equal((await f.route.POST(f.request())).status, 503); assert.equal(f.writes.length, 0); });
test('route Stripe failure never marks cancelled or succeeds', async () => { const f = routeFixture({ updateFail: true }); const r = await f.route.POST(f.request()); assert.equal(r.status, 502); assert.equal((await r.json()).ok, undefined); assert.equal(f.writes.length, 0); });
test('route persists exact end after confirmation with lifetime race guards and reasons', async () => { const f = routeFixture(); const r = await f.route.POST(f.request('POST', { userId: 'fixture-user', cancellationReason: 'too_expensive', cancellationComment: '  fixture  ', retentionOfferShown: true })); assert.equal(r.status, 200); assert.equal(f.writes[0].cancelled, true); assert.equal(f.writes[0].stripe_subscription_id, "sub_fixture"); assert.equal(f.writes[0].premium_until, '2099-01-01T00:00:00.000Z'); assert.ok(f.filters.some(([k,v]) => k === 'premium_plan' && v === 'monthly')); assert.ok(f.filters.some(([k,v]) => k === 'stripe_subscription_id' && v === 'sub_fixture')); assert.equal(f.logs[0].metadata.cancellationComment, 'fixture'); assert.equal(f.logs[0].metadata.retentionOutcome, 'declined'); });
test('DB failure after Stripe returns retryable non-success', async () => { const f = routeFixture({ dbFail: true }); const r = await f.route.POST(f.request()); assert.equal(r.status, 503); assert.equal((await r.json()).error, 'cancellation_sync_pending'); });
test('unknown end does not erase existing entitlement limit', async () => { const f = routeFixture({ sub: sub({ items: { data: [] } }) }); const r = await f.route.POST(f.request()); assert.equal((await r.json()).billing.endAt, null); assert.equal('premium_until' in f.writes[0], false); });
test('ended subscription disables entitlement', async () => { const f = routeFixture({ sub: sub({ status: 'canceled', ended_at: 1700000000 }) }); await f.route.POST(f.request()); assert.equal(f.writes[0].premium, false); });
test('GET rehydrates cancelled Stripe truth without any writes', async () => { const f = routeFixture({ sub: sub({ cancel_at_period_end: true }) }); const r = await f.route.GET(f.request('GET')); assert.equal(r.status, 200); assert.equal((await r.json()).billing.state, 'cancelled'); assert.equal(r.headers.get('cache-control'), 'no-store, private'); assert.equal(f.writes.length, 0); assert.equal(f.stripe.updates, 0); });
test('GET requires authentication', async () => { const f = routeFixture(); assert.equal((await f.route.GET(f.request('GET', {}, false))).status, 401); assert.equal(f.stripe.reads, 0); });
test('GET lifetime skips Stripe and writes', async () => { const f = routeFixture({ profile: { ...profile(), premium_plan: 'schooltime' } }); const r = await f.route.GET(f.request('GET')); assert.equal((await r.json()).billing.state, 'lifetime'); assert.equal(f.stripe.reads, 0); assert.equal(f.writes.length, 0); });
const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
const Status = load('src/components/AccountBillingStatus.tsx').default;
for (const lang of ['de', 'fr', 'it', 'en']) test(`status renders exact date and invoice caveat in ${lang}`, () => { const html = renderToStaticMarkup(React.createElement(Status, { lang, billing: policy.subscriptionBilling(sub({ cancel_at_period_end: true })) })); assert.match(html, /2099-01-01T00:00:00.000Z/); assert.match(html, /Europe\/Zurich/); assert.match(html, /Rechnungen|factures|fatture|invoices/); assert.ok(!html.includes('ß')); });
test('unknown date displays support fallback, never Invalid Date', () => { const html = renderToStaticMarkup(React.createElement(Status, { lang: 'de', billing: { state: 'cancelled', endAt: null, accessActive: true, canCancel: false } })); assert.match(html, /genaue Enddatum/); assert.ok(!html.includes('<time')); });

test('readback failure after Stripe update never persists success', async () => {
  const f = routeFixture(); const original = f.stripe.subscriptions.retrieve; let reads = 0;
  f.stripe.subscriptions.retrieve = async (...args) => { if (++reads === 2) throw Error('readback unavailable'); return original(...args); };
  const r = await f.route.POST(f.request()); assert.equal(r.status, 502); assert.equal(f.writes.length, 0);
});

test('later cancel_at is scheduled, not a no-renewal cancellation',()=>{const b=policy.subscriptionBilling(sub({cancel_at:4073587200}));assert.equal(b.state,'scheduled');assert.equal(b.canCancel,true);assert.equal(policy.noFurtherRenewal(sub({cancel_at:4073587200})),false);});
test('later cancel_at cannot bypass explicit cancellation update or readback',async()=>{const s=stripeFixture(sub({cancel_at:4073587200}));await assert.rejects(policy.confirmCancellation(s,profile(),'fixture-user'),/cancellation_not_confirmed/);assert.equal(s.updates,1);});
test('managed future schedule is rejected honestly before mutation',async()=>{const s=stripeFixture(sub({cancel_at:4073587200,schedule:'sched_fixture'}));await assert.rejects(policy.confirmCancellation(s,profile(),'fixture-user'),/subscription_schedule_requires_review/);assert.equal(s.updates,0);});
test('explicit current-period cancellation can replace a later unscheduled termination',async()=>{const s=stripeFixture(sub({cancel_at:4073587200}));const update=s.subscriptions.update;s.subscriptions.update=async(id,patch)=>{await update(id,patch);s.subscriptions.retrieve=async()=>sub({cancel_at:4070908800,cancel_at_period_end:true});};const r=await policy.confirmCancellation(s,profile(),'fixture-user');assert.equal(r.billing.state,'cancelled');assert.equal(r.billing.endAt,'2099-01-01T00:00:00.000Z');});
test('arbitrary cancel_at with unknown period does not prove stopped renewal',()=>{assert.equal(policy.noFurtherRenewal(sub({cancel_at:4070908800,items:{data:[]}})),false);});
test('mixed item periods use earliest renewal boundary',()=>{assert.equal(policy.noFurtherRenewal(sub({cancel_at:4070908800,items:{data:[{current_period_end:4070908700},{current_period_end:4070908800}]}})),false);});
test('trial cannot promise no renewal when cancellation is after trial end',()=>{assert.equal(policy.subscriptionBilling(sub({status:'trialing',trial_end:4070908700,cancel_at:4070908800})).state,'scheduled');});
test('unique owned terminal fallback resolves end date',async()=>{const s=stripeFixture(sub(),{candidates:[sub({status:'canceled',ended_at:1700000000})]});const resolved=await policy.resolveSubscription(s,{...profile(),stripe_subscription_id:null},'fixture-user');assert.equal(policy.subscriptionBilling(resolved).state,'ended');assert.equal(policy.subscriptionEnd(resolved),'2023-11-14T22:13:20.000Z');});
test('ambiguous terminal history remains fail-closed',async()=>{const s=stripeFixture(sub(),{candidates:[sub({status:'canceled'}),sub({id:'sub_old',status:'canceled'})]});await assert.rejects(policy.resolveSubscription(s,{...profile(),stripe_subscription_id:null},'fixture-user'),/multiple_subscriptions/);});
test('GET supports unique terminal fallback without writes',async()=>{const f=routeFixture({profile:{...profile(),stripe_subscription_id:null,cancelled:true,premium:false},candidates:[sub({status:'canceled',ended_at:1700000000})]});const r=await f.route.GET(f.request('GET'));assert.equal(r.status,200);assert.equal((await r.json()).billing.state,'ended');assert.equal(f.writes.length,0);});
for(const lang of ['de','fr','it','en'])test(`later termination copy warns of intervening renewals in ${lang}`,()=>{const html=renderToStaticMarkup(React.createElement(Status,{lang,billing:policy.subscriptionBilling(sub({cancel_at:4073587200}))}));assert.match(html,/weitere automatische|renouvellements automatiques restent|ancora possibili rinnovi|Further automatic renewals/);assert.ok(!/Keine automatische Verlängerung|Aucun renouvellement automatique|Nessun rinnovo automatico|No automatic renewal/.test(html));});

test('POST never persists later termination as confirmed non-renewal',async()=>{const f=routeFixture({sub:sub({cancel_at:4073587200})});const r=await f.route.POST(f.request());assert.equal(r.status,502);assert.equal(f.writes.length,0);assert.equal(f.stripe.updates,1);});

test('expired incomplete subscription does not invent an end from a future item period',()=>{assert.equal(policy.subscriptionEnd(sub({status:'incomplete_expired',ended_at:null})),null);});

// Owner grants are not Stripe subscriptions. Only the explicit, unlinked plan qualifies.
const owner = extra => ({ ...profile(), premium_plan: 'manual_owner', stripe_customer_id: null, stripe_subscription_id: null, ...extra });
test('owner grant is active and never cancellable', () => {
  const b = policy.nonSubscriptionBilling(owner());
  assert.equal(b.state, 'granted'); assert.equal(b.accessActive, true); assert.equal(b.canCancel, false);
});
for (const [name, patch, active] of [
  ['no expiry', {premium_until:null}, true], ['expired', {premium_until:'2000-01-01T00:00:00Z'}, false],
  ['revoked', {premium:false}, false], ['exact expiry', {premium_until:'2026-09-26T00:00:00Z'}, false],
]) test(`owner ${name} honours entitlement`, () => assert.equal(policy.nonSubscriptionBilling(owner(patch), Date.parse('2026-09-26T00:00:00Z')).accessActive, active));
test('malformed owner expiry fails closed', () => assert.throws(() => policy.nonSubscriptionBilling(owner({premium_until:'invalid'})), /invalid_entitlement_end/));
for (const patch of [{premium_plan:'monthly'}, {premium_plan:'unknown'}, {cancelled:true}, {stripe_customer_id:'cus_fixture'}, {stripe_subscription_id:'sub_fixture'}])
  test(`no grant bypass for ${JSON.stringify(patch)}`, () => {
    assert.equal(policy.isOwnerGrant(owner(patch)), false);
    assert.throws(() => policy.nonSubscriptionBilling(owner(patch)), /subscription_not_found/);
  });
test('owner GET succeeds without Stripe calls or DB changes', async () => {
  const f=routeFixture({profile:owner()});const r=await f.route.GET(f.request('GET'));
  assert.equal(r.status,200);assert.equal((await r.json()).billing.state,'granted');
  assert.equal(f.stripe.reads,0);assert.equal(f.stripe.lists,0);assert.equal(f.stripe.updates,0);assert.equal(f.writes.length,0);
});
test('owner GET still requires valid authentication', async () => {
  const f=routeFixture({profile:owner(),unauthorized:true});assert.equal((await f.route.GET(f.request('GET'))).status,401);
});
test('owner POST cannot cancel or mutate anything', async () => {
  const f=routeFixture({profile:owner()});assert.equal((await f.route.POST(f.request())).status,404);
  assert.equal(f.stripe.updates,0);assert.equal(f.writes.length,0);
});
for(const lang of ['de','fr','it','en']) test(`owner copy is non-renewing and not a subscription in ${lang}`,()=>{
  const html=renderToStaticMarkup(React.createElement(Status,{lang,billing:policy.nonSubscriptionBilling(owner())}));
  assert.match(html,/kein Abonnement|Aucun abonnement|Non serve un abbonamento|No subscription/);
  assert.doesNotMatch(html,/Nächste Verlängerung|Prochain renouvellement|Prossimo rinnovo|Next renewal|could not be confirmed|konnte nicht bestätigt/);
  const noDate=renderToStaticMarkup(React.createElement(Status,{lang,billing:policy.nonSubscriptionBilling(owner({premium_until:null}))}));
  assert.doesNotMatch(noDate,/<time|Invalid Date|hello@/);
});
test('revoked owner rendering never claims enabled Premium',()=>{
  const html=renderToStaticMarkup(React.createElement(Status,{lang:'de',billing:policy.nonSubscriptionBilling(owner({premium:false}))}));
  assert.match(html,/Premium ist derzeit nicht aktiv/);assert.doesNotMatch(html,/wurde direkt freigeschaltet/);
});
