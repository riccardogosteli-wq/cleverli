const fs=require('fs'), assert=require('assert/strict');
const {PGlite}=require(process.env.PRIVATE_OFFER_TEST_PGLITE_MODULE||'@electric-sql/pglite');
(async()=>{const db=new PGlite();let checks=0;try{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key,email text);create table public.parent_profiles(id uuid primary key,premium boolean,premium_plan text,premium_until timestamptz);`);
 await db.exec(fs.readFileSync('supabase/2026-09-12-school-outreach-mail.sql','utf8'));
 const rows=(await db.query('select * from school_outreach_mail order by email')).rows;
 assert.equal(rows.length,5);checks++;
 for(const [i,r] of rows.entries()){const id='00000000-0000-0000-0000-'+String(i+1).padStart(12,'0');await db.query('insert into auth.users values($1,$2)',[id,r.email]);await db.query("insert into parent_profiles values($1,true,'monthly',now()+interval '1 month')",[id]);}
 const claim=email=>db.query('select * from claim_school_outreach_mail($1)',[email]);
 assert.equal((await claim(rows[0].email)).rows.length,0);checks++;
 await db.exec("update school_outreach_mail set state='ready',reviewed_at=now(),review_evidence='fixture review'");
 const result=await Promise.all(Array.from({length:20},()=>claim(rows[0].email.toUpperCase())));
 assert.equal(result.reduce((s,r)=>s+r.rows.length,0),1);checks++;
 assert.equal((await claim(rows[0].email)).rows.length,0);checks++;
 await assert.rejects(db.query("update school_outreach_mail set state='ready' where email=$1",[rows[0].email]));checks++;
 await assert.rejects(db.query("update school_outreach_mail set campaign='new-run' where email=$1",[rows[0].email]));checks++;
 await db.query("update school_outreach_mail set state='sent',provider_id='provider-1',sent_at=now() where email=$1",[rows[0].email]);
 assert.equal((await claim(rows[0].email)).rows.length,0);checks++;
 await assert.rejects(db.query("update school_outreach_mail set provider_id='changed' where email=$1",[rows[0].email]));checks++;
 await assert.rejects(db.query('insert into school_outreach_mail(form_key,email,campaign) values($1,$2,$3)',['school-outreach',rows[0].email,'rerun']));checks++;
 await db.query("update school_outreach_mail set reviewed_at=now()-interval '25 hours' where email=$1",[rows[1].email]);assert.equal((await claim(rows[1].email)).rows.length,0);checks++;
 await db.query("update school_outreach_mail set state='suppressed' where email=$1",[rows[2].email]);assert.equal((await claim(rows[2].email)).rows.length,0);checks++;
 assert.equal((await claim('unexpected@example.com')).rows.length,0);checks++;
 for(const role of ['anon','authenticated']){await db.exec('set role '+role);await assert.rejects(db.query('select * from school_outreach_mail'));await assert.rejects(claim(rows[3].email));checks+=2;await db.exec('reset role');}
 await db.exec('set role service_role');await assert.rejects(db.query("delete from school_outreach_mail"));await assert.rejects(db.query("insert into school_outreach_mail(form_key,email,campaign) values('school-outreach','unexpected@example.com','new')"));checks+=2;await db.exec('reset role');
 assert.equal((await db.query('select count(*)::int n from school_outreach_mail')).rows[0].n,5);checks++;
 console.log(checks+' ephemeral SQL checks passed, including 20 concurrent claims, persistent duplicate and ambiguous locks, eligibility, RLS and fixed batch. No live DB touched.');
}finally{await db.close();}})().catch(e=>{console.error(e);process.exitCode=1;});