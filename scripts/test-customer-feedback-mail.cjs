const fs=require('fs'),assert=require('assert/strict'),vm=require('vm'),ts=require('typescript'),cp=require('child_process');
const {NextRequest,NextResponse}=require('next/server');let checks=0,sends=0,requests=[];
const load=(file,modules)=>{const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:m,exports:m.exports,process,console,require:n=>modules[n]??require(n)});return m.exports;};
const campaign=load('src/lib/customerFeedbackCampaign.ts',{});
let state='ready',fail=false,saveFail=false;
const guard={reserveFeedback:async value=>{const email=campaign.approvedFeedbackEmail(value);if(state!=='ready')throw Error('locked');state='sending';return{db:{},email};},persistFeedbackReceipt:async()=>{if(saveFail)throw Error('save');state='sent';}};
const email=load('src/lib/email.ts',{'resend':{Resend:class{emails={send:async(body,options)=>{sends++;requests.push({body,options});if(fail)throw Error('ambiguous timeout');return{data:{id:'receipt-fixture'}};}};}},'./customerFeedbackMail':guard,'./customerFeedbackCampaign':campaign});
const mailStatus={feedbackStatus:async()=>[{email:campaign.FEEDBACK_RECIPIENTS[0],state:'ready'}]};
const route=load('src/app/internal-log-dashboard/feedback-mail/route.ts',{'next/server':{NextResponse},'@/lib/internalDashboardAuth':{INTERNAL_LOG_COOKIE:'fixture',verifyInternalSession:v=>v==='yes'},'@/lib/customerFeedbackCampaign':campaign,'@/lib/customerFeedbackMail':mailStatus,'@/lib/email':email});
function req({method='POST',auth=true,origin='https://www.cleverli.ch',action='preview',to=campaign.FEEDBACK_RECIPIENTS[0],confirm=false,extra=false}={}){const headers={};if(auth)headers.cookie='fixture=yes';if(origin)headers.origin=origin;const form=new FormData();form.set('email',to);form.set('action',action);if(confirm)form.set('confirmed','yes');if(extra)form.append('email','unexpected@example.com');return new NextRequest('https://www.cleverli.ch/internal-log-dashboard/feedback-mail',{method,headers,...(method==='POST'?{body:form}:{})});}
(async()=>{
 assert.equal(campaign.FEEDBACK_RECIPIENTS.length,17);checks++;
 for(const opts of [{auth:false},{origin:'https://evil.example'},{origin:''},{to:'riccardogosteli@gmail.com'},{extra:true},{action:'batch'},{action:'send'}]){assert.ok((await route.POST(req(opts))).status>=400);checks++;}assert.equal(sends,0);checks++;
 assert.equal((await route.GET(req({method:'GET',auth:false}))).status,401);checks++;
 const page=await route.GET(req({method:'GET'}));assert.equal(page.status,200);assert.equal((await page.text()).match(/<option /g).length,17);checks+=2;
 const preview=await route.POST(req());assert.equal((await preview.json()).dryRun,true);assert.equal(sends,0);checks+=2;
 process.env.RESEND_API_KEY='fixture-not-a-secret';
 await assert.rejects(email.sendCustomerFeedbackRequestEmail('unexpected@example.com'));assert.equal(sends,0);checks+=2;
 await assert.rejects(email.sendCustomerFeedbackRequestEmail(campaign.FEEDBACK_RECIPIENTS[0],{test:true}));assert.equal(sends,0);checks+=2;
 assert.equal((await route.POST(req({action:'send',confirm:true}))).status,200);assert.equal(sends,1);assert.equal(state,'sent');checks+=3;
 await assert.rejects(email.sendCustomerFeedbackRequestEmail(campaign.FEEDBACK_RECIPIENTS[0],{idempotencyKey:'new-run'}));assert.equal(sends,1);checks+=2;
 const sent=requests[0];assert.equal(sent.body.from,campaign.FEEDBACK_FROM);assert.equal(sent.body.replyTo,campaign.FEEDBACK_REPLY_TO);assert.equal(sent.body.subject,campaign.FEEDBACK_SUBJECT);assert.equal(sent.body.to,campaign.FEEDBACK_RECIPIENTS[0]);assert.equal(sent.options.idempotencyKey,'feedback-premium-kunden-'+sent.body.to);checks+=5;
 state='ready';fail=true;await assert.rejects(email.sendCustomerFeedbackRequestEmail(campaign.FEEDBACK_RECIPIENTS[1]));assert.equal(state,'sending');await assert.rejects(email.sendCustomerFeedbackRequestEmail(campaign.FEEDBACK_RECIPIENTS[1]));assert.equal(sends,2);checks+=4;
 state='ready';fail=false;saveFail=true;await assert.rejects(email.sendCustomerFeedbackRequestEmail(campaign.FEEDBACK_RECIPIENTS[2]));assert.equal(state,'sending');await assert.rejects(email.sendCustomerFeedbackRequestEmail(campaign.FEEDBACK_RECIPIENTS[2]));assert.equal(sends,3);checks+=4;
 const before=cp.execFileSync('git',['show','d81aefb:src/lib/email.ts'],{encoding:'utf8'}),after=fs.readFileSync('src/lib/email.ts','utf8');
 const split=s=>{const a=s.indexOf('export async function sendCustomerFeedbackRequestEmail('),b=s.indexOf('export async function sendAdminPaymentNotificationEmail',a);return[s.slice(0,a).replace(/import .*customerFeedback.*\n/g,''),s.slice(a,b),s.slice(b)];};const old=split(before),now=split(after);assert.equal(now[0],old[0]);assert.equal(now[2],old[2]);checks+=2;
 for(const marker of ['    html: `','    text: `']){const get=s=>s.slice(s.indexOf(marker),s.indexOf('`,',s.indexOf(marker))+2);assert.equal(get(now[1]),get(old[1]));checks++;}
 assert.ok(fs.readFileSync('src/app/api/internal/customer-feedback-email/route.ts','utf8').includes('await sendCustomerFeedbackRequestEmail'));checks++;
 console.log(checks+' route, transport, ambiguity, exact-template and unrelated-mail preservation checks passed; all provider sends mocked.');
})().catch(e=>{console.error(e);process.exitCode=1;});
