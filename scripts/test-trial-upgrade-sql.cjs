// Offline PostgreSQL WASM rehearsal only. Install @electric-sql/pglite outside repo,
// supply its module path in TRIAL_SQL_QA_MODULE. Never uses production credentials.
const {PGlite}=require(process.env.TRIAL_SQL_QA_MODULE || '@electric-sql/pglite');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const db=new PGlite();let checks=0;
 const ok=()=>checks++;
 await db.exec(`create role anon;create role authenticated;create role service_role;
 create schema auth;create table auth.users(id uuid primary key,email text);
 create table public.parent_profiles(id uuid primary key,email text,premium boolean,premium_plan text,premium_until timestamptz,cancelled boolean,stripe_customer_id text,stripe_subscription_id text);
 insert into auth.users values('bb7c9111-8560-42a8-939c-2a3a4e70179c','stephan-michi@gmx.net');
 insert into parent_profiles values('bb7c9111-8560-42a8-939c-2a3a4e70179c','stephan-michi@gmx.net',true,'monthly',to_timestamp(1790528279),false,'cus_VIOr4Apz2BT3cJ','sub_1UHo3xDGUBi3vyUQhJGLpwRh');`);
 await db.exec(fs.readFileSync('supabase/2026-09-10-private-offers.sql','utf8'));
 await db.exec(fs.readFileSync('supabase/2026-09-20-offer219-mail.sql','utf8'));
 await db.exec(`insert into private_checkout_offers(id,token_hash,user_id,customer_id,amount,deadline) values('592407b7-8c6f-4a84-b586-b54ed7114ac4',repeat('a',64),'bb7c9111-8560-42a8-939c-2a3a4e70179c','cus_VIOXq9aXmNgCJh',21900,1790535479);`);
 const before=JSON.stringify((await db.query('select * from private_checkout_offers')).rows);
 await db.exec(fs.readFileSync('supabase/2026-09-20-stephan-trial-upgrade.sql','utf8'));
 assert.equal((await db.query('select count(*) from trial_upgrade_offers')).rows[0].count,0);ok();
 const id='3823f764-03b8-4617-b808-d798fc9e9a10', user='bb7c9111-8560-42a8-939c-2a3a4e70179c';
 await db.exec(`insert into trial_upgrade_offers(id,token_hash,user_id,customer_id,amount,deadline) values('${id}',repeat('b',64),'${user}','cus_VIOr4Apz2BT3cJ',21900,1790535479);`);ok();
 const reserve=`select reserve_trial_upgrade_mail('stephan-michi@gmx.net','${id}','${user}','cus_VIOr4Apz2BT3cJ',repeat('b',64),repeat('c',64))`;
 const migration=fs.readFileSync('supabase/2026-09-20-stephan-trial-upgrade.sql','utf8');
 const reservationFunction=migration.match(/create function public.reserve_trial_upgrade_mail[\s\S]*?\$\$;/)[0].replace('create function','create or replace function');
 // Clock-only variants prove unsafe cron boundaries fail BEFORE reservation.
 const provisionalDeadline=(await db.query('select deadline from trial_upgrade_offers')).rows[0].deadline;
 for(const time of ['14:56:40','15:10:00']) {
  const timestamp=Date.parse('2026-09-20T'+time+'Z')/1000;
  await db.exec(reservationFunction.replace("date_trunc('second',clock_timestamp())",`to_timestamp(${timestamp})`));
  await assert.rejects(db.query(reserve),/trial_final_warm_window_requires_review/);ok();
  assert.equal((await db.query('select count(*) from trial_upgrade_mail')).rows[0].count,0);
  assert.equal((await db.query('select deadline from trial_upgrade_offers')).rows[0].deadline,provisionalDeadline);ok();
 }
 await db.exec(reservationFunction);
 // Real migration executes with current local clock, without any live services.
 const reservation=(await db.query(reserve.replace('select reserve_trial_upgrade_mail(', 'select * from reserve_trial_upgrade_mail('))).rows[0];
 assert.equal(Number(reservation.deadline)-Date.parse(reservation.claimed_at)/1000,259200);ok();
 assert.equal(Number((await db.query('select deadline from trial_upgrade_offers')).rows[0].deadline),Number(reservation.deadline));ok();
 assert.equal((await db.query('select count(*) from trial_upgrade_mail')).rows[0].count,1);ok();
 await assert.rejects(db.query(reserve),/duplicate key/);ok();
 // Clock-only test variant of the SAME reservation function: future dispatch must
 // fail before changing the already stored receipt/deadline. Restore exact SQL after.
 const beforeFuture=JSON.stringify((await db.query('select * from trial_upgrade_mail')).rows);
 await db.exec(reservationFunction.replace("date_trunc('second',clock_timestamp())",'to_timestamp(1790528279-259200)'));
 await assert.rejects(db.query(reserve),/three_day_trial_window_requires_review/);ok();
 assert.equal(JSON.stringify((await db.query('select * from trial_upgrade_mail')).rows),beforeFuture);ok();
 await db.exec(reservationFunction);
 const expires=Number(reservation.deadline)-60;
 await assert.rejects(db.exec(`set role anon;select * from trial_upgrade_offers;`),/permission denied/);await db.exec('reset role');ok();
 await assert.rejects(db.exec(`set role authenticated;select * from trial_upgrade_mail;`),/permission denied/);await db.exec('reset role');ok();
 // Ledger primary key is a permanent reservation even without provider receipt.
 await assert.rejects(db.exec(`insert into trial_upgrade_mail(recipient,offer_id,body_hash,claimed_at,deadline) values('stephan-michi@gmx.net','${id}',repeat('c',64),now(),1790535479)`),/duplicate key/);ok();
 // Fixed offline session fixture. No Stripe call, no real payment.
 await db.exec(`update trial_upgrade_offers set generation=1,session_id='cs_fixture',session_expires=${expires} where id='${id}';`);
 const redeem=(paid=true,session='cs_fixture',customer='cus_VIOr4Apz2BT3cJ',amount=21900)=>`select redeem_trial_upgrade('${id}','${session}','${user}','${customer}',${amount},'chf',${paid},${expires}) as first`;
 for(const q of [redeem(false),redeem(true,'cs_wrong'),redeem(true,'cs_fixture','cus_wrong'),redeem(true,'cs_fixture','cus_VIOr4Apz2BT3cJ',990)]){await assert.rejects(db.query(q),/payment_mismatch/);ok();}
 assert.equal((await db.query('select premium_plan from parent_profiles')).rows[0].premium_plan,'monthly');ok();
 assert.equal((await db.query(redeem())).rows[0].first,true);assert.equal((await db.query('select cancellation_state from trial_upgrade_offers')).rows[0].cancellation_state,'pending');ok();
 assert.equal((await db.query(redeem())).rows[0].first,false);ok();
 // Behavioral entitlement tests for late deletion, active update, invoice sync,
 // and subscription Checkout payloads, all through the real DB trigger.
 for(const patch of ["premium=false,premium_plan=null,premium_until=null,cancelled=true,stripe_subscription_id='sub_1UHo3xDGUBi3vyUQhJGLpwRh'","premium=true,premium_plan='monthly',premium_until=now(),cancelled=false,stripe_subscription_id='sub_1UHo3xDGUBi3vyUQhJGLpwRh'","premium=true,premium_plan='yearly',premium_until=now(),stripe_customer_id='cus_other'","premium=true,premium_plan='monthly',premium_until=now(),stripe_subscription_id='late_checkout'"]){
  await db.exec(`update parent_profiles set ${patch} where id='${user}'`);
  const p=(await db.query('select * from parent_profiles')).rows[0];assert.equal(p.premium,true);assert.equal(p.premium_plan,'schooltime');assert.equal(p.premium_until,null);assert.equal(p.stripe_subscription_id,null);assert.equal(p.stripe_customer_id,'cus_VIOr4Apz2BT3cJ');ok();
 }
 assert.equal(JSON.stringify((await db.query('select * from private_checkout_offers')).rows),before);assert.equal((await db.query('select count(*) from offer219_mail')).rows[0].count,0);ok();
 await db.exec(`insert into parent_profiles values('00000000-0000-0000-0000-000000000001','other@example.test',true,'monthly',now(),false,'cus_other','sub_other');update parent_profiles set premium=false,premium_plan=null where email='other@example.test';`);assert.equal((await db.query("select premium from parent_profiles where email='other@example.test'")).rows[0].premium,false);ok();
 await db.close();console.log(`${checks} offline PostgreSQL assertions passed; original offer/ledger unchanged. No live database used. Multi-connection concurrency not simulated.`);
})().catch(error=>{console.error('Offline SQL rehearsal failed:',error.message);process.exit(1);});
