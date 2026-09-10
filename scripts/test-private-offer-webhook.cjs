const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('src/app/api/webhooks/stripe/route.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
async function run({status='paid',privateOffer=false,eventType='checkout.session.completed',duplicate=false,retrievedStatus=status,fail=false,mode='payment',trial=false}={}) {
  const calls={patch:0,redeem:0,email:0,activity:0,meta:0};
  const session={id:'fake-session',mode,payment_status:status,metadata:{userId:'fake-user',plan:mode==='subscription'?'yearly':'schooltime',...(privateOffer?{private_offer_id:'fake-offer'}:{}),...(trial?{trial_days:'7'}:{})},customer:'cus_fake',customer_details:{email:'fixture@example.invalid'},amount_total:19900,currency:'chf',subscription:'fake-sub'};
  class Stripe { constructor(){this.webhooks={constructEvent:()=>({type:eventType,data:{object:session}})};this.checkout={sessions:{retrieve:async()=>({...session,payment_status:retrievedStatus})}};this.subscriptions={retrieve:async()=>({id:'fake-sub',items:{data:[{current_period_end:2000000000}]}})};} }
  const next={NextResponse:{json:(body,init={})=>({body,status:init.status||200})}};
  const module={exports:{}};
  const requireStub=(name)=>{
    if(name==='stripe')return {default:Stripe};
    if(name==='next/server')return next;
    if(name==='@sentry/nextjs')return {captureException(){},captureMessage(){}};
    if(name==='@/lib/privateOfferServer')return {redeemPrivateOffer:async()=>{calls.redeem++;if(fail)throw Error('fixture');return !duplicate;}};
    if(name==='@/lib/email')return {sendAdminPaymentNotificationEmail:async()=>{calls.email++;},sendPaymentConfirmationEmail:async()=>{calls.email++;}};
    if(name==='@/lib/userActivityServer')return {logUserActivity:async()=>{calls.activity++;}};
    if(name==='@/lib/metaConversions')return {sendMetaConversion:async()=>{calls.meta++;}};
    throw Error('Unexpected import '+name);
  };
  vm.runInNewContext(code,{module,exports:module.exports,require:requireStub,process:{env:{STRIPE_WEBHOOK_SECRET:'fake-test-only'}},console:{log(){},error(){}},fetch:async()=>{calls.patch++;return {ok:true};}});
  const result=await module.exports.POST({text:async()=>'',headers:{get:()=> 'fake-signature-test-stub'}});
  return {result,calls};
}
(async()=>{let checks=0;
  for(const privateOffer of [false,true])for(const status of ['unpaid','no_payment_required']){
    const r=await run({privateOffer,status});assert.equal(r.result.status,200);assert.deepEqual(r.calls,{patch:0,redeem:0,email:0,activity:0,meta:0});checks++;
  }
  const paid=await run();assert.equal(paid.calls.patch,1);assert.equal(paid.calls.email,2);checks++;
  const personal=await run({privateOffer:true});assert.equal(personal.calls.redeem,1);assert.equal(personal.calls.patch,0);assert.equal(personal.calls.email,2);checks++;
  const duplicate=await run({privateOffer:true,duplicate:true});assert.equal(duplicate.calls.email,0);assert.equal(duplicate.calls.activity,0);checks++;
  const stale=await run({privateOffer:true,retrievedStatus:'unpaid'});assert.equal(stale.result.status,409);assert.equal(stale.calls.redeem,0);checks++;
  const failed=await run({privateOffer:true,fail:true});assert.equal(failed.result.status,500);assert.equal(failed.calls.email,0);checks++;
  const asyncPaid=await run({privateOffer:true,eventType:'checkout.session.async_payment_succeeded'});assert.equal(asyncPaid.calls.redeem,1);checks++;
  const asyncUnpaid=await run({privateOffer:true,eventType:'checkout.session.async_payment_succeeded',status:'unpaid'});assert.equal(asyncUnpaid.calls.redeem,0);checks++;
  const trial=await run({mode:'subscription',status:'unpaid',trial:true});assert.equal(trial.calls.patch,1);assert.equal(trial.calls.email,0);checks++;
  console.log(`Actual webhook handler: ${checks} scenarios passed with mocked services/signature boundary; zero real events or production writes.`);
})().catch(e=>{console.error('Webhook test failed:',e.message);process.exitCode=1;});
