import test from 'node:test';
import assert from 'node:assert/strict';
import { RECIPIENTS, TEMPLATE, TEMPLATE_HASH, SUBJECT } from '../src/lib/offer219Campaign';
import { execute219, digest219, pages219, material219, type Transport219, type Receipt } from '../src/lib/offer219Transport';
import { NextRequest } from 'next/server';
import { GET, POST } from '../src/app/internal-log-dashboard/offer219/route';
import { signInternalSession, INTERNAL_LOG_COOKIE } from '../src/lib/internalDashboardAuth';
const raw = JSON.stringify(RECIPIENTS.map(r => ({ ...r, token: 'a'.repeat(64), deadline: 0, sessionId: 'fixture' })));
const email = RECIPIENTS[0].email;
function fake() {
  let receipt: Receipt | null = null; let sent = 0; let allowed = true;
  const io: Transport219 = {
    async status() { return receipt; }, async eligible() { return allowed; },
    async reserve(r, _hash, bodyHash) { if (receipt) throw Error('reserved'); receipt = { recipient: r.email, state: 'reserved', provider_id: null, claimed_at: new Date().toISOString(), deadline: Math.floor(Date.now()/1000)+604800, body_hash: bodyHash }; return receipt; },
    async readDeadline() { return receipt!.deadline; },
    async send(payload, key) { assert.equal(payload.subject,SUBJECT); assert.equal(payload.replyTo,'hello@cleverli.ch'); assert.match(key,/^offer219-v3-20260920:/); sent++; return 'provider-fixture'; },
    async save(_email,id) { receipt = { ...receipt!, provider_id:id, state:'accepted' }; },
  };
  return { io, count: () => sent, suppress: () => { allowed = false; } };
}
test('approved template hash and strict material', () => {
  assert.equal(digest219(TEMPLATE),TEMPLATE_HASH); assert.equal(RECIPIENTS.length,20);
  assert.throws(() => material219(raw,'attacker@example.com'));
  assert.throws(() => material219(raw.replace(RECIPIENTS[0].offerId,'invalid'),email));
  assert.throws(() => material219(JSON.stringify(JSON.parse(raw).slice(1)),email));
  assert.throws(() => material219(raw.replace('"token":','"extra":true,"token":'),email));
});
test('dry run never reserves/sends or returns capability', async () => {
  const f=fake(); const result=await execute219(raw,email,false,false,f.io);
  assert.equal(f.count(),0); assert.equal(await f.io.status(email),null);
  assert.equal(JSON.stringify(result).includes('a'.repeat(64)),false);
});
test('one success, repeat returns stored receipt without retry', async () => {
  const f=fake(); await execute219(raw,email,true,true,f.io); await execute219(raw,email,true,true,f.io); assert.equal(f.count(),1);
});
test('concurrent reservation sends once', async () => {
  const f=fake(); await Promise.allSettled([execute219(raw,email,true,true,f.io),execute219(raw,email,true,true,f.io)]); assert.equal(f.count(),1);
});
test('changed or suppressed recipient skipped', async () => {
  const f=fake(); f.suppress(); assert.equal((await execute219(raw,email,true,true,f.io)).skipped,true); assert.equal(f.count(),0); assert.equal(await f.io.status(email),null);
});
test('non-production fails before reservation', async () => {
  const f=fake(); await assert.rejects(execute219(raw,email,true,false,f.io)); assert.equal(await f.io.status(email),null);
});
test('provider timeout never retries even without receipt', async () => {
  const f=fake(); let attempts=0; f.io.send=async()=>{attempts++;throw Error('timeout');};
  await assert.rejects(execute219(raw,email,true,true,f.io));
  assert.equal((await execute219(raw,email,true,true,f.io)).reconciliationRequired,true); assert.equal(attempts,1);
});
test('receipt persistence failure never retries', async () => {
  const f=fake(); f.io.save=async()=>{throw Error('db failure');};
  await assert.rejects(execute219(raw,email,true,true,f.io)); await execute219(raw,email,true,true,f.io); assert.equal(f.count(),1);
});
test('deadline readback mismatch blocks send after irreversible reservation', async () => {
  const f=fake(); f.io.readDeadline=async()=>0; await assert.rejects(execute219(raw,email,true,true,f.io)); assert.equal(f.count(),0); assert.ok(await f.io.status(email));
});
test('fresh eligibility failure after reservation blocks send', async () => {
  const f=fake(); let calls=0; f.io.eligible=async()=>++calls===1; await assert.rejects(execute219(raw,email,true,true,f.io)); assert.equal(f.count(),0);
});
test('pagination traverses later suppression/contact/payment pages, fails closed', async () => {
  const seen=await pages219(async after=>({data:[{id:after?'blocked':'first'}],has_more:!after})); assert.equal(seen[1].id,'blocked');
  await assert.rejects(pages219(async()=>({data:[],has_more:true})));
  await assert.rejects(pages219(async()=>({data:[{id:'same'}],has_more:true})));
});
process.env.INTERNAL_DASHBOARD_SECRET='isolated-test-secret-not-production';
function request(form?: FormData, origin='https://www.cleverli.ch', cookie=signInternalSession()) {
  return new NextRequest('https://www.cleverli.ch/internal-log-dashboard/offer219',{method:form?'POST':'GET',headers:{origin,cookie:`${INTERNAL_LOG_COOKIE}=${cookie}`},...(form?{body:form}:{})});
}
test('route rejects unauthenticated and malformed cookies', async () => {
  assert.equal((await GET(request(undefined,undefined,''))).status,401);
  assert.equal((await GET(request(undefined,undefined,'v1.123.x'))).status,401);
});
test('authenticated UI has preview and one-recipient send; no capability',async()=>{
  const response=await GET(request()); assert.equal(response.status,200); assert.equal(response.headers.get('Referrer-Policy'),'same-origin'); const html=await response.text(); assert.match(html,/Genau eine E-Mail senden/); assert.equal(html.includes('a'.repeat(64)),false);
});
test('route rejects cross-origin, unknown recipients/actions and missing confirmation',async()=>{
  const form=new FormData(); form.set('action','send'); form.set('recipient',email);
  assert.equal((await POST(request(form,'https://attacker.example'))).status,403);
  assert.equal((await POST(request(form))).status,400);
  form.set('action','arbitrary'); assert.equal((await POST(request(form))).status,400);
  form.set('action','preview'); form.set('recipient','attacker@example.com'); assert.equal((await POST(request(form))).status,400);
});
test('route rejects duplicate fields and actual oversize bytes',async()=>{
  const form=new FormData(); form.append('recipient',email); form.append('recipient',email); form.set('action','preview');
  assert.equal((await POST(request(form))).status,400);
  const large=new NextRequest('https://www.cleverli.ch/internal-log-dashboard/offer219',{method:'POST',headers:{origin:'https://www.cleverli.ch',cookie:`${INTERNAL_LOG_COOKIE}=${signInternalSession()}`,'content-type':'multipart/form-data; boundary=fixture'},body:'x'.repeat(31000)}); assert.equal((await POST(large)).status,413);
});

