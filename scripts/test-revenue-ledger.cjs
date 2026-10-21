const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');let stored=null,fail=false,inserts=0,lookups=0;
const db={from(){return {select(){return this},eq(){return this},maybeSingle:async()=>fail?{error:{}}:{data:stored},upsert:async row=>{if(!stored){stored=row;inserts++;}return {error:null}}}},rpc:async(n,p)=>{assert.equal(n,'refresh_revenue_charge');stored={...stored,refunded:Math.max(stored.refunded,p.p_refunded)};return {error:null}}};
function load(f,mocks){const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,{module:m,exports:m.exports,process,Date,require:n=>n in mocks?mocks[n]:require(n)});return m.exports;}
const policy=load('src/lib/revenueAttribution.ts',{});const ledger=load('src/lib/revenueLedgerServer.ts',{'./revenueAttributionServer':{revenueDb:()=>db},'./revenueAttribution':policy});const list=data=>({data,has_more:false,async *[Symbol.asyncIterator](){yield*data;}});
const meta={site:'cleverli.ch',...policy.revenueMetadata({version:'1',cohort:'outside_experiment',evidence:'no_observed_experiment_at_checkout',captured_at:'2026-10-21T12:00:00Z'})};
const stripe={invoicePayments:{list:async()=>list([])},checkout:{sessions:{list:async()=>{lookups++;return list([{id:'cs_fixture',metadata:meta}])},listLineItems:()=>list([{price:{product:'prod_fixture'}}])}},products:{retrieve:async()=>({name:'Cleverli Premium'})}};
const c={id:'ch_fixture',paid:true,captured:true,status:'succeeded',amount:14900,amount_captured:14900,amount_refunded:0,created:1792580000,currency:'chf',livemode:false,payment_intent:'pi_fixture',customer:'cus_fixture',metadata:{}};
(async()=>{let checks=0;await ledger.recordRevenueCharge(stripe,c);assert.equal(inserts,1);assert.equal(stored.amount,14900);checks+=2;
 await ledger.recordRevenueCharge(stripe,c);assert.equal(inserts,1);assert.equal(lookups,1);checks+=2;
 await ledger.recordRevenueCharge(stripe,{...c,amount_refunded:5000});assert.equal(stored.refunded,5000);checks++;
 await ledger.recordRevenueCharge(stripe,{...c,amount_refunded:3000});assert.equal(stored.refunded,5000);checks++;
 await ledger.recordRevenueCharge(stripe,{...c,amount_refunded:14900});assert.equal(stored.amount-stored.refunded,0);checks++;
 assert.equal(stored.snapshot.cohort,'outside_experiment');checks++;
 await assert.rejects(()=>ledger.recordRevenueCharge(stripe,{...c,amount_captured:10000}),/capture_amount_changed/);checks++;
 fail=true;await assert.rejects(()=>ledger.recordRevenueCharge(stripe,c),/read_failed/);checks++;
 console.log({checks,status:'passed',realRefunds:0});})().catch(e=>{console.error(e);process.exitCode=1});
