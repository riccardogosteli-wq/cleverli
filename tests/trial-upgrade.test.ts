import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TRIAL_UPGRADE as A, scopedTrial, trialEligible, fulfillTrialUpgrade, type TrialOffer, type TrialSubscription, type TrialFulfillment } from '../src/lib/trialUpgrade';
import { checkoutOffer, type OfferSession } from '../src/lib/privateOffer';
import { executeTrialMail, trialMaterial, TRIAL_TEMPLATE, type TrialMailIO } from '../src/lib/trialUpgradeMail';
import { FROM, SUBJECT, TEMPLATE, TEMPLATE_HASH } from '../src/lib/offer219Campaign';
import { digest219, type Receipt } from '../src/lib/offer219Transport';
import { GET, POST } from '../src/app/internal-log-dashboard/trial-upgrade/route';
import { NextRequest } from 'next/server';
import { signInternalSession, INTERNAL_LOG_COOKIE } from '../src/lib/internalDashboardAuth';
const offer = (): TrialOffer => ({ id:A.offerId, user_id:A.userId, customer_id:A.customerId, subscription_id:A.subscriptionId,trial_end:A.trialEnd,
  token_hash:'a'.repeat(64),amount:21900,currency:'chf',deadline:A.trialEnd+7200,generation:1,session_id:'cs_fixture',session_expires:A.trialEnd-600,redeemed_session:null,revoked:false,cancellation_state:null });
