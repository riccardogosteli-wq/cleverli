/* eslint-disable @typescript-eslint/no-require-imports -- Offline VM adapter tests. */
const { test } = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript');
function load(file, mocks = {}, env = {}, globals = {}) {
  const mod = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require: name => name in mocks ? mocks[name] : require(name), Date, Set, Intl, console, Buffer, setTimeout, process: { env }, ...globals });
  return mod.exports;
}
const billing = load('src/lib/accountBilling.ts');
const policy = load('src/lib/cancellationEmail.ts', { './accountBilling': billing });
const now = Math.floor(Date.now()/1000), end = now + 604800, endAt = new Date(end*1000).toISOString();
const userId = '00000000-0000-4000-8000-000000000019';
const sub = (extra = {}) => ({ id:'sub_fixture', customer:'cus_fixture', metadata:{site:'cleverli.ch',plan:'monthly',userId}, canceled_at:now, cancel_at_period_end:true, cancel_at:end, status:'active', items:{data:[{current_period_end:end,price:{id:'price_1TEQiwDGUBi3vyUQcMa6mD3P',currency:'chf',recurring:{interval:'month'},product:'prod_fixture'}}]}, ...extra });
const event = (extra = {}) => ({ id:'evt_fixture',created:now,livemode:true,type:'customer.subscription.updated',data:{object:sub(),previous_attributes:{cancel_at_period_end:false}},...extra });
test('only new scheduled cancellation transition is admitted', () => assert.ok(policy.cancellationTransition(event(), now-10)));
for (const [name, ev] of [
 ['test-mode event',event({livemode:false})], ['old event',event({created:now-100})], ['old cancellation',event({data:{object:sub({canceled_at:now-100}),previous_attributes:{cancel_at_period_end:false}}})],
 ['deleted/lifetime upgrade',event({type:'customer.subscription.deleted'})], ['immediate cancellation',event({data:{object:sub({status:'canceled'}),previous_attributes:{cancel_at_period_end:false}}})],
 ['no transition',event({data:{object:sub(),previous_attributes:{metadata:{}}}})],
 ['unrelated site',event({data:{object:sub({metadata:{site:'other.example',plan:'monthly',userId}}),previous_attributes:{cancel_at_period_end:false}}})],
 ['lifetime plan',event({data:{object:sub({metadata:{site:'cleverli.ch',plan:'schooltime',userId}}),previous_attributes:{cancel_at_period_end:false}}})],
 ['upgrade marker',event({data:{object:sub({metadata:{site:'cleverli.ch',plan:'monthly',userId,trial_upgrade_id:'fixture'}}),previous_attributes:{cancel_at_period_end:false}}})],
]) test(`rejects ${name}`,()=>assert.equal(policy.cancellationTransition(ev,now-10),null));
test('scheduled explicit cancel_at transition supported',()=>assert.ok(policy.cancellationTransition(event({data:{object:sub({cancel_at_period_end:false}),previous_attributes:{cancel_at:null}}}),now-10)));
test('reactivated subscription cannot confirm mail',()=>assert.equal(policy.confirmedMailSubscription(sub({cancel_at_period_end:false,cancel_at:null}),now),null));
test('different cancellation cycle cannot confirm mail',()=>assert.equal(policy.confirmedMailSubscription(sub({canceled_at:now+1}),now),null));
test('unknown end cannot confirm mail',()=>assert.equal(policy.confirmedMailSubscription(sub({cancel_at:null,items:{data:[]}}),now),null));
for(const lang of ['de','fr','it','en']) test(`warm exact-date copy and fixed sender ${lang}`,()=>{
 const payload=policy.cancellationEmail('fixture@example.invalid',endAt,lang,true);
 assert.equal(payload.from,'Cleverli <hello@cleverli.ch>');assert.equal(payload.replyTo,'hello@cleverli.ch');assert.match(payload.text,/Europe\/Zurich/);
 assert.match(payload.text,/Rechnungen|factures|fatture|invoices/);assert.ok(!/ß|Keine weiteren Abbuchungen|No further charges|TEST|Testkonto|Postadresse/.test(payload.html));
 assert.ok(payload.html.includes('https://www.cleverli.ch/account'));assert.ok(payload.text.includes('hello@cleverli.ch'));
});
test('unpaid email does not promise active Premium',()=>{const p=policy.cancellationEmail('fixture@example.invalid',endAt,'de',false);assert.match(p.text,/Premium ist derzeit nicht aktiv/);assert.ok(!p.text.includes('Premium-Zugang bleibt bis'));});
test('invalid recipient rejected',()=>assert.throws(()=>policy.cancellationEmail('bad\nrecipient',endAt,'de',true)));
function row(extra={}) {return {id:'outbox-fixture',user_id:userId,subscription_id:'sub_fixture',customer_id:'cus_fixture',cancelled_at:now,ready_at:new Date().toISOString(),end_at:endAt,access_active:true,payload:policy.cancellationEmail('fixture@example.invalid',endAt,'de',true),state:'pending',lease_id:'lease-fixture',lease_until:new Date(Date.now()+300000).toISOString(),first_attempt_at:new Date().toISOString(),provider_id:null,...extra};}
function worker(options={}) { const calls=[]; const r=row(options.row); return {calls,io:{claim:async()=>options.noClaim?null:r,eligible:async()=>options.eligible!==false,send:async(p,key)=>{calls.push(['send',p,key]);if(options.sendError)throw options.sendError;return'provider-fixture';},finish:async(...args)=>{calls.push(['finish',...args]);if(options.saveError && args[1]==='accepted')throw Error('db');}}}; }
test('accepted is provider acceptance, not delivered',async()=>{const f=worker();assert.equal(await policy.deliverCancellation(f.io,'fixture'),'accepted');assert.equal(f.calls[0][2],'cleverli-cancellation-v1-outbox-fixture');assert.equal(f.calls[1][2],'accepted');});
test('no claim means no transport',async()=>{const f=worker({noClaim:true});assert.equal(await policy.deliverCancellation(f.io,'fixture'),'not_claimed');assert.equal(f.calls.length,0);});
test('revoked eligibility suppresses without send',async()=>{const f=worker({eligible:false});assert.equal(await policy.deliverCancellation(f.io,'fixture'),'suppressed');assert.equal(f.calls[0][0],'finish');});
test('alternate sender never reaches transport',async()=>{const f=worker({row:{payload:{...row().payload,from:'Other <other@example.invalid>'}}});assert.equal(await policy.deliverCancellation(f.io,'fixture'),'pending');assert.ok(!f.calls.some(c=>c[0]==='send'));});
test('alternate reply-to never reaches transport',async()=>{const f=worker({row:{payload:{...row().payload,replyTo:'other@example.invalid'}}});await policy.deliverCancellation(f.io,'fixture');assert.ok(!f.calls.some(c=>c[0]==='send'));});
test('provider failure preserves pending without subscription writes',async()=>{const f=worker({sendError:Error('network')});assert.equal(await policy.deliverCancellation(f.io,'fixture'),'pending');assert.equal(f.calls.at(-1)[2],'pending');});
test('lost receipt remains pending with same key',async()=>{const f=worker({saveError:true});assert.equal(await policy.deliverCancellation(f.io,'fixture'),'pending');assert.equal(f.calls[0][2],'cleverli-cancellation-v1-outbox-fixture');});
test('Retry-After propagated to durable retry',async()=>{const f=worker({sendError:new policy.CancellationRetry(3600)});await policy.deliverCancellation(f.io,'fixture');assert.equal(f.calls.at(-1)[4],3600);});
test('expired lease never sends',async()=>{const f=worker({row:{lease_until:new Date(Date.now()-1).toISOString()}});await policy.deliverCancellation(f.io,'fixture');assert.ok(!f.calls.some(c=>c[0]==='send'));});
test('provider dedupe horizon cannot be crossed',async()=>{const f=worker({row:{first_attempt_at:new Date(Date.now()-24*3600000).toISOString()}});await policy.deliverCancellation(f.io,'fixture');assert.ok(!f.calls.some(c=>c[0]==='send'));});
function adapter(options={}) {
 const calls=[], state={row:null, sub:options.sub||sub()};
 const db={auth:{admin:{getUserById:async()=>({data:{user:{email:'fixture@example.invalid',user_metadata:{lang:'de'}}},error:null})}},from:table=>{
  let filterState,readyOnly=false,unreadyOnly=false,countOnly=false;
  const q={select:(_fields,opts)=>{countOnly=Boolean(opts?.head);return q;},eq:(field,value)=>{if(field==='state')filterState=value;return q;},not:()=>{readyOnly=true;return q;},is:()=>{unreadyOnly=true;return q;},lte:()=>q,order:()=>q,limit:()=>q,then:(resolve,reject)=>Promise.resolve({data:countOnly?null:(state.row&&(!filterState||state.row.state===filterState)&&(!readyOnly||state.row.ready_at)?[{id:state.row.id}]:[]),count:countOnly&&state.row?.state===filterState&&(!unreadyOnly||!state.row.ready_at)?1:0,error:null}).then(resolve,reject),maybeSingle:async()=>({data:options.upgrade?{id:'upgrade-fixture'}:null,error:options.upgradeError?Error('db'):null}),single:async()=>{
   if(table==='cancellation_mail_activation')return{data:{not_before:options.fence??now-10},error:null};
   if(table==='parent_profiles')return{data:{email:options.email||'fixture@example.invalid',premium_plan:options.lifetime?'schooltime':'monthly',stripe_subscription_id:'sub_fixture',stripe_customer_id:options.wrongCustomer?'cus_other':'cus_fixture'},error:null};
   return{data:state.row,error:null};
  }};return q;
 },rpc:async(name,p)=>{
  calls.push([name,p]);
  if(name==='enqueue_cancellation_mail'){if(!state.row)state.row=row({payload:p.p_payload,ready_at:null,first_attempt_at:null,lease_id:null,lease_until:null});return{data:state.row,error:null};}
  if(name==='ready_cancellation_mail'){if(options.readyError)return{data:false,error:Error('db')};state.row.ready_at??=new Date().toISOString();return{data:true,error:null};}
  if(name==='claim_cancellation_mail'){if(state.row.state!=='pending'||!state.row.ready_at||state.row.lease_id)return{data:null,error:null};state.row.first_attempt_at??=new Date().toISOString();state.row.lease_id='lease-fixture';state.row.lease_until=new Date(Date.now()+300000).toISOString();return{data:{...state.row},error:null};}
  if(name==='finish_cancellation_mail'){if(state.row.lease_id!==p.p_lease)return{data:false,error:null};state.row.lease_id=null;state.row.lease_until=null;state.row.state=p.p_state;state.row.provider_id=p.p_provider;return{data:true,error:null};}
  throw Error(name);
 }};
 const stripe={subscriptions:{retrieve:async()=>{calls.push(['retrieve']);return state.sub;}},prices:{retrieve:async()=>({product:'prod_fixture'})}};
 class Resend {constructor(){if(options.noProvider)throw Error('provider unavailable');}emails={send:async(payload,params)=>{calls.push(['send',payload,params]);return options.providerError?{data:null,error:{name:'rate_limit_exceeded'},headers:{'retry-after':'3600'}}:{data:{id:'provider-fixture'},error:null,headers:{}};}};}
 const server=load('src/lib/cancellationEmailServer.ts',{'./accountBilling':billing,'./cancellationEmail':policy,'@supabase/supabase-js':{createClient:()=>db},stripe:function(){return stripe;},resend:{Resend}},{RESEND_API_KEY:options.missingKey?undefined:'offline-fixture-only'});
 return {calls,state,server,db};
}
test('actual adapter sends once across duplicate future webhook events',async()=>{const f=adapter();assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'accepted');assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'accepted');assert.equal(f.calls.filter(c=>c[0]==='send').length,1);const sent=f.calls.find(c=>c[0]==='send');assert.equal(sent[1].from,'Cleverli <hello@cleverli.ch>');assert.equal(sent[1].replyTo,'hello@cleverli.ch');assert.equal(sent[1].to,'fixture@example.invalid');});
test('activation fence prevents all account reads/transport for historical event',async()=>{const f=adapter({fence:now+1});assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'skipped');assert.equal(f.calls.length,0);});
for(const [name,options]of [['lifetime',{lifetime:true}],['wrong customer',{wrongCustomer:true}],['recipient mismatch',{email:'other@example.invalid'}],['unrelated product',{sub:sub({items:{data:[{current_period_end:end,price:{id:'price_other',currency:'chf',recurring:{interval:'month'},product:'prod_other'}}]}})}]])test(`adapter excludes ${name}`,async()=>{const f=adapter(options);assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'skipped');assert.ok(!f.calls.some(c=>c[0]==='enqueue_cancellation_mail'||c[0]==='send'));});
test('missing provider never selects another sender or transport',async()=>{const f=adapter({missingKey:true});assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'pending');assert.ok(!f.calls.some(c=>c[0]==='send'));assert.equal(f.state.row.state,'pending');});
test('actual adapter respects Retry-After and does not undo cancellation',async()=>{const f=adapter({providerError:true});assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'pending');assert.equal(f.calls.at(-1)[1].p_retry_seconds,3600);assert.equal(f.state.sub.cancel_at_period_end,true);});
test('webhook producer is behind signature verification and no API/UI email claim exists',()=>{const s=fs.readFileSync('src/app/api/webhooks/stripe/route.ts','utf8');assert.ok(s.indexOf('stripe.webhooks.constructEvent')<s.indexOf('await processCancellationEmailEvent'));assert.match(s,/await syncOnce\(\);[\s\S]*if \(cancellationMailRetry\)/);const api=fs.readFileSync('src/app/api/cancel-subscription/route.ts','utf8');assert.ok(!/resend|emails\.send|processCancellationEmailEvent/.test(api));assert.ok(!fs.readFileSync('src/app/account/AccountClient.tsx','utf8').includes('emailDelivered'));});

