const fs=require('fs'),assert=require('node:assert/strict'),ts=require('typescript'),path=require('path'),crypto=require('crypto');
const load=(file,mocks={})=>{const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText)(n=>n in mocks?mocks[n]:require(n),m,m.exports);return m.exports};
const teacher=load('src/lib/teacherAccount.ts');const access=load('src/lib/worksheets/access.ts',{'@/lib/teacherAccount':teacher});
const returns=load('src/lib/worksheets/returnTo.ts');
const catalogue=require('../../src/lib/worksheets/catalogue.json');
const root=path.resolve(process.argv[2]||'../worksheets/all-grades-2026-09-26');
let count=0;const check=(name,fn)=>{fn();count++;console.log('PASS',name)};
check('303 canonical topics, exact grade totals',()=>{assert.equal(catalogue.length,303);assert.equal(new Set(catalogue.map(t=>t.id)).size,303);assert.deepEqual([1,2,3,4,5,6].map(g=>catalogue.filter(t=>t.grade===g).length),[36,35,51,61,60,60])});
const instant=Date.parse('2026-09-27T12:00:00Z');
for(const [name,profile,expected] of [
 ['missing',null,false],['revoked',{premium:false,premium_until:null},false],
 ['expires-now',{premium:true,premium_until:new Date(instant).toISOString()},false],
 ['valid-next-millisecond',{premium:true,premium_until:new Date(instant+1).toISOString()},true],
 ['missing-expiry-field',{premium:true},false],['nonboolean-premium',{premium:'true',premium_until:null},false]
])check('entitlement boundary '+name,()=>assert.equal(access.worksheetAccess(profile,null,instant),expected));
check('valid teacher overrides expired family entitlement',()=>assert.equal(access.worksheetAccess({premium:true,premium_until:'2000-01-01'}, {user_id:'fixture',school_name:'Fixture',active:true,valid_until:'2099-01-01'},instant),true));
check('teacher at expiry is denied',()=>assert.equal(access.worksheetAccess(null,{user_id:'fixture',school_name:'Fixture',active:true,valid_until:new Date(instant).toISOString()},instant),false));
const runtime=load('src/data/topicCatalog.generated.ts').TOPIC_CATALOG;
const canonical=Object.entries(runtime).filter(([k])=>!/-nt$|-rzg$/.test(k)).flatMap(([k,v])=>v.map(t=>`${k}-${t.id}`));
check('current runtime 366 = 303 canonical + 63 aliases',()=>{assert.equal(Object.values(runtime).flat().length,366);assert.equal(canonical.length,303);assert.deepEqual(new Set(canonical),new Set(catalogue.map(t=>`${t.grade}-${t.subject}-${t.topicId}`)));for(const [k,v] of Object.entries(runtime).filter(([k])=>/-nt$|-rzg$/.test(k)))for(const t of v)assert(canonical.includes(`${k.split('-')[0]}-science-${t.id}`))});
for(const topic of catalogue)for(const file of Object.values(topic.files))check('approved hash '+file.path,()=>{const b=fs.readFileSync(path.join(root,file.path));assert.equal(b.length,file.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),file.sha256)});
check('only the approved Grade3 worksheet and matching solution are public',()=>{assert.deepEqual(fs.readdirSync('public/worksheets').filter(x=>x.endsWith('.pdf')).sort(),['beispiel-klasse-3-loesungen.pdf','beispiel-klasse-3.pdf']);for(const [type,name] of [['worksheet','beispiel-klasse-3.pdf'],['solution','beispiel-klasse-3-loesungen.pdf']]){const b=fs.readFileSync('public/worksheets/'+name),approved=catalogue.find(t=>t.id==='CL-3-math-brueche').files[type];assert.equal(b.length,approved.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),approved.sha256);}});
check('sample offers direct anonymous solution download without claiming Premium is needed',()=>{const page=fs.readFileSync('src/app/arbeitsblaetter/page.tsx','utf8'),sample=page.split('<section id="beispiel"')[1].split('</section>')[0];assert.match(sample,/href="\/worksheets\/beispiel-klasse-3-loesungen\.pdf" download="Cleverli-Brueche-Klasse-3-Loesungen\.pdf"/);assert.match(sample,/Lösung herunterladen/);assert.match(sample,/Ohne Anmeldung/);assert(!sample.includes('mit Premium'));});
for(const value of ['/arbeitsblaetter/bibliothek','/arbeitsblaetter/bibliothek?klasse=3'])check('safe return '+value,()=>assert.equal(returns.worksheetReturnTo('?returnTo='+encodeURIComponent(value)),value));
for(const value of ['https://evil.test','//evil.test','/arbeitsblaetter/bibliothek/../account','/arbeitsblaetter/bibliothek?x=1','/arbeitsblaetter/bibliothek?klasse=7','javascript:alert(1)'])check('reject redirect '+value,()=>assert.equal(returns.worksheetReturnTo('?returnTo='+encodeURIComponent(value)),null));
let mode='free', downloads=0,authCalls=0,dbCalls=0,lastPath='',corrupt=false;
const future='2099-01-01T00:00:00Z',past='2000-01-01T00:00:00Z';
const mock = {
 auth: { getUser: async token => { authCalls++; return token === 'local-fixture' ? {data:{user:{id:'verified-user'}}} : {data:{user:null},error:true}; } },
 from: table => {
  dbCalls++;
  return {select: () => ({eq: (column,value) => {
   assert.equal(value,'verified-user');
   return {maybeSingle: async () => {
    if(mode==='db-error')return {data:null,error:true};
    if(table==='teacher_accounts')return {data: mode.startsWith('teacher') ? {user_id:'verified-user',school_name:'Fixture',active:mode!=='teacher-revoked',valid_until:mode==='teacher-lapsed'?past:future} : null};
    return {data:{premium:['paid','trial','lifetime','manual','manual-owner','lapsed','invalid-date','cancelled-valid'].includes(mode),premium_until:mode==='lapsed'?past:mode==='invalid-date'?'bad':['lifetime','manual','manual-owner'].includes(mode)?null:future}};
   }};
  }})};
 },
 storage:{from: bucket => {
  assert.equal(bucket,'cleverli-worksheets-20260927');
  return {download: async p => { downloads++;lastPath=p;return {data:new Blob([corrupt?'wrong':fs.readFileSync(path.join(root,p))]),error:null}; }};
 }}
};
process.env.NEXT_PUBLIC_SUPABASE_URL='http://localhost:9999';process.env.SUPABASE_SERVICE_ROLE_KEY='local-fixture-not-a-credential';
const {serveWorksheets}=load('src/lib/worksheets/server.ts',{'server-only':{},'@supabase/supabase-js':{createClient:()=>mock},'./catalogue.json':catalogue,'./access':access});
const req=(query='',token='local-fixture')=>serveWorksheets(new Request('http://localhost/api/worksheets'+query,{headers:token?{authorization:'Bearer '+token}:{}}));
(async()=>{
 for(const [name,token,expected] of [['anonymous','',401],['invalid','invalid',401],['free','local-fixture',403],['lapsed','local-fixture',403],['invalid-date','local-fixture',403],['teacher-lapsed','local-fixture',403],['teacher-revoked','local-fixture',403],['db-error','local-fixture',503]]) {
  mode=name;for(const query of ['', '?id=CL-3-math-brueche&type=worksheet', '?id=CL-3-math-brueche&type=solution']) {const before=downloads;const r=await req(query,token);assert.equal(r.status,expected,name);assert.match(r.headers.get('cache-control'),/private.*no-store/);assert.equal(downloads,before);assert(!(await r.text()).includes('CL-'));count++;}
 }
 for(mode of ['paid','trial','lifetime','manual','manual-owner','cancelled-valid','teacher']) {const r=await req();assert.equal(r.status,200,mode);const body=await r.json();assert.equal(body.topics.length,303);assert(!JSON.stringify(body).includes('sha256'));assert(!JSON.stringify(body).includes('pdfs/'));const d=await req('?id=CL-3-math-brueche&type=worksheet');assert.equal(d.status,200);assert.equal(d.headers.get('content-type'),'application/pdf');assert.match(d.headers.get('content-disposition'),/^attachment; filename="CL-/);assert.match(d.headers.get('cache-control'),/no-store/);assert.equal(d.headers.get('vary'),'Authorization');assert.equal(crypto.createHash('sha256').update(Buffer.from(await d.arrayBuffer())).digest('hex'),catalogue.find(t=>t.id==='CL-3-math-brueche').files.worksheet.sha256);count+=2;}
 mode='paid';
 for(const query of ['?id=../../secret&type=worksheet','?id=%2e%2e%2fsecret&type=solution','?id=CL-3-math-brueche&type=preview','?id=CL-3-math-brueche&type=worksheet&path=pdfs/secret','?id=CL-3-math-brueche&id=other&type=worksheet','?userId=other','?id=CL-3-math-brueche','?type=solution']){const before=downloads;const r=await req(query);assert([400,404].includes(r.status),query);assert.equal(downloads,before);count++;}
 for(const topic of catalogue)for(const [type,file] of Object.entries(topic.files)){const r=await req(`?id=${topic.id}&type=${type}`);assert.equal(r.status,200);assert.equal(lastPath,file.path);assert.equal(crypto.createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex'),file.sha256);count++;}
 corrupt=true;assert.equal((await req('?id=CL-3-math-brueche&type=solution')).status,503);count++;
 console.log(JSON.stringify({passed:count,approvedPDFs:606,canonicalTopics:303,runtimeAliases:63,authCalls,dbCalls,downloads,mutationCalls:0,fixture:'local-only mocked Supabase and storage; no production credentials'}));
})().catch(e=>{console.error(e);process.exit(1)});

// Multiple auth callbacks may fire after the first navigation changes location.search.
const loginSource=fs.readFileSync("src/app/login/LoginClient.tsx","utf8");
assert.match(loginSource,/const \[destination\] = useState\(\(\) => loginDestination\(searchParams\.toString\(\)\)\)/);
assert.doesNotMatch(loginSource,/router\.(?:push|replace)\(loginDestination\(\)\)/);
console.log("PASS login return target remains stable across late auth callbacks");