const subscription = (): TrialSubscription => ({id:A.subscriptionId,customer:A.customerId,status:'trialing',trial_end:A.trialEnd,cancel_at_period_end:false,cancel_at:null,items:[{amount:990,currency:'chf',interval:'month',quantity:1}]});
const session = (): OfferSession => ({id:'cs_fixture',status:'complete',payment_status:'paid',expires_at:A.trialEnd-600,url:null,customer:A.customerId,amount_total:21900,currency:'chf',mode:'payment',metadata:{userId:A.userId,plan:'schooltime',site:'cleverli.ch',private_offer_id:A.offerId,offer_generation:'1',trial_upgrade_id:A.offerId,trial_subscription_id:A.subscriptionId}});
function fulfillment() {
 const o=offer(),s=session(),sub=subscription();let grants=0,cancels=0,fail=false,confirmFail=false;
 const io:TrialFulfillment={load:async()=>o,session:async()=>s,grant:async()=>{if(o.redeemed_session)return false;grants++;o.redeemed_session=s.id;o.cancellation_state='pending';return true;},subscription:async()=>({...sub}),cancel:async()=>{cancels++;if(fail)throw Error('timeout');sub.status='canceled';},confirmed:async()=>{if(confirmFail)throw Error('db');o.cancellation_state='confirmed';}};
 return {o,s,sub,io,counts:()=>({grants,cancels}),fail:(v:boolean)=>{fail=v;},confirmFail:(v:boolean)=>{confirmFail=v;}};
}
test('only exact approved tuple and live unmodified monthly trial qualifies',()=>{
 assert.ok(scopedTrial(offer()));assert.ok(trialEligible(offer(),subscription(),A.trialEnd-3600));
 for(const field of ['id','user_id','customer_id','subscription_id','trial_end','amount','currency'])assert.equal(scopedTrial({...offer(),[field]:'other'} as TrialOffer),false,field);
 for(const patch of [{id:'other'},{customer:'other'},{status:'active'},{trial_end:A.trialEnd+1},{cancel_at_period_end:true},{cancel_at:A.trialEnd},{items:[]},{items:[{...subscription().items[0],quantity:2}]},{items:[{...subscription().items[0],amount:999}]}])assert.equal(trialEligible(offer(),{...subscription(),...patch},A.trialEnd-3600),false);
 assert.equal(trialEligible(offer(),subscription(),A.trialEnd-600),false);
});
test('paid success commits lifetime before cancellation and retry is idempotent',async()=>{
 const f=fulfillment();const cancel=f.io.cancel;f.io.cancel=async id=>{assert.equal(f.o.cancellation_state,'pending');assert.equal(f.o.redeemed_session,'cs_fixture');await cancel(id);};
 assert.equal(await fulfillTrialUpgrade('cs_fixture',f.io),true);assert.equal(f.o.cancellation_state,'confirmed');
 assert.equal(await fulfillTrialUpgrade('cs_fixture',f.io),false);assert.deepEqual(f.counts(),{grants:1,cancels:1});
});
test('cancellation failure retains lifetime and pending obligation; retry cancels once more without purchase',async()=>{
 const f=fulfillment();f.fail(true);await assert.rejects(fulfillTrialUpgrade('cs_fixture',f.io));assert.equal(f.o.redeemed_session,'cs_fixture');assert.equal(f.o.cancellation_state,'pending');
 f.fail(false);assert.equal(await fulfillTrialUpgrade('cs_fixture',f.io),false);assert.deepEqual(f.counts(),{grants:1,cancels:2});assert.equal(f.o.cancellation_state,'confirmed');
});
test('crash after successful cancellation recovers via retrieve without repeating cancellation',async()=>{
 const f=fulfillment();f.confirmFail(true);await assert.rejects(fulfillTrialUpgrade('cs_fixture',f.io));assert.equal(f.sub.status,'canceled');f.confirmFail(false);await fulfillTrialUpgrade('cs_fixture',f.io);assert.deepEqual(f.counts(),{grants:1,cancels:1});
});
test('unpaid and no-payment-required never grant or cancel',async()=>{
 for(const status of ['unpaid','no_payment_required']){const f=fulfillment();f.s.payment_status=status;await assert.rejects(fulfillTrialUpgrade('cs_fixture',f.io));assert.deepEqual(f.counts(),{grants:0,cancels:0});}
});
test('mismatched session, customer, amount, metadata and expiry fail closed',async()=>{
 for(const patch of [{id:'cs_other'},{customer:'cus_other'},{amount_total:990},{currency:'eur'},{status:'open' as const},{expires_at:A.trialEnd},{metadata:{...session().metadata,trial_subscription_id:'sub_other'}},{metadata:{...session().metadata,trial_upgrade_id:'other'}},{metadata:{...session().metadata,userId:'other'}}]){const f=fulfillment();Object.assign(f.s,patch);await assert.rejects(fulfillTrialUpgrade('cs_fixture',f.io));assert.deepEqual(f.counts(),{grants:0,cancels:0});}
});
test('wrong cancellation target fails after grant without revoking access',async()=>{
 const f=fulfillment();f.sub.customer='other';await assert.rejects(fulfillTrialUpgrade('cs_fixture',f.io));assert.deepEqual(f.counts(),{grants:1,cancels:0});assert.equal(f.o.cancellation_state,'pending');
});
test('delayed paid event after trial end cancels approved active subscription, without refunds or invoices',async()=>{
 const f=fulfillment();f.sub.status='active';await fulfillTrialUpgrade('cs_fixture',f.io);assert.equal(f.sub.status,'canceled');assert.equal(f.o.cancellation_state,'confirmed');
});
test('unconfirmed cancellation stays pending and raises retryable error',async()=>{
 const f=fulfillment();f.io.cancel=async()=>{};await assert.rejects(fulfillTrialUpgrade('cs_fixture',f.io));assert.equal(f.o.cancellation_state,'pending');
});
test('expired/active before Checkout does not return previously created payable URL',async()=>{
 const o=offer();let retrieved=0;await assert.rejects(checkoutOffer(o,{byId:async()=>o,byHash:async()=>o,advance:async()=>o,attach:async()=>{}},{eligible:async()=>false,retrieve:async()=>{retrieved++;return session();},create:async()=>session(),expire:async()=>session(),recover:async()=>null},A.trialEnd));assert.equal(retrieved,0);
});
const raw=JSON.stringify({...Object.fromEntries(Object.entries(A).filter(([k])=>k!=='trialEnd')),token:'b'.repeat(64)});
function mail(){let r:Receipt|null=null,attempts=0;const io:TrialMailIO={status:async()=>r,eligible:async()=>true,reserve:async(_hash,body)=>{if(r)throw Error('reserved');r={recipient:A.email,state:'reserved',provider_id:null,deadline:Math.floor(Date.now()/1000)+259200,claimed_at:new Date(Math.floor(Date.now()/1000)*1000).toISOString(),body_hash:body};return r;},deadline:async()=>r!.deadline,send:async(payload,key)=>{attempts++;assert.equal(payload.from,FROM);assert.equal(payload.subject,SUBJECT);assert.equal(payload.replyTo,'hello@cleverli.ch');assert.equal(payload.to,A.email);assert.equal(payload.html,trialMaterial(raw).html);assert.match(key,/^stephan-trial-lifetime-20260920:/);return 'provider-fixture';},save:async id=>{r={...r!,provider_id:id,state:'accepted'};}};return {io,count:()=>attempts};}
test('exact V3 template and new private path, no original material reuse',()=>{
 assert.equal(digest219(TEMPLATE),TEMPLATE_HASH);assert.equal(TRIAL_TEMPLATE,TEMPLATE.replace('sieben Tage','drei Tage'));assert.equal((TEMPLATE.match(/sieben Tage/g)||[]).length,1);assert.ok(TRIAL_TEMPLATE.includes('drei Tage'));assert.equal(TRIAL_TEMPLATE.includes('sieben Tage'),false);assert.equal(trialMaterial(raw).html,TRIAL_TEMPLATE.replace('__CHECKOUT__','https://www.cleverli.ch/offer/trial-upgrade#'+'b'.repeat(64)));
 for(const patch of [{customerId:'cus_VIOXq9aXmNgCJh'},{offerId:'592407b7-8c6f-4a84-b586-b54ed7114ac4'},{subscriptionId:'other'},{email:'other@example.com'},{extra:true},{token:'invalid'}])assert.throws(()=>trialMaterial(JSON.stringify({...JSON.parse(raw),...patch})));
});
test('mail dry run reveals no token, does not reserve; suppression skips',async()=>{
 const f=mail();assert.equal(JSON.stringify(await executeTrialMail(raw,false,false,f.io)).includes('b'.repeat(64)),false);assert.equal(await f.io.status(),null);assert.equal(f.count(),0);f.io.eligible=async()=>false;assert.equal((await executeTrialMail(raw,true,true,f.io)).skipped,true);assert.equal(await f.io.status(),null);
});
test('mail one send under repetition and concurrent reservation',async()=>{
 const f=mail();await Promise.allSettled([executeTrialMail(raw,true,true,f.io),executeTrialMail(raw,true,true,f.io)]);await executeTrialMail(raw,true,true,f.io);assert.equal(f.count(),1);
});
test('mail uncertain send and failed receipt storage cannot retry',async()=>{
 for(const mode of ['send','save']){const f=mail();let attempts=0;f.io[mode]=async()=>{attempts++;throw Error('timeout');};await assert.rejects(executeTrialMail(raw,true,true,f.io));assert.equal((await executeTrialMail(raw,true,true,f.io)).reconciliationRequired,true);assert.equal(attempts,1);}
});
test('mail nonproduction, deadline mismatch and changed post-reservation eligibility stop dispatch',async()=>{
 const f=mail();await assert.rejects(executeTrialMail(raw,true,false,f.io));assert.equal(await f.io.status(),null);
 f.io.deadline=async()=>0;await assert.rejects(executeTrialMail(raw,true,true,f.io));assert.equal(f.count(),0);assert.ok(await f.io.status());
 const g=mail();let n=0;g.io.eligible=async()=>++n===1;await assert.rejects(executeTrialMail(raw,true,true,g.io));assert.equal(g.count(),0);
});
process.env.INTERNAL_DASHBOARD_SECRET='trial-upgrade-offline-test-only';
function request(form?:FormData,origin='https://www.cleverli.ch',cookie=signInternalSession()){return new NextRequest('https://www.cleverli.ch/internal-log-dashboard/trial-upgrade',{method:form?'POST':'GET',headers:{origin,cookie:`${INTERNAL_LOG_COOKIE}=${cookie}`},...(form?{body:form}:{})});}
test('admin authentication, same origin, recipient and explicit send confirmation',async()=>{
 assert.equal((await GET(request(undefined,undefined,''))).status,401);assert.equal((await GET(request(undefined,undefined,'v1.123.x'))).status,401);
 const form=new FormData();form.set('action','send');form.set('recipient',A.email);
 assert.equal((await POST(request(form,'https://attacker.test'))).status,403);assert.equal((await POST(request(form))).status,400);
 form.set('recipient','other@example.com');assert.equal((await POST(request(form))).status,400);
 form.set('recipient',A.email);form.set('action','delete');assert.equal((await POST(request(form))).status,400);
});
test('admin preview HTML scope is one recipient with approved three-day V3; reconcile protected',async()=>{
 const r=await GET(request());assert.equal(r.status,200);assert.equal(r.headers.get('Referrer-Policy'),'same-origin');const html=await r.text();assert.match(html,/Stephan/);assert.match(html,/drei Tage/);assert.equal(html.includes('sieben Tage'),false);assert.equal(html.includes('aysekayagaziantep'),false);
 const f=new FormData();f.set('recipient',A.email);f.set('action','reconcile');assert.equal((await POST(request(f))).status,403);
 f.append('recipient',A.email);assert.equal((await POST(request(f))).status,400);
});
test('admin rejects oversized bytes and foreign fields without provider calls',async()=>{
 const r=new NextRequest('https://www.cleverli.ch/internal-log-dashboard/trial-upgrade',{method:'POST',headers:{origin:'https://www.cleverli.ch',cookie:`${INTERNAL_LOG_COOKIE}=${signInternalSession()}`,'content-type':'multipart/form-data; boundary=test'},body:'x'.repeat(31000)});assert.equal((await POST(r)).status,413);
 const f=new FormData();f.set('action','preview');f.set('recipient',A.email);f.set('extra','1');assert.equal((await POST(request(f))).status,400);
});
test('webhook subscription update/delete, invoice and late checkout use guard; paid trial fulfillment precedes duplicate early return',()=>{
 const s=readFileSync('src/app/api/webhooks/stripe/route.ts','utf8');
 assert.match(s,/async function syncSubscription[\s\S]*?if \(await settledTrialSubscription\(subscription.id\)\) return null/);
 assert.match(s,/stripeSubscriptionId = session.subscription as string;\s*if \(await settledTrialSubscription/);
 assert.match(s,/session.metadata\?\.trial_upgrade_id\s*\? await redeemTrialUpgrade\(session.id\)/);
 assert.ok(s.indexOf('await redeemTrialUpgrade(session.id)')<s.indexOf('if (!firstRedemption)'));
 const server=readFileSync('src/lib/trialUpgradeServer.ts','utf8');assert.match(server,/subscriptions.cancel\(id, \{ invoice_now: false, prorate: false \}\)/);
 assert.equal(server.includes('refunds.create'),false);assert.equal(server.includes('invoices.pay'),false);
});

import { threeDayTrialWindow } from '../src/lib/trialUpgrade';
import { trialUpgradeServices, warmTrialUpgrade } from '../src/lib/trialUpgradeServer';
test('approved three-day window fits now but future insufficient window fails closed',async()=>{
 assert.equal(threeDayTrialWindow(A.trialEnd-259200-600),true);assert.equal(threeDayTrialWindow(A.trialEnd-259200),false);assert.equal(threeDayTrialWindow(A.trialEnd-259200-601),true);assert.equal(threeDayTrialWindow(A.trialEnd-259200-599),false);
 const f=new FormData();f.set('recipient',A.email);f.set('action','send');f.set('confirmed','yes');
 const originalNow=Date.now;try { Date.now=()=> (A.trialEnd-259200)*1000;const r=await POST(request(f));assert.equal(r.status,409);assert.equal((await r.json()).error,'three_day_trial_window_requires_review');}finally{Date.now=originalNow;}
});
function adapter(change='') {
 const o=offer();o.session_id=null;o.session_expires=null;o.generation=0;
 const profile={email:A.email,premium:true,premium_plan:'monthly',stripe_customer_id:A.customerId,stripe_subscription_id:A.subscriptionId};
 const customer={id:A.customerId,email:A.email,deleted:false};
 const sub={id:A.subscriptionId,customer:A.customerId,status:'trialing',trial_end:A.trialEnd,cancel_at_period_end:false,cancel_at:null,items:{data:[{quantity:1,price:{unit_amount:990,currency:'chf',recurring:{interval:'month'}}}]}};
 if(change==='profile')profile.stripe_subscription_id='other';
 if(change==='active')sub.status='active';
 if(change==='auth')profile.email='other@example.test';
 if(change==='customer')customer.email='other@example.test';
 let created=0;let capped=0;
 const db={from:()=>({select:()=>({eq:()=>({single:async()=>({data:profile,error:null})})})}),auth:{admin:{getUserById:async()=>({data:{user:{email:A.email}},error:null})}},rpc:async(_name:string,args:{p_expires:number})=>{capped=args.p_expires;return {data:{...o,session_expires:capped,generation:1},error:null};}};
 const stripe={customers:{retrieve:async()=>customer,list:async()=>({data:[customer,{id:'cus_second',email:A.email}],has_more:false})},subscriptions:{retrieve:async()=>sub,list:async({customer:c}:{customer:string})=>({data:c===A.customerId?[sub]:(change==='other-sub'?[{id:'other',status:'active'}]:[]),has_more:false})},charges:{list:async()=>({data:change==='charge'?[{paid:true,amount:990}]:[],has_more:false})},invoices:{list:async()=>({data:change==='invoice'?[{amount_paid:0,amount_remaining:990}]:[],has_more:false})},paymentIntents:{list:async()=>({data:change==='pending-payment'?[{status:'processing'}]:[],has_more:false})},checkout:{sessions:{create:async(params:Record<string,unknown>,options:Record<string,unknown>)=>{created++;assert.deepEqual(params.payment_method_types,['card','twint']);assert.equal(params.mode,'payment');assert.equal(params.customer,A.customerId);assert.match(String(options.idempotencyKey),/^trial-upgrade:/);return {...session(),status:'open',url:'https://checkout.stripe.com/fixture'};}}}};
 const svc=trialUpgradeServices({db,stripe} as unknown as NonNullable<Parameters<typeof trialUpgradeServices>[0]>, () => A.trialEnd-3600);
 return {...svc,o,created:()=>created,capped:()=>capped};
}
test('adapter rejects changed profile/auth/customer, active trial, second customer billing and pending payments',async()=>{
 assert.equal(await adapter().gateway.eligible(offer()),true);
 for(const change of ['profile','active','auth','customer','other-sub','charge','invoice','pending-payment'])assert.equal(await adapter(change).gateway.eligible(offer()),false,change);
});
test('adapter caps expiry before trial end and rechecks live trial before creating a session',async()=>{
 const a=adapter();await a.store.advance(A.offerId,0,A.trialEnd+7200);assert.equal(a.capped(),A.trialEnd-600);
 const bad=adapter('active');await assert.rejects(bad.gateway.create(offer()));assert.equal(bad.created(),0);
 await a.gateway.create(offer());assert.equal(a.created(),1);
});

test('cron runs existing offer preparation independently of trial cancellation failure',()=>{
 const source=readFileSync('src/app/api/cron/private-offers/route.ts','utf8');
 assert.match(source,/Promise.allSettled\(\[reconcileTrialUpgrade\(\), warmPrivateOffers\(\), warmTrialUpgrade\(\)\]\)/);
 assert.match(source,/timingSafeEqual/);
});
test('concurrent paid deliveries grant once; cancellation races converge on confirmed without recharging',async()=>{
 const f=fulfillment();const cancel=f.io.cancel;
 f.io.cancel=async id=>{if(f.sub.status==='canceled')throw Error('already_canceled_race');await cancel(id);};
 await Promise.allSettled([fulfillTrialUpgrade('cs_fixture',f.io),fulfillTrialUpgrade('cs_fixture',f.io)]);
 await fulfillTrialUpgrade('cs_fixture',f.io);
 assert.equal(f.counts().grants,1);assert.equal(f.o.cancellation_state,'confirmed');assert.equal(f.sub.status,'canceled');
});

test('dedicated final session is prepared through the full three-day deadline',async()=>{
 const now=A.trialEnd-259200-3600;const o=offer();o.deadline=now+7200;o.session_expires=now+3600;
 let prepared=0,expired=0;
 const io={store:{byId:async()=>o,byHash:async()=>o,advance:async(_id:string,_gen:number,expires:number)=>{o.generation++;o.session_id=null;o.session_expires=expires;return o;},attach:async(_id:string,_gen:number,id:string)=>{o.session_id=id;}},gateway:{eligible:async()=>true,recover:async()=>null,retrieve:async()=>({...session(),status:'open' as const,payment_status:'unpaid',expires_at:o.session_expires!,metadata:{...session().metadata,offer_generation:String(o.generation)},url:'https://checkout.stripe.com/fixture'}),expire:async()=>{expired++;return {...session(),status:'expired' as const};},create:async()=>{prepared++;return {...session(),status:'open' as const,payment_status:'unpaid',expires_at:o.session_expires!,metadata:{...session().metadata,offer_generation:String(o.generation)},url:'https://checkout.stripe.com/fixture'};}}};
 assert.deepEqual(await warmTrialUpgrade(now,io,async()=>false),{prepared:false});assert.equal(prepared,0);assert.equal(expired,0);
 assert.deepEqual(await warmTrialUpgrade(now,io,async()=>true),{prepared:true});assert.equal(o.session_expires,o.deadline);assert.equal(expired,1);assert.equal(prepared,1);
 o.redeemed_session='cs_fixture';assert.deepEqual(await warmTrialUpgrade(now,io,async()=>true),{prepared:false});assert.equal(prepared,1);
});

test('mail blocks stale seven-day SQL duration before provider dispatch',async()=>{
 const f=mail();const reserve=f.io.reserve;f.io.reserve=async(hash,body)=>({...await reserve(hash,body),deadline:Math.floor(Date.now()/1000)+604800});
 await assert.rejects(executeTrialMail(raw,true,true,f.io),/reservation_duration_mismatch/);assert.equal(f.count(),0);assert.ok(await f.io.status());
});