function webhook(options={}) {
 const calls={mail:0,patch:0};
 const route=load('src/app/api/webhooks/stripe/route.ts',{
  stripe:function(){return{webhooks:{constructEvent:()=>{if(options.badSignature)throw Error('invalid');return event();}}};},
  '@/lib/cancellationEmailServer':{processCancellationEmailEvent:async()=>{calls.mail++;if(options.mailError)throw Error('provider');return options.mailState||'accepted';}},
  '@/lib/activationEmail':{isFirstCollectedInvoice:()=>false},
  '@sentry/nextjs':{captureException(){},captureMessage(){}},
  '@/lib/email':{}, '@/lib/userActivityServer':{logUserActivity:async()=>{}}, '@/lib/metaConversions':{},
  '@/lib/trialUpgradeServer':{settledTrialSubscription:async()=>false}, '@/lib/privateOfferServer':{},
 },{STRIPE_WEBHOOK_SECRET:'offline-fixture-only'},{fetch:async(_url,init)=>{calls.patch++;assert.equal(JSON.parse(init.body).cancelled,true);return{ok:true};},console:{log(){},error(){}}});
 return{calls,route,req:{text:async()=>'',headers:{get:()=> 'offline-signature-fixture'}}};
}
test('actual webhook rejects bad signature before mail producer',async()=>{const f=webhook({badSignature:true});assert.equal((await f.route.POST(f.req)).status,400);assert.equal(f.calls.mail,0);assert.equal(f.calls.patch,0);});
for(const [name,options]of [['pending',{mailState:'pending'}],['provider/DB exception',{mailError:true}]])test(`actual webhook ${name} still synchronises cancellation and asks Stripe to retry`,async()=>{const f=webhook(options);assert.equal((await f.route.POST(f.req)).status,503);assert.equal(f.calls.patch,1);});
test('accepted outbox returns normal webhook success',async()=>{const f=webhook();assert.equal((await f.route.POST(f.req)).status,200);assert.equal(f.calls.patch,1);});
for(const mailFails of [true,false])test(`cron preserves all existing jobs when mail fails=${mailFails}`,async()=>{
 const calls=[];
 const route=load('src/app/api/cron/private-offers/route.ts',{
 '@/lib/cancellationEmailServer':{retryCancellationEmails:async()=>{calls.push('mail');if(mailFails)throw Error('provider');return{outcomes:{accepted:1},requiresReview:false};}},
 '@/lib/trialUpgradeServer':{reconcileTrialUpgrade:async()=>{calls.push('trial');return{};},warmTrialUpgrade:async()=>{calls.push('warmTrial');return{};}},
 '@/lib/privateOfferServer':{warmPrivateOffers:async()=>{calls.push('original');return{};}},
 },{CRON_SECRET:'offline-cron-fixture'});
 const denied=await route.GET({headers:{get:()=>null}});assert.equal(denied.status,401);assert.equal(calls.length,0);
 const result=await route.GET({headers:{get:()=> 'Bearer offline-cron-fixture'}});assert.equal(result.status,mailFails?503:200);assert.deepEqual(calls.sort(),['mail','original','trial','warmTrial']);
});

