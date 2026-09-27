const { chromium }=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),crypto=require('crypto');
const BASE='http://127.0.0.1:3147',OUT='.qa/worksheet-library',ROOT=path.resolve('../worksheets/all-grades-2026-09-26');
const catalogue=require('../../src/lib/worksheets/catalogue.json');
const publicTopics=catalogue.map(({files,...t})=>t);
const user={id:'00000000-0000-4000-8000-000000000001',email:'worksheet-local@example.invalid',app_metadata:{provider:'email'},user_metadata:{name:'Local QA'},aud:'authenticated',created_at:'2026-01-01T00:00:00Z'};
const session={access_token:'local-fixture-not-a-real-token',refresh_token:'local-fixture-refresh',token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user};
(async()=>{
 const browser=await chromium.connectOverCDP('http://127.0.0.1:18800');
 const context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
 let premium=true,apiCalls=0;const errors=[],failures=[],downloads=[];
 await context.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin===BASE){
   if(url.pathname==='/api/worksheets'){
    apiCalls++;
    if(!route.request().headers().authorization)return route.fulfill({status:401,json:{error:'Anmeldung erforderlich'}});
    if(!premium)return route.fulfill({status:403,json:{error:'Premium erforderlich'}});
    if(!url.search)return route.fulfill({json:{topics:publicTopics},headers:{'cache-control':'private, no-store'}});
    const t=catalogue.find(t=>t.id===url.searchParams.get('id')),type=url.searchParams.get('type');
    if(!t||!['worksheet','solution'].includes(type))return route.fulfill({status:404,json:{error:'not_found'}});
    return route.fulfill({body:fs.readFileSync(path.join(ROOT,t.files[type].path)),contentType:'application/pdf',headers:{'cache-control':'private, no-store','content-disposition':`attachment; filename="${t.id}-${type}.pdf"`}});
   }
   if(url.pathname.startsWith('/api/'))return route.fulfill({json:{ok:true}}); // no activity/customer mutations
   return route.continue();
  }
  if(url.hostname==='worksheet-fixture.supabase.co') {
   if(url.pathname==='/auth/v1/token')return route.fulfill({json:session});
   if(url.pathname==='/auth/v1/user')return route.fulfill({json:user});
   if(url.pathname.includes('/parent_profiles'))return route.fulfill({json:{id:user.id,name:'Local QA',premium,premium_until:null}});
   if(url.pathname.includes('/teacher_accounts'))return route.fulfill({json:null});
   return route.fulfill({json:[]});
  }
  // Keep this local test entirely offline from analytics, messaging and production.
  return route.fulfill({status:200,body:'',contentType:'application/javascript'});
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('requestfailed',r=>{if(!r.failure()?.errorText.includes('ERR_ABORTED'))failures.push({url:r.url(),error:r.failure()})});
 await page.goto(BASE+'/arbeitsblaetter');await page.getByRole('heading',{name:'Kleine Lernmomente. Auch auf Papier.'}).waitFor();await page.locator('img[src*="beispiel-klasse-3"]').evaluate(i=>i.decode());
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:OUT+'/public-desktop.png',fullPage:true});
 const pdfResponse=await context.request.get(BASE+'/worksheets/beispiel-klasse-3.pdf');assert.equal(pdfResponse.status(),200);assert.match(pdfResponse.headers()['content-type'],/application\/pdf/);assert((await pdfResponse.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
 const samplePromise=page.waitForEvent('download');await page.getByRole('link',{name:'Beispiel herunterladen'}).click();const sample=await samplePromise;const samplePath=await sample.path();assert.equal(crypto.createHash('sha256').update(fs.readFileSync(samplePath)).digest('hex'),catalogue.find(t=>t.id==='CL-3-math-brueche').files.worksheet.sha256);downloads.push('public sample hash matched');
 await page.getByRole('link',{name:'3. Klasse 51 Themen Arbeitsblatt + Lösung',exact:false}).click();await page.getByRole('link',{name:'Anmelden und weiter'}).waitFor();assert((await page.getByRole('link',{name:'Anmelden und weiter'}).getAttribute('href')).includes('klasse%3D3'));
 await page.screenshot({path:OUT+'/gate-desktop.png',fullPage:true});
 await page.getByRole('link',{name:'Anmelden und weiter'}).click();await page.waitForURL('**/login?returnTo=*');
 const loginURL=page.url();assert(loginURL.includes('returnTo='));
 // Exercise actual login UI against local network fixture only.
 await page.locator('input[type=email]').fill(user.email);await page.locator('input[type=password]').fill('local-fixture-not-a-password');
 await page.getByRole('button',{name:/Anmelden|Einloggen|Login/i}).first().click();
 await page.waitForURL('**/arbeitsblaetter/bibliothek?klasse=3');
 await page.getByText('51 von 303 Themen',{exact:false}).waitFor();
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:OUT+'/library-desktop.png',fullPage:false});
 await page.getByLabel('Thema suchen',{exact:true}).fill('Brüche');await page.getByText('1 von 303 Themen',{exact:false}).waitFor();
 for(const [type,label] of [['worksheet','Arbeitsblatt'],['solution','Lösung']]) {
  const event=page.waitForEvent('download');await page.getByRole('button',{name:`${label} herunterladen: Brüche`,exact:true}).click();const d=await event;const b=fs.readFileSync(await d.path());assert.equal(crypto.createHash('sha256').update(b).digest('hex'),catalogue.find(t=>t.id==='CL-3-math-brueche').files[type].sha256);downloads.push(type+' hash matched');await page.getByText('Brüche: Download bereit.').waitFor();
 }
 await page.getByLabel('Thema suchen',{exact:true}).fill('nichtvorhandenxyz');await page.getByRole('heading',{name:'Dazu haben wir kein Thema gefunden.'}).waitFor();
 await page.screenshot({path:OUT+'/empty-state.png',fullPage:false});
 await page.getByRole('button',{name:'Zurücksetzen',exact:true}).click();await page.getByText('303 von 303 Themen',{exact:false}).waitFor();
 await page.getByRole('button',{name:'1. Klasse',exact:true}).click();await page.getByText('36 von 303 Themen',{exact:false}).waitFor();await page.getByRole('combobox',{name:/^Fach/}).selectOption('german');await page.getByText('11 von 303 Themen',{exact:false}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'3. Klasse',exact:true}).click();await page.getByRole('combobox',{name:/^Fach/}).selectOption('math');await page.getByLabel('Thema suchen',{exact:true}).fill('Brüche');await page.getByText('1 von 303 Themen',{exact:false}).waitFor();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.getByRole('navigation',{name:'Mobile Navigation',exact:true}).count(),0);
 await page.screenshot({path:OUT+'/library-mobile.png',fullPage:true});
 premium=false;await page.reload();await page.getByRole('heading',{name:'Alle Arbeitsblätter mit Premium'}).waitFor();await page.getByRole('link',{name:'Premium ansehen',exact:true}).click();await page.waitForURL('**/upgrade?returnTo=*');await page.getByRole('link',{name:'Zurück zu deinen Arbeitsblättern'}).waitFor();
 assert((await page.getByRole('link',{name:'Zurück zu deinen Arbeitsblättern'}).getAttribute('href')).includes('klasse=3'));
 await page.goto(BASE+'/payment/success');await page.getByRole('link',{name:'Zurück zu deinen Arbeitsblättern'}).waitFor();
 await page.goto(BASE+'/arbeitsblaetter');await page.getByRole('heading',{name:'Kleine Lernmomente. Auch auf Papier.'}).waitFor();await page.locator('img[src*="beispiel-klasse-3"]').evaluate(i=>i.decode());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:OUT+'/public-mobile.png',fullPage:true});
 fs.writeFileSync(OUT+'/browser-results.json',JSON.stringify({environment:BASE,fixture:'Isolated managed browser context; local Supabase and API network fixtures only. Real approved PDF bytes. No production auth or writes.',checks:['public desktop/mobile','real public PDF download','login return grade preserved','premium library filters grade/subject/search','empty state/reset','worksheet and solution download hashes','free access gate','upgrade and payment return link','no horizontal overflow'],downloads,apiCalls,errors,expectedDeniedRequests:errors.filter(e=>e.includes('403 (Forbidden)')),unexpectedErrors:errors.filter(e=>!e.includes('403 (Forbidden)')),failures},null,2));
 assert.deepEqual(errors.filter(e=>!e.includes('403 (Forbidden)')),[]);assert.deepEqual(failures,[]);
 await context.close();await browser.close();console.log('PASS browser QA',downloads);
})().catch(e=>{console.error(e);process.exit(1)});
