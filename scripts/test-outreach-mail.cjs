const fs=require('fs'),assert=require('assert/strict'),vm=require('vm'),ts=require('typescript'),cp=require('child_process');
const {NextRequest,NextResponse}=require('next/server');let checks=0,sends=0,requests=[];
const load=(file,modules)=>{const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:m,exports:m.exports,process,console,require:n=>modules[n]??require(n)});return m.exports;};
const original=load('src/lib/outreachCampaign.ts',{}); assert.equal(original.OUTREACH_RECIPIENTS.length,5); assert.equal(original.OUTREACH_BATCH2_RECIPIENTS.length,3); const campaign={...original,OUTREACH_RECIPIENTS:original.ALL_OUTREACH_RECIPIENTS};let state='ready',fail=false,saveFail=false;
const guard={reserveOutreach:async value=>{const {email}=campaign.outreachRecipient(value);if(state!=='ready')throw Error('locked');state='sending';return{db:{},email};},persistOutreachReceipt:async()=>{if(saveFail)throw Error('save');state='sent';}};
const email=load('src/lib/email.ts',{'resend':{Resend:class{emails={send:async(body,options)=>{sends++;requests.push({body,options});if(fail)throw Error('ambiguous timeout');return{data:{id:'receipt-fixture'}};}};}},'./customerFeedbackMail':{},'./customerFeedbackCampaign':{},'./outreachMail':guard,'./outreachCampaign':campaign});
const mailStatus={outreachStatus:async()=>campaign.OUTREACH_RECIPIENTS.map(r=>({email:r.email,state:'ready'}))};
const route=load('src/app/internal-log-dashboard/outreach-mail/route.ts',{'next/server':{NextResponse},'@/lib/internalDashboardAuth':{INTERNAL_LOG_COOKIE:'fixture',verifyInternalSession:v=>v==='yes'},'@/lib/outreachCampaign':campaign,'@/lib/outreachMail':mailStatus,'@/lib/email':email});
function req({method='POST',auth=true,origin='https://www.cleverli.ch',action='preview',to=campaign.OUTREACH_RECIPIENTS[0].email,confirm=false,extra=false}={}){const headers={};if(auth)headers.cookie='fixture=yes';if(origin)headers.origin=origin;const form=new FormData();form.set('email',to);form.set('action',action);if(confirm)form.set('confirmed','yes');if(extra)form.append('html','arbitrary');return new NextRequest('https://www.cleverli.ch/internal-log-dashboard/outreach-mail',{method,headers,...(method==='POST'?{body:form}:{})});}
(async()=>{
 assert.equal(campaign.OUTREACH_RECIPIENTS.length,8);checks++;
 for(const opts of [{auth:false},{origin:'https://evil.example'},{origin:''},{to:'riccardogosteli@gmail.com'},{extra:true},{action:'batch'},{action:'send'}]){assert.ok((await route.POST(req(opts))).status>=400);checks++;}assert.equal(sends,0);checks++;
 assert.equal((await route.GET(req({method:'GET',auth:false}))).status,401);checks++;
 const page=await route.GET(req({method:'GET'}));assert.equal(page.status,200);assert.equal((await page.text()).match(/<option /g).length,8);checks+=2;
 for(const r of campaign.OUTREACH_RECIPIENTS){const preview=await route.POST(req({to:r.email}));const p=await preview.json();assert.equal(p.dryRun,true);assert.equal(p.content.greeting,r.greeting);assert.equal(sends,0);checks+=3;}
 process.env.RESEND_API_KEY='fixture-not-a-secret';
 await assert.rejects(email.sendApprovedOutreachEmail('unexpected@example.com'));assert.equal(sends,0);checks+=2;
 assert.equal((await route.POST(req({action:'send',confirm:true}))).status,200);assert.equal(sends,1);assert.equal(state,'sent');checks+=3;
 await assert.rejects(email.sendApprovedOutreachEmail(campaign.OUTREACH_RECIPIENTS[0].email));assert.equal(sends,1);checks+=2;
 const sent=requests[0];assert.equal(sent.body.from,campaign.OUTREACH_FROM);assert.equal(sent.body.replyTo,campaign.OUTREACH_REPLY_TO);assert.equal(sent.body.subject,campaign.OUTREACH_SUBJECT);assert.equal(sent.body.to,campaign.OUTREACH_RECIPIENTS[0].email);assert.equal(Object.keys(sent.body).sort().join(','),'from,html,replyTo,subject,to');checks+=5;
 state='ready';fail=true;await assert.rejects(email.sendApprovedOutreachEmail(campaign.OUTREACH_RECIPIENTS[1].email));assert.equal(state,'sending');await assert.rejects(email.sendApprovedOutreachEmail(campaign.OUTREACH_RECIPIENTS[1].email));assert.equal(sends,2);checks+=4;
 state='ready';fail=false;saveFail=true;await assert.rejects(email.sendApprovedOutreachEmail(campaign.OUTREACH_RECIPIENTS[2].email));assert.equal(state,'sending');await assert.rejects(email.sendApprovedOutreachEmail(campaign.OUTREACH_RECIPIENTS[2].email));assert.equal(sends,3);checks+=4;
 const before=cp.execFileSync('git',['show','e327abd:src/lib/email.ts'],{encoding:'utf8'}),after=fs.readFileSync('src/lib/email.ts','utf8');assert.equal(after.slice(after.indexOf('import { Resend }'),after.indexOf('\n// Fixed approved outreach only.')),before);checks++;
 const approved=fs.readFileSync('/Users/riccardogosteli/.openclaw/workspace-cleverli/.qa/outreach-send-20260912/approved-before.html','utf8');for(const r of campaign.OUTREACH_RECIPIENTS){assert.equal(campaign.outreachContent(r.email).html,approved.replace('>Guten Tag</p>',`>${r.greeting}</p>`));checks++;}
 const baseline=cp.execFileSync('git',['show','abaeed7:src/lib/outreachCampaign.ts'],{encoding:'utf8'});
 assert.ok(fs.readFileSync('src/lib/outreachCampaign.ts','utf8').startsWith(baseline.slice(0,baseline.indexOf('const HTML ='))));checks++;
 assert.equal(new Set(original.ALL_OUTREACH_RECIPIENTS.map(r=>r.email)).size,8);checks++;
 for(const r of original.OUTREACH_BATCH2_RECIPIENTS){state='ready';fail=false;saveFail=false;const out=await route.POST(req({action:'send',confirm:true,to:r.email}));assert.equal(out.status,200);assert.equal(requests.at(-1).body.to,r.email);assert.equal(requests.at(-1).body.html,campaign.outreachContent(r.email).html);checks+=3;await assert.rejects(email.sendApprovedOutreachEmail(r.email));checks++;}
 for(const forbidden of ['schulverwaltung@schulehinwil.ch','info@ipad-schule.ch','sekretariat@primarschule-seuzach.ch']){await assert.rejects(email.sendApprovedOutreachEmail(forbidden));checks++;}
 console.log(checks+' checks passed; provider transport fully mocked.');
})().catch(e=>{console.error(e);process.exitCode=1;});
