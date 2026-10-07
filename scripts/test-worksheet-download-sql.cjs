const fs=require('fs'),assert=require('node:assert/strict');
const{PGlite}=require(process.env.PRIVATE_OFFER_TEST_PGLITE_MODULE||'@electric-sql/pglite');
(async()=>{const db=new PGlite();let checks=0;try{
 await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);grant usage on schema public to anon,authenticated,service_role;');
 const sql=fs.readFileSync('supabase/2026-10-07-worksheet-download-events.sql','utf8');await db.exec(sql);await db.exec(sql);checks++;
 const id='00000000-0000-0000-0000-000000000001';await db.query('insert into auth.users values($1)',[id]);
 const base={topic_id:'free-brueche-3-klasse',title:'Brüche',grade:3,subject:'math',file_type:'worksheet',file_sha256:'a'.repeat(64),file_bytes:120};
 const insert=async extra=>{const row={...base,access_type:'free',is_qa:false,...extra};const keys=Object.keys(row);return db.query('insert into worksheet_download_events('+keys.join(',')+') values('+keys.map((_,i)=>'$'+(i+1)).join(',')+') returning id',Object.values(row));};
 await db.exec('set role service_role');await insert({});checks++;await insert({access_type:'premium',user_id:id});checks++;await insert({access_type:'teacher',user_id:id,is_qa:true,qa_reason:'test_account'});checks++;
 for(const row of [{grade:7},{grade:0},{file_type:'other'},{file_sha256:'bad'},{file_bytes:0},{access_type:'unknown'},{user_id:id},{is_qa:true},{qa_reason:'invalid'},{topic_id:''},{title:''}]){await assert.rejects(insert(row));checks++;}
 for(const role of ['anon','authenticated']){await db.exec('reset role;set role '+role);await assert.rejects(db.query('select * from worksheet_download_events'));await assert.rejects(insert({}));await assert.rejects(db.query('delete from worksheet_download_events'));checks+=3;}
 await db.exec('reset role');await db.query('delete from auth.users where id=$1',[id]);assert.equal((await db.query('select count(*)::int n from worksheet_download_events where user_id is not null')).rows[0].n,0);checks++;
 await db.exec('set role service_role');assert.equal((await db.query('select count(*)::int n from worksheet_download_events where not is_qa')).rows[0].n,2);checks++;
 console.log(checks+' ephemeral SQL checks passed: RLS,service-only access,validations,QA separation,account deletion');
}finally{await db.close()}})().catch(e=>{console.error(e.message);process.exitCode=1});
