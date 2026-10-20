const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const out={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/emailCampaignTracking.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:out,exports:out.exports,URL,Response,Error});
const t=out.exports,id='6ea92c76-21b7-4c5b-a7ad-6b2e6cd76070',token='a'.repeat(64);let checks=0;function eq(a,b){assert.equal(a,b);checks++}function yes(a){assert.ok(a);checks++}
(async()=>{
for(const [target,path] of Object.entries(t.MAIL_DESTINATIONS)){
 const row={target,campaign:'offer149_20261020',source:'cleverli',content:'top'};
 const destination=t.mailDestination(row),u=new URL(destination);eq(u.origin,'https://www.cleverli.ch');eq(u.pathname,path);eq(u.searchParams.get('utm_campaign'),row.campaign);eq(u.searchParams.get('utm_medium'),'email');eq(u.searchParams.get('utm_content'),'top');eq(destination.endsWith('#'),target!=='personal');
 const url=t.trackedMailLink({campaignId:id,label:'top',target,...(target==='personal'?{token}:{})});eq(new URL(url).hash,target==='personal'?'#'+token:'');yes(!url.includes('?'));}
for(const value of ['__proto__','constructor','https://evil.test','//evil.test',null,{},'personal#secret'])eq(t.mailDestination({target:value,campaign:'ok',source:'ok',content:'top'}),null);
for(const field of ['campaign','source','content'])for(const value of ['x@y.ch','foo?token=secret','\r\nLocation: evil','',null,'A','x'.repeat(81)])eq(t.mailDestination({target:'personal',campaign:'ok',source:'ok',content:'top',[field]:value}),null);
for(const bad of ['','a'.repeat(64),'00000000-0000-0000-0000-000000000000','../../x']){assert.throws(()=>t.trackedMailLink({campaignId:bad,label:'top',target:'personal',token}));checks++;}
for(const bad of [undefined,'A'.repeat(64),'a'.repeat(63),'x@x.ch']){assert.throws(()=>t.trackedMailLink({campaignId:id,label:'top',target:'personal',token:bad}));checks++;}
assert.throws(()=>t.trackedMailLink({campaignId:id,label:'top',target:'home',token}));checks++;
let calls=[];const lookup=async(...args)=>{calls.push(args);return{target:'personal',campaign:'qa_20261020',source:'cleverli',content:args[1]}};
for(const count of [true,false]){const r=await t.resolveMailClick(id,'top',count,lookup);eq(r.status,302);eq(r.headers.get('referrer-policy'),'no-referrer');yes(r.headers.get('cache-control').includes('no-store'));eq(r.headers.get('set-cookie'),null);yes(!r.headers.get('location').includes(token));eq(calls.at(-1)[2],count);eq(await r.text(),'');}
for(const label of ['x@y','../x','x'.repeat(49),'__proto__','top?foo'])eq((await t.resolveMailClick(id,label,true,lookup)).status,404);
eq((await t.resolveMailClick(id,'top',true,async()=>null)).status,404);
for(const loader of [async()=>{throw Error('sensitive secret')},async()=>({target:'evil'})]){const r=await t.resolveMailClick(id,'top',true,loader);eq(r.status,503);yes(!(await r.text()).includes('secret'));eq(r.headers.get('retry-after'),'60');}
const sql=fs.readFileSync('supabase/2026-10-20-email-campaign-clicks.sql','utf8');for(const phrase of ['security invoker','enable row level security','from public,anon,authenticated','email_campaign_clicks.requests+1',"r.mode in ('test','live')"])yes(sql.includes(phrase));
console.log(JSON.stringify({checks,result:'PASS',realEmails:0,realPayments:0}));
})().catch(e=>{console.error(e);process.exitCode=1});
