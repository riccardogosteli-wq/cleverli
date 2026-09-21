/* eslint-disable @typescript-eslint/no-require-imports -- Offline PostgreSQL WASM rehearsal. */
const { PGlite } = require(process.env.CANCELLATION_SQL_QA_MODULE || '@electric-sql/pglite');
const fs = require('node:fs'), assert = require('node:assert/strict');
(async()=>{
 const db=new PGlite();let checks=0;const ok=()=>checks++;
 const user='00000000-0000-4000-8000-000000000019';
 await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;
 create table auth.users(id uuid primary key,email text);
 create table public.parent_profiles(id uuid primary key,email text,premium_plan text,stripe_customer_id text,stripe_subscription_id text);
 insert into auth.users values('${user}','fixture@example.invalid');
 insert into parent_profiles values('${user}','fixture@example.invalid','monthly','cus_fixture','sub_fixture');`);
 const before=JSON.stringify((await db.query('select * from parent_profiles')).rows);
 await db.exec(fs.readFileSync('supabase/2026-09-21-cancellation-mail.sql','utf8'));
 assert.equal((await db.query('select count(*) from cancellation_mail_outbox')).rows[0].count,0);ok();
 const fence=Number((await db.query('select not_before from cancellation_mail_activation')).rows[0].not_before);
 const payload={from:'Cleverli <hello@cleverli.ch>',replyTo:'hello@cleverli.ch',to:'fixture@example.invalid',subject:'Kündigung bestätigt',html:'<p>Fixture</p>',text:'Fixture'};
 const enqueue=async(event='evt_fixture',cancelled=fence,body=payload,created=fence)=>db.query('select * from enqueue_cancellation_mail($1,$2,$3,$4,$5,$6,to_timestamp($7),$8,$9::jsonb)',[event,created,user,'sub_fixture','cus_fixture',cancelled,fence+604800,true,JSON.stringify(body)]);
 await assert.rejects(enqueue('evt_old',fence-1,payload,fence-1),/not_future_confirmation/);ok();
 await assert.rejects(enqueue('evt_sender',fence,{...payload,from:'Other <other@example.invalid>'}),/sender_not_allowed/);ok();
 await assert.rejects(enqueue('evt_reply',fence,{...payload,replyTo:'other@example.invalid'}),/sender_not_allowed/);ok();
 await assert.rejects(enqueue('evt_recipient',fence,{...payload,to:'other@example.invalid'}),/recipient_identity_changed/);ok();
 await db.exec("update parent_profiles set premium_plan='schooltime'");await assert.rejects(enqueue(),/recipient_identity_changed/);await db.exec("update parent_profiles set premium_plan='monthly'");ok();
 const r=(await enqueue()).rows[0];assert.equal(r.state,'pending');ok();
 const duplicate=(await enqueue('evt_duplicate',fence,{...payload,subject:'Changed'})).rows[0];assert.equal(duplicate.id,r.id);assert.equal(duplicate.payload.subject,payload.subject);ok();
 assert.equal((await db.query('select count(*) from cancellation_mail_outbox')).rows[0].count,1);ok();
 const claim=async(id=r.id)=>(await db.query('select * from claim_cancellation_mail($1)',[id])).rows[0];
 const c=await claim();assert.equal(c.attempts,1);assert.ok(c.lease_id);ok();
 assert.equal((await claim()).id,null);ok();
 const finish=async(lease,state,provider=null,retry=600)=>(await db.query('select finish_cancellation_mail($1,$2,$3,$4,$5) as ok',[r.id,lease,state,provider,retry])).rows[0].ok;
 assert.equal(await finish('00000000-0000-4000-8000-000000000000','accepted','provider_wrong'),false);ok();
 assert.equal(await finish(c.lease_id,'pending',null,3600),true);ok();
 const wait=(await db.query('select extract(epoch from next_attempt_at-clock_timestamp()) as seconds from cancellation_mail_outbox')).rows[0].seconds;assert.ok(Number(wait)>3590);ok();
 assert.equal((await claim()).id,null);ok();
 await db.exec("update cancellation_mail_outbox set next_attempt_at=clock_timestamp()-interval '1 second'");
 const c2=await claim();assert.equal(c2.attempts,2);assert.equal(new Date(c2.first_attempt_at).getTime(),new Date(c.first_attempt_at).getTime());ok();
 assert.equal(await finish(c2.lease_id,'accepted','provider_fixture'),true);assert.equal((await claim()).id,null);ok();
 assert.equal((await enqueue('evt_again')).rows[0].state,'accepted');ok();
 // A new cycle is distinct; ambiguous work older than the provider window is frozen.
 const r2=(await enqueue('evt_cycle2',fence+1)).rows[0];assert.notEqual(r2.id,r.id);ok();
 await db.query("update cancellation_mail_outbox set first_attempt_at=clock_timestamp()-interval '24 hours' where id=$1",[r2.id]);
 assert.equal((await claim(r2.id)).id,null);assert.equal((await db.query('select state from cancellation_mail_outbox where id=$1',[r2.id])).rows[0].state,'review');ok();
 const r3=(await enqueue('evt_cycle3',fence+2)).rows[0];await db.query("update cancellation_mail_outbox set end_at=clock_timestamp()-interval '1 second' where id=$1",[r3.id]);
 assert.equal((await claim(r3.id)).id,null);assert.equal((await db.query('select state from cancellation_mail_outbox where id=$1',[r3.id])).rows[0].state,'suppressed');ok();
 for(const role of ['anon','authenticated']){
  await assert.rejects(db.exec(`set role ${role};select * from cancellation_mail_outbox`),/permission denied/);await db.exec('reset role');ok();
  await assert.rejects(db.exec(`set role ${role};select claim_cancellation_mail('${r.id}')`),/permission denied/);await db.exec('reset role');ok();
 }
 const r4=(await enqueue('evt_cycle4',fence+3)).rows[0];const firstLease=await claim(r4.id);
 await db.query("update cancellation_mail_outbox set lease_until=clock_timestamp()-interval '1 second' where id=$1",[r4.id]);
 const secondLease=await claim(r4.id);assert.notEqual(firstLease.lease_id,secondLease.lease_id);assert.equal(secondLease.attempts,2);ok();
 assert.equal((await db.query('select finish_cancellation_mail($1,$2,$3,$4) as ok',[r4.id,firstLease.lease_id,'accepted','provider_stale'])).rows[0].ok,false);ok();
 assert.equal((await db.query('select finish_cancellation_mail($1,$2,$3,$4) as ok',[r4.id,secondLease.lease_id,'accepted','provider_cycle4'])).rows[0].ok,true);ok();
 await assert.rejects(db.exec("set role service_role;update cancellation_mail_outbox set state='pending'"),/permission denied/);await db.exec('reset role');ok();
 assert.equal(JSON.stringify((await db.query('select * from parent_profiles')).rows),before);ok();
 await db.close();console.log(`${checks} offline cancellation SQL assertions passed. No live DB, no multi-connection concurrency claim.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
