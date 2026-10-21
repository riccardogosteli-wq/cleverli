const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict'),path=require('path');
let checks=0;const check=(a,b)=>{assert.deepEqual(a,b);checks++;};
const cache={};const overrides={};
function load(file){file=path.resolve(file);if(cache[file])return cache[file].exports;const m={exports:{}};cache[file]=m;const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{module:m,exports:m.exports,process,Buffer,URLSearchParams,Date,console,require:n=>overrides[n]||(n.startsWith('.')?load(path.resolve(path.dirname(file),n+'.ts')):require(n))},{filename:file});return m.exports;}
(async()=>{
 const p=load('src/lib/revenueAttribution.ts');const a={experiment:'ads_lp_7_day_trial',variant:'control',visitorId:'qa-visitor-1234',page:'primarschule',internalQa:false,forcedVariant:false};
 for(const variant of ['control','trial']){const s=p.exposureSnapshot({...a,variant},'fixture');check(s.cohort,'randomized_'+variant);check(JSON.parse(JSON.stringify(p.snapshotFromMetadata(p.revenueMetadata(s)))),JSON.parse(JSON.stringify({...s,checkout_context:'',checkout_cohort:s.cohort})));}
 check(p.exposureSnapshot({...a,experiment:'meta_v5_deterministic_control'},'test').cohort,'fixed_meta_control');
 check(p.exposureSnapshot({...a,experiment:'meta_v5_deterministic_control',variant:'trial'},'test'),null);
 for(const k of ['internalQa','forcedVariant'])check(p.exposureSnapshot({...a,[k]:true},'test').cohort,'qa');
 check(p.exposureSnapshot({...a,visitorId:'bad'},'test'),null);check(p.exposureSnapshot(null,'test'),null);
 check(p.snapshotFromMetadata({trial_days:'7'}).cohort,'legacy_unattributed');
 check(p.snapshotFromMetadata({revenue_attribution_v:'1',revenue_cohort:'randomized_trial'}).cohort,'legacy_unattributed');
 process.env.STRIPE_WEBHOOK_SECRET='local-fixture-only';
 const server=load('src/lib/revenueAttributionServer.ts');const snap=p.exposureSnapshot(a,'fixture');const signed=server.signRevenueCookie(snap);
 check(server.readRevenueCookie(signed).cohort,'randomized_control');check(server.readRevenueCookie(signed+'tampered'),null);
 check(server.readRevenueCookie(server.signRevenueCookie({...snap,captured_at:'2020-01-01T00:00:00Z'})),null);
 const ledger=load('src/lib/revenueLedgerServer.ts');
 const c={id:'ch_fixture',paid:true,captured:true,status:'succeeded',amount:990,amount_captured:990,amount_refunded:0,created:1792580000,currency:'chf',livemode:false,payment_intent:'pi_fixture',customer:'cus_fixture',metadata:{}};
 check(ledger.collectedCharge(c),true);for(const x of [{paid:false},{captured:false},{status:'failed'},{amount_captured:0}])check(ledger.collectedCharge({...c,...x}),false);
 const list=data=>({data,has_more:false,async *[Symbol.asyncIterator](){yield*data;}});
 const md={site:'cleverli.ch',userId:'11111111-1111-4111-8111-111111111111',...p.revenueMetadata(snap)};
 const stripe={invoicePayments:{list:async()=>list([])},checkout:{sessions:{list:async()=>list([{id:'cs_fixture',metadata:md}]),listLineItems:()=>list([{price:{product:'prod_fixture'}}])}},products:{retrieve:async()=>({name:'Cleverli Premium'})}};
 let result=await ledger.resolveRevenueCharge(stripe,c);check(result.kind,'cleverli');check(result.row.amount,990);check(result.row.snapshot.cohort,'randomized_control');check(result.row.session_id,'cs_fixture');
 result=await ledger.resolveRevenueCharge(stripe,{...c,amount_refunded:400});check(result.row.refunded,400);
 stripe.products.retrieve=async()=>({name:'Other shared Stripe product'});check((await ledger.resolveRevenueCharge(stripe,c)).kind,'other_product');
 stripe.products.retrieve=async()=>({name:'Cleverli archived product',active:false});check((await ledger.resolveRevenueCharge(stripe,c)).kind,'cleverli');
 const invoice={id:'in_fixture',parent:{subscription_details:{subscription:'sub_fixture',metadata:md}}};
 stripe.invoicePayments.list=async()=>list([{invoice:'in_fixture'}]);stripe.invoices={retrieve:async()=>invoice,listLineItems:()=>list([{pricing:{price_details:{product:'prod_fixture'}}}])};
 stripe.subscriptions={retrieve:async()=>({id:'sub_fixture',metadata:{...md,revenue_cohort:'randomized_trial',revenue_variant:'trial'}})};
 result=await ledger.resolveRevenueCharge(stripe,c);check(result.row.snapshot.cohort,'randomized_control');check(result.row.invoice_id,'in_fixture');check(result.row.subscription_id,'sub_fixture');
 invoice.parent.subscription_details.metadata={site:'cleverli.ch'};check((await ledger.resolveRevenueCharge(stripe,c)).row.snapshot.cohort,'legacy_unattributed');
 stripe.invoicePayments.list=async()=>({data:[{invoice:'in_a'},{invoice:'in_b'}],has_more:false});await assert.rejects(()=>ledger.resolveRevenueCharge(stripe,c),/ambiguous/);checks++;
 console.log(JSON.stringify({checks,status:'passed',realPayments:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