import { services219 } from '../src/lib/offer219Server';
function eligibilityFixture(change: string = '') {
 const r=RECIPIENTS[0];
 const empty=async()=>({data:[],has_more:false});
 const later=(record: object)=>async (p:{starting_after?:string;after?:string})=>p.starting_after||p.after?{data:[{id:'later',...record}],has_more:false}:{data:[{id:'first'}],has_more:true};
 const providerPage=(load: ReturnType<typeof later>)=>async(p:{after?:string})=>({data:await load(p),error:null});
 const query={select(){return this;},eq(){return this;},async single(){return {data:{email:r.email,premium:change==='premium',stripe_customer_id:change==='null_customer'?null:change==='conflicting_customer'?'cus_other':r.customerId,stripe_subscription_id:null},error:null};},async maybeSingle(){return {data:null,error:null};}};
 const deps={services:{db:{from:()=>query,auth:{admin:{getUserById:async()=>({data:{user:{email:change==='email'?'changed@example.com':r.email}},error:null})}}},store:{byId:async()=>({id:r.offerId,user_id:r.userId,customer_id:r.customerId,token_hash:digest219('a'.repeat(64)),amount:21900,currency:'chf',revoked:false,redeemed_session:null})},stripe:{customers:{retrieve:async()=>({id:r.customerId,email:r.email}),list:async()=>({data:[{id:r.customerId}],has_more:false})},subscriptions:{list:change==='subscription'?later({status:'active'}):empty},charges:{list:change==='charge'?later({paid:true,amount:21900}):empty},invoices:{list:change==='invoice'?later({status:'paid',amount_paid:9900}):empty},paymentIntents:{list:change==='payment'?later({status:'succeeded',amount:21900}):empty}}},provider:{suppressions:{list:change==='suppressed'?providerPage(later({email:r.email})):async()=>({data:await empty(),error:null})},contacts:{list:change==='unsubscribed'?providerPage(later({email:r.email,unsubscribed:true})):change==='provider_error'?async()=>({data:null,error:{message:'failed'}}):async()=>({data:await empty(),error:null})}},pace:async()=>{}};
 return services219(deps as unknown as NonNullable<Parameters<typeof services219>[0]>);
}
test('fresh production eligibility succeeds with mocked complete providers',async()=>{
 assert.equal(await eligibilityFixture().io.eligible(RECIPIENTS[0],digest219('a'.repeat(64))),true);
});
for(const changed of ['premium','email','subscription','charge','invoice','payment','suppressed','unsubscribed']) test(`fresh eligibility rejects ${changed}, including later pages`,async()=>{
 assert.equal(await eligibilityFixture(changed).io.eligible(RECIPIENTS[0],digest219('a'.repeat(64))),false);
});
test('provider read failure fails closed',async()=>{
 await assert.rejects(eligibilityFixture('provider_error').io.eligible(RECIPIENTS[0],digest219('a'.repeat(64))));
});
test('offer token hash mismatch fails eligibility',async()=>{
 assert.equal(await eligibilityFixture().io.eligible(RECIPIENTS[0],'wrong'),false);
});
for (const event of ['sent','delivered','bounced','complained']) test(`read-only receipt verification distinguishes ${event}`,async()=>{
 const query={select(){return this;},eq(){return this;},async maybeSingle(){return {data:{provider_id:'receipt'},error:null};}};
 const provider={emails:{get:async()=>({data:{id:'receipt',to:[email],subject:SUBJECT,from:'Cleverli <hello@cleverli.ch>',last_event:event,created_at:'2026-09-20T18:00:00Z'},error:null})}};
 const deps={services:{db:{from:()=>query}},provider,pace:async()=>{}};
 const result=await services219(deps as unknown as NonNullable<Parameters<typeof services219>[0]>).verify(RECIPIENTS[0]);
 assert.equal(result.readOnly,true); assert.equal(result.matches[0].delivered,event==='delivered'); assert.equal(result.matches[0].bounced,event==='bounced'); assert.equal(result.matches[0].event,event);
});
test('reconciliation paginates subject/recipient and never authorizes retry',async()=>{
 const query={select(){return this;},eq(){return this;},async maybeSingle(){return {data:{provider_id:null,state:'reserved'},error:null};}};
 let pages=0;
 const provider={emails:{list:async({after}:{after?:string})=>{pages++;return {data:{data:[{id:after?'match':'other',to:[after?email:'other@example.com'],subject:SUBJECT,from:'Cleverli <hello@cleverli.ch>',last_event:'delivered',created_at:'2026-09-20T18:00:00Z'}],has_more:!after},error:null};}}};
 const deps={services:{db:{from:()=>query}},provider,pace:async()=>{}};
 const result=await services219(deps as unknown as NonNullable<Parameters<typeof services219>[0]>).verify(RECIPIENTS[0]);
 assert.equal(pages,2); assert.equal(result.matches.length,1); assert.equal(result.absenceDoesNotAuthorizeRetry,true);
});

test("missing legacy customer pointer allows verified offer/account/email binding",async()=>{assert.equal(await eligibilityFixture("null_customer").io.eligible(RECIPIENTS[0],digest219("a".repeat(64))),true);});
test("conflicting stored customer pointer stays rejected",async()=>{assert.equal(await eligibilityFixture("conflicting_customer").io.eligible(RECIPIENTS[0],digest219("a".repeat(64))),false);});
