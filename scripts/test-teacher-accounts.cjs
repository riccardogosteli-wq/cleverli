const fs=require('fs'),assert=require('assert/strict'),vm=require('vm'),ts=require('typescript');
const {NextRequest,NextResponse}=require('next/server');
const load=(file,modules={})=>{const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:m,exports:m.exports,process,console,FormData,URL,URLSearchParams,Date,Number,require:n=>modules[n]??require(n)});return m.exports;};
const logic=load('src/lib/teacherAccount.ts');let checks=0,writes=0;
const user={id:'00000000-0000-0000-0000-000000000001',email:'teacher@example.invalid',name:'Teacher'};
const db={from:table=>{const value={data:table==='parent_profiles'?[user]:[],error:null};return{select(){return this},order(){return this},limit(){return this},eq(){return this},maybeSingle:async()=>({...value,data:table==='parent_profiles'?user:null}),then:resolve=>resolve(value)};},rpc:async()=>{writes++;return{data:{},error:null}}};
const route=load('src/app/internal-log-dashboard/teacher-accounts/route.ts',{'next/server':{NextResponse},'@supabase/supabase-js':{createClient:()=>db},'@/lib/internalDashboardAuth':{INTERNAL_LOG_COOKIE:'fixture',verifyInternalSession:v=>v==='yes'},'@/lib/teacherAccount':logic});
function req({method='POST',auth=true,origin='https://www.cleverli.ch',site='same-origin',action='preview',confirm=false,userId=user.id,extra=false,school='School',until='2027-09-11'}={}){const headers={'content-type':'application/x-www-form-urlencoded'};if(auth)headers.cookie='fixture=yes';if(origin)headers.origin=origin;if(site)headers['sec-fetch-site']=site;const form=new URLSearchParams({userId,action,school,until});if(confirm)form.set('confirmed','yes');if(extra)form.append('userId',user.id);return new NextRequest('https://www.cleverli.ch/internal-log-dashboard/teacher-accounts',{method,headers,...(method==='POST'?{body:form.toString()}:{})});}
(async()=>{
 for(const account of [null,{active:false,valid_until:'2027-09-11'},{active:true,valid_until:'invalid'},{active:true,valid_until:'2020-01-01'}]){assert.equal(logic.teacherAccountActive(account),false);checks++;}
 assert.equal(logic.teacherAccountActive({active:true,valid_until:'2027-09-11'}),true);checks++;
 for(const opts of [{auth:false},{origin:''},{origin:'https://evil.invalid'},{site:'cross-site'},{action:'grant'},{action:'revoke'},{action:'grant',confirm:true,school:''},{action:'grant',confirm:true,until:'2020-01-01'},{action:'buy'},{extra:true},{userId:'not-a-uuid'}]){assert.ok((await route.POST(req(opts))).status>=400);checks++;}
 assert.equal(writes,0);checks++;
 assert.equal((await route.GET(req({method:'GET',auth:false}))).status,401);checks++;
 const page=await route.GET(req({method:'GET'}));assert.equal(page.status,200);const html=await page.text();assert.ok(html.includes('Lehrerkonto freischalten'));assert.ok(html.includes('teacher@example.invalid'));checks+=3;
 const preview=await route.POST(req());assert.equal((await preview.json()).changed,false);assert.equal(writes,0);checks+=2;
 assert.equal((await route.POST(req({action:'grant',confirm:true}))).status,303);assert.equal(writes,1);checks+=2;
 assert.equal((await route.POST(req({action:'revoke',confirm:true}))).status,303);assert.equal(writes,2);checks+=2;
 const hook=fs.readFileSync('src/hooks/useTeacherAccount.ts','utf8');assert.ok(!/localStorage\s*\./.test(hook));assert.ok(hook.includes('.eq(\'user_id\', session.user.id)'));assert.ok(hook.includes('attempt === generation'));checks+=3;
 const family=fs.readFileSync('src/lib/family.ts','utf8');assert.ok(family.indexOf('await createChildInSupabase(member.id')<family.indexOf('const store = loadFamily(); store.members.push(member)'));assert.ok(family.includes('scope !== getAccountStorageScope()'));checks+=2;
 for(const file of ['src/components/ChildProfileManager.tsx','src/app/family/PageClient.tsx']){const s=fs.readFileSync(file,'utf8');assert.ok(s.includes('await addTeacherMember'));assert.ok(s.includes('disabled={saving}'));checks+=2;}
 const publicPage=fs.readFileSync('src/app/lehrpersonen/TeacherPage.tsx','utf8');assert.ok(publicPage.includes('mailto:hello@cleverli.ch'));assert.ok(!publicPage.includes('startCheckout'));assert.ok(publicPage.includes('Preis nach Vereinbarung'));checks+=3;
 console.log(`${checks} teacher access, admin session/CSRF/confirmation, dry-run, no-checkout and profile creation contract checks passed; DB mutations mocked.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
