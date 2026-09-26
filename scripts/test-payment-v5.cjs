const fs=require('fs'),assert=require('node:assert/strict'),ts=require('typescript'),path=require('path');
let count=0;function test(name,fn){fn();count++;console.log('PASS',name)}
function load(file,mocks={}){const m={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;new Function('require','module','exports',code)(name=>name in mocks?mocks[name]:require(name),m,m.exports);return m.exports}
const {verifiedCheckoutOutcome:verify}=load('src/lib/verifiedCheckout.ts');
const session={id:'cs_test_fixture12345678',created:1000,status:'complete',payment_status:'paid',amount_total:990,currency:'chf',mode:'subscription',metadata:{userId:'owner',site:'cleverli.ch',plan:'monthly'},invoice:{id:'in_fixture123',status:'paid',amount_paid:990,currency:'chf'}};
const clone=x=>JSON.parse(JSON.stringify(x));
for(const [plan,amount] of [['monthly',990],['yearly',9900],['schooltime',24900]])test('verified '+plan,()=>{let x=clone(session);x.metadata.plan=plan;x.amount_total=amount;x.invoice.amount_paid=amount;if(plan==='schooltime'){x.mode='payment';x.payment_intent={status:'succeeded',amount_received:amount,currency:'chf'}}let o=verify(x,'owner');assert.equal(o.value,amount/100);assert.equal(o.transactionId,x.id);assert.equal(o.metaEventId,plan==='schooltime'?`purchase_${x.id}`:'purchase_in_fixture123');assert.equal(verify(x,'owner').transactionId,o.transactionId)});
test('actual discounted amount not plan list price',()=>{const x=clone(session);x.amount_total=x.invoice.amount_paid=490;assert.equal(verify(x,'owner').value,4.9)});
for(const [name,patch] of Object.entries({unpaid:{payment_status:'unpaid'},expired:{status:'expired'},open:{status:'open'},asyncpending:{payment_status:'unpaid'},missingID:{id:''},badcurrency:{currency:'eur'},zero:{amount_total:0},negative:{amount_total:-1},missinginvoice:{invoice:null},unknownplan:{metadata:{...session.metadata,plan:'fake'}},wrongsite:{metadata:{...session.metadata,site:'other'}},invoicemismatch:{invoice:{...session.invoice,amount_paid:100}},invoicepending:{invoice:{...session.invoice,status:'open'}}}))test(name,()=>assert.equal(verify({...clone(session),...patch},'owner'),null));
test('other user',()=>assert.equal(verify(session,'other'),null));
const trial={...clone(session),amount_total:0,payment_status:'no_payment_required',subscription:{status:'trialing',trial_start:1000,trial_end:605800}};
test('actual verified trial zero revenue',()=>{const o=verify(trial,'owner');assert.equal(o.kind,'trial');assert.equal(o.value,0);assert.equal(o.trialDays,7);assert.equal(o.metaEventId,'trial_'+trial.id)});
test('genuine Stripe paid zero trial status',()=>{const o=verify({...trial,payment_status:'paid'},'owner');assert.equal(o.kind,'trial');assert.equal(o.value,0)});
for(const status of ['active','canceled','incomplete','past_due'])test('not actual trial '+status,()=>assert.equal(verify({...trial,subscription:{...trial.subscription,status}},'owner'),null));
test('URL trial hint alone cannot authorize',()=>assert.equal(verify({...trial,subscription:null,metadata:{...trial.metadata,trial_days:'7'}},'owner'),null));
function storage(){const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),snapshot:()=>Object.fromEntries(m)}}
global.window={location:{pathname:'/primarschule-uebungen',search:'?entry=meta_v5_52537884711940'},localStorage:storage(),sessionStorage:storage()};
const ab=load('src/lib/adsAbVariant.ts');
for(const existing of ['control','trial'])test('V5 entry overrides '+existing+' without poisoning storage',()=>{window.localStorage.setItem('cleverli_ads_lp_ab_variant',existing);assert.equal(ab.getAdsLpVariant(),'control');const a=ab.ensureAdsExperimentAttribution('control','primarschule_uebungen');assert.equal(a.experiment,ab.V5_CONTROL_COHORT);assert.equal(a.internalQa,false);assert.equal(a.forcedVariant,false);assert.equal(ab.readStoredAdsLpVariant(),existing);assert.equal(ab.resolveAdsLpTrackingVariant('trial'),'control');const p=new URLSearchParams();ab.appendAdsExperimentAttribution(p,a);assert.deepEqual(ab.parseAdsExperimentAttribution(p),a)});
test('storage denied keeps V5 deterministic cohort',()=>{const ls=window.localStorage,ss=window.sessionStorage;const denied={getItem(){throw Error('denied')},setItem(){throw Error('denied')}};window.localStorage=denied;window.sessionStorage=denied;try {assert.equal(ab.getAdsLpVariant(),'control');const a=ab.ensureAdsExperimentAttribution('control','primarschule_uebungen');assert.equal(a.experiment,ab.V5_CONTROL_COHORT);assert.equal(a.internalQa,false);assert.equal(ab.ensureAdsExperimentAttribution('control','primarschule_uebungen').visitorId,a.visitorId)}finally{window.localStorage=ls;window.sessionStorage=ss}});
test('V5 survives downstream within tab',()=>{window.location={pathname:'/learn/1/math/zahlen-1-10',search:''};assert.equal(ab.readAdsExperimentAttribution().experiment,ab.V5_CONTROL_COHORT)});
test('other campaign trial choice retained',()=>{window.location={pathname:'/primarschule-uebungen',search:'?utm_campaign=other'};assert.equal(ab.getAdsLpVariant(),'trial');assert.equal(ab.ensureAdsExperimentAttribution('trial','primarschule_uebungen').experiment,ab.ADS_LP_EXPERIMENT)});
test('marker does not route other landing pages',()=>{window.location={pathname:'/einmaleins-ueben',search:'?entry=meta_v5_52537884711940'};assert.equal(ab.getAdsLpVariant(),'trial')});
test('existing QA override still works outside V5',()=>{window.location.search='?ab=control';assert.equal(ab.getAdsLpVariant(),'control')});
let meta=[];global.document={querySelector:()=>true,head:{appendChild(){}},createElement:()=>({})};window.dataLayer=[];window.gtag=(...x)=>window.dataLayer.push(x);
const mocks={'@/lib/userActivityClient':{trackUserActivity:()=>Promise.resolve()},'@/lib/attribution':{checkoutAttributionEventParams:()=>({})},'@/lib/adsAbVariant':ab,'@/lib/metaPixel':{trackMetaEvent:(...x)=>meta.push(x)}};
let analytics=load('src/lib/analytics.ts',mocks),o=verify(session,'owner');
test('purchase values and Meta invoice dedup',()=>{analytics.trackVerifiedCheckout(o);assert.equal(window.dataLayer.find(x=>x.event==='purchase').value,9.9);assert.equal(meta[0][2],'purchase_in_fixture123')});
test('same-document dedup',()=>{let n=window.dataLayer.length;analytics.trackVerifiedCheckout(o);assert.equal(window.dataLayer.length,n)});
test('reload crossbrowser replay stable IDs no persistent lost-delivery tombstone',()=>{analytics=load('src/lib/analytics.ts',mocks);analytics.trackVerifiedCheckout(o);let purchases=window.dataLayer.filter(x=>x.event==='purchase');assert.equal(purchases.length,2);assert.equal(purchases[0].transaction_id,purchases[1].transaction_id)});
test('verified trial never purchase or plan revenue',()=>{const n=window.dataLayer.filter(x=>x.event==='purchase').length;analytics.trackVerifiedCheckout(verify(trial,'owner'));assert.equal(window.dataLayer.filter(x=>x.event==='purchase').length,n);assert.equal(window.dataLayer.find(x=>x.event==='trial_started').value,0)});
test('no timestamp fallback/missing-ID event',()=>{const n=window.dataLayer.length;analytics.trackVerifiedCheckout({...o,transactionId:''});assert.equal(window.dataLayer.length,n)});
(async()=>{
const {NextRequest}=require('next/server');let calls=0,authCalls=0,current=clone(session);class StripeMock{constructor(){this.checkout={sessions:{retrieve:async()=>{calls++;return current}}}}};StripeMock.errors={StripeInvalidRequestError:class extends Error{}};
const route=load('src/app/api/checkout/verify/route.ts',{'stripe':StripeMock,'@supabase/supabase-js':{createClient:()=>({auth:{getUser:async t=>{authCalls++;return t==='fixture-auth'?{data:{user:{id:'owner'}}}:{data:{user:null},error:true}}}})},'@/lib/verifiedCheckout':{verifiedCheckoutOutcome:verify}});
async function request(headers={},body={sessionId:session.id}){return route.POST(new NextRequest('http://localhost:3138/api/checkout/verify',{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)}))}
for(const [name,h,status] of [['missing auth',{},401],['crosssite',{authorization:'Bearer fixture-auth',origin:'https://evil.example'},403],['crosssite fetch',{authorization:'Bearer fixture-auth','sec-fetch-site':'cross-site'},403],['invalid auth',{authorization:'Bearer invalid'},401]]){const before=calls;const r=await request(h);assert.equal(r.status,status);assert.equal(calls,before);console.log('PASS',name);count++}
let r=await request({authorization:'Bearer fixture-auth'},{sessionId:''});assert.equal(r.status,400);count++;
r=await request({authorization:'Bearer fixture-auth'});assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/no-store/);const body=await r.text();for(const privateText of ['fixture-auth','owner','metadata','invoice','customer'])assert(!body.includes(privateText));count++;
current={...session,metadata:{...session.metadata,userId:'other'}};r=await request({authorization:'Bearer fixture-auth'});assert.equal(r.status,404);assert.deepEqual(await r.json(),{error:'not_found'});count++;
console.log('PASS total',count,'fixture-only checks');
})().catch(e=>{console.error(e);process.exit(1)});

// Server StartTrial must agree with verified browser trials and not claim plan price as revenue/LTV.
{
 const source = fs.readFileSync('src/app/api/webhooks/stripe/route.ts','utf8');
 const trial = source.slice(source.indexOf('eventName: "StartTrial"'), source.indexOf('console.log(`[stripe-webhook] ✅ Premium activated'));
 assert.ok(trial.includes('value: 0,'));
 assert.ok(!trial.includes('predicted_ltv'));
 assert.ok(trial.includes('eventId: `trial_${session.id}`'));
 assert.ok(source.includes('value: invoice.amount_paid / 100'));
 console.log('PASS: server trial zero-value parity, no invented LTV, stable trial ID and actual invoice value');
}