test('approved retention price on the same Cleverli product can confirm',async()=>{
 const f=adapter({sub:sub({items:{data:[{current_period_end:end,price:{id:'price_retention_fixture',lookup_key:'cleverli_retention_yearly_66',unit_amount:6600,currency:'chf',recurring:{interval:'year'},product:'prod_fixture'}}]}})});
 assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'accepted');
});
test('retention lookup key on a different product cannot confirm',async()=>{
 const f=adapter({sub:sub({items:{data:[{current_period_end:end,price:{id:'price_retention_fixture',lookup_key:'cleverli_retention_yearly_66',unit_amount:6600,currency:'chf',recurring:{interval:'year'},product:'prod_unrelated'}}]}})});
 assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'skipped');assert.ok(!f.calls.some(c=>c[0]==='send'));
});
test('future trial cancellation can confirm without calling it paid',async()=>{
 const f=adapter({sub:sub({status:'trialing',trial_end:end})});assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'accepted');
 assert.ok(!f.calls.find(c=>c[0]==='send')[1].text.includes('bezahlte'));
});

test('actual adapter runs the durable-enqueue sync barrier before provider transport',async()=>{
 const f=adapter();await f.server.processCancellationEmailEvent(event(),async()=>{f.calls.push(['sync']);});
 const names=f.calls.map(c=>c[0]);assert.ok(names.indexOf('enqueue_cancellation_mail')<names.indexOf('sync'));assert.ok(names.indexOf('sync')<names.indexOf('send'));
});
test('failed entitlement sync barrier prevents transport, preserving outbox for retry',async()=>{
 const f=adapter();await assert.rejects(f.server.processCancellationEmailEvent(event(),async()=>{throw Error('sync failed');}));
 assert.equal(f.state.row.state,'pending');assert.ok(!f.calls.some(c=>c[0]==='send'));
});

test('mail rejects termination after current period even when period-end flag is true',()=>{assert.equal(policy.confirmedMailSubscription(sub({cancel_at:end+86400}),now),null);});
test('future termination with intervening renewal never enqueues no-renewal mail',async()=>{const f=adapter({sub:sub({cancel_at:end+86400})});assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'skipped');assert.ok(!f.calls.some(c=>c[0]==='enqueue_cancellation_mail'||c[0]==='send'));});

test('pending upgrade without subscription metadata marker is excluded before enqueue',async()=>{const f=adapter({upgrade:true});assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'skipped');assert.ok(!f.calls.some(c=>c[0]==='enqueue_cancellation_mail'||c[0]==='send'));});
test('failed upgrade-ledger check cannot send or enqueue',async()=>{const f=adapter({upgradeError:true});await assert.rejects(f.server.processCancellationEmailEvent(event(),async()=>{}),/upgrade_check_unavailable/);assert.ok(!f.calls.some(c=>c[0]==='enqueue_cancellation_mail'||c[0]==='send'));});

test('unready claimed row is rejected by the delivery layer too',async()=>{const f=worker({row:{ready_at:null}});assert.equal(await policy.deliverCancellation(f.io,'fixture'),'pending');assert.ok(!f.calls.some(c=>c[0]==='send'));});
test('producer cannot mark readiness without a sync barrier',async()=>{const f=adapter();await assert.rejects(f.server.processCancellationEmailEvent(event()),/sync_barrier_required/);assert.equal(f.state.row.ready_at,null);assert.ok(!f.calls.some(c=>c[0]==='send'));});
test('concurrent cron and direct claim cannot send while webhook sync is held',async()=>{
 const f=adapter();let enter,release;const entered=new Promise(resolve=>{enter=resolve;});const hold=new Promise(resolve=>{release=resolve;});
 const work=f.server.processCancellationEmailEvent(event(),async()=>{enter();await hold;});await entered;
 assert.equal(f.state.row.ready_at,null);assert.equal((await f.db.rpc('claim_cancellation_mail',{p_id:f.state.row.id})).data,null);
 await f.server.retryCancellationEmails();assert.ok(!f.calls.some(c=>c[0]==='send'));assert.equal(f.state.row.first_attempt_at,null);
 release();assert.equal(await work,'accepted');assert.equal(f.calls.filter(c=>c[0]==='send').length,1);assert.ok(f.state.row.ready_at);
});
test('failed sync leaves durable unready row unclaimable to later cron',async()=>{
 const f=adapter();await assert.rejects(f.server.processCancellationEmailEvent(event(),async()=>{throw Error('sync failure');}));
 await f.server.retryCancellationEmails();assert.equal((await f.db.rpc('claim_cancellation_mail',{p_id:f.state.row.id})).data,null);
 assert.equal(f.state.row.ready_at,null);assert.equal(f.state.row.first_attempt_at,null);assert.ok(!f.calls.some(c=>c[0]==='send'));
});
test('readiness persistence failure cannot fall through to either delivery path',async()=>{
 const f=adapter({readyError:true});await assert.rejects(f.server.processCancellationEmailEvent(event(),async()=>{}),/readiness_not_persisted/);
 await f.server.retryCancellationEmails();assert.equal(f.state.row.ready_at,null);assert.ok(!f.calls.some(c=>c[0]==='send'));
});

test('successful webhook retry releases the same failed-sync row exactly once',async()=>{
 const f=adapter();await assert.rejects(f.server.processCancellationEmailEvent(event(),async()=>{throw Error('sync failure');}));
 const id=f.state.row.id;await f.server.retryCancellationEmails();assert.ok(!f.calls.some(c=>c[0]==='send'));
 assert.equal(await f.server.processCancellationEmailEvent(event(),async()=>{}),'accepted');assert.equal(f.state.row.id,id);
 await f.server.retryCancellationEmails();assert.equal(f.calls.filter(c=>c[0]==='send').length,1);
});
