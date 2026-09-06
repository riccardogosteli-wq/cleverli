import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.QA_BASE_URL || 'http://localhost:3106';
const out = '.qa/daily-ranks';
for(let i=0;i<30;i++) { try { const response=await fetch(base); if(response.ok) break; } catch {} if(i===29) throw new Error('QA server unavailable'); await new Promise(r=>setTimeout(r,500)); }
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1365, height: 1000 }, locale: 'de-CH' });
const errors = [], failures = [], speech = [];
// Local fictional session only. No customer identity, no remote writes.
await context.route('**/*', async route => {
 const url = new URL(route.request().url());
 if (url.origin !== new URL(base).origin) return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
 if (url.pathname.startsWith('/api/') && url.pathname !== '/api/daily-challenge') {
  if (url.pathname === '/api/tts') {
   speech.push(url.searchParams.get('text'));
   // A valid tiny WAV fixture exercises the shared decoder without paid TTS.
   const wav = Buffer.alloc(48); wav.write('RIFF'); wav.writeUInt32LE(40,4); wav.write('WAVEfmt ',8); wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22); wav.writeUInt32LE(8000,24); wav.writeUInt32LE(16000,28); wav.writeUInt16LE(2,32); wav.writeUInt16LE(16,34); wav.write('data',36); wav.writeUInt32LE(4,40);
   return route.fulfill({ status: 200, contentType: 'audio/mpeg', body: wav });
  }
  return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
 }
 return route.continue();
});
await context.addInitScript(() => {
 if (localStorage.getItem('qa-seeded')) return;
 localStorage.setItem('qa-seeded','1');
 localStorage.setItem('cleverli_session', JSON.stringify({ email: 'daily-ranks@example.invalid', name: 'QA', premium: true }));
 let hash=5381; for(const c of 'daily-ranks@example.invalid') hash=(hash*33)^c.charCodeAt(0);
 const scope=`account_${(hash>>>0).toString(36)}`;
 localStorage.setItem('qa-scope', scope);
 localStorage.setItem(`cleverli_active_profile__${scope}`, 'qa-child-a');
 localStorage.setItem(`cleverli_family__${scope}`, JSON.stringify({ members: [{ id:'qa-child-a', name:'QA Kind', avatar:'🐻', grade:1, createdAt:new Date().toISOString() }] }));
 localStorage.setItem(`cleverli_last_grade__${scope}`, '1');
 localStorage.setItem('cleverli_cookie_consent','accepted');
 localStorage.setItem('cleverli_lang','de');
});
const page = await context.newPage();
page.on('pageerror', e => errors.push(e.message));
page.on('requestfailed', r => { if (!r.failure()?.errorText.includes('ERR_ABORTED')) failures.push(`${r.url()} ${r.failure()?.errorText}`); });
let type = 'multiple-choice';
const fixture = () => ({ exercise: { id:`qa-${type}`, type, question: type === 'counting' ? 'Wie viele Sterne siehst du?' : type === 'self-review' ? 'Schreibe einen Satz über deine Katze.' : 'Welche Gruppe hat mehr: 3 Pizzen oder 5 Pizzen?', answer: type === 'counting' ? '5' : type === 'self-review' ? 'Meine Katze schläft.' : '5 Pizzen', options: type === 'counting' ? ['3','5','4'] : ['3 Pizzen','5 Pizzen','Beide gleich','Keine davon'], hints:['Vergleiche die beiden Gruppen.'], difficulty:1, emoji:'⭐', reviewCriteria:['Mein Satz beginnt gross.'] }, subject:'math', topic:{id:'qa-topic',title:'Vergleichen',emoji:'🍕'} });
await context.route('**/api/daily-challenge?*', r => r.fulfill({json: fixture()}));
async function clearDaily() {
 await page.evaluate(() => { for (const k of Object.keys(localStorage)) if(k.startsWith('cleverli_daily') || k.startsWith('cleverli_profile_')) localStorage.removeItem(k); });
}
async function answer(text) {
 await page.locator('button[data-answer]').filter({ hasText:text }).click();
 await page.getByRole('button', { name: /Prüfen|Überprüfen|Kontrollieren|Antwort prüfen/ }).click();
}
async function xp() { return page.evaluate(() => JSON.parse(localStorage.getItem(`cleverli_profile_qa-child-a__${localStorage.getItem('qa-scope')}`) || '{}').xp || 0); }
try {
 await page.goto(`${base}/daily`);
 await page.getByText('Welche Gruppe hat mehr: 3 Pizzen oder 5 Pizzen?',{exact:true}).waitFor();
 await Promise.all([page.waitForResponse(r => r.url().includes('/api/tts')), page.getByRole('button', {name: /vorlesen/i}).click()]);
 assert.ok(speech[0]?.includes('Pizzen'));
 for(let i=0;i<3;i++) {
  await answer('3 Pizzen');
  await page.getByRole('button', {name:'Noch einmal versuchen'}).waitFor();
  assert.equal(await xp(),0);
  await page.getByText('Welche Gruppe hat mehr: 3 Pizzen oder 5 Pizzen?', {exact:true}).waitFor();
  await page.screenshot({path:`${out}/daily-wrong-${i}.png`,fullPage:true});
  await page.getByRole('button',{name:'Noch einmal versuchen'}).click();
 }
 await page.reload(); await page.locator('button[data-answer]').first().waitFor();
 await answer('5 Pizzen');
 await page.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor();
 assert.equal(await xp(),50);
 await page.screenshot({path:`${out}/daily-complete-desktop.png`,fullPage:true});
 await page.reload(); await page.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor();
 assert.equal(await xp(),50); assert.equal(await page.locator('button[data-answer]').count(),0);
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:`${out}/daily-review-mobile.png`,fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await clearDaily();
 await page.evaluate(() => { const scope=localStorage.getItem('qa-scope'); const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()); localStorage.setItem(`cleverli_daily__${scope}__child_qa-child-a`,JSON.stringify({date,completed:true,correct:false})); });
 await page.reload(); await page.locator('button[data-answer]').first().waitFor();
 await answer('5 Pizzen'); await page.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor(); assert.equal(await xp(),50);
 for (type of ['fill-in-blank','counting','self-review']) {
  await clearDaily(); await page.reload();
  if(type==='fill-in-blank') {
   await page.locator('main input').fill('wrong'); await page.getByRole('button',{name:/Prüfen|Überprüfen|Kontrollieren|Antwort prüfen/}).click();
   await page.getByRole('button',{name:'Noch einmal versuchen'}).click();
   await page.locator('main input').fill('5 Pizzen'); await page.getByRole('button',{name:/Prüfen|Überprüfen|Kontrollieren|Antwort prüfen/}).click();
  } else if(type==='counting') {
   await answer('5');
  } else {
   await page.locator('textarea').fill('Meine Katze schläft.'); await page.getByRole('button',{name:/Antwort.*prüfen|Überprüfen|Vergleichen|anschauen/i}).click();
   await page.getByRole('button',{name:/passt/i}).dblclick();
  }
  await page.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor(); assert.equal(await xp(),50);
  await page.reload(); await page.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor(); assert.equal(await xp(),50);
 }
 // Two tabs race on the same child/day: exactly one profile award.
 type='multiple-choice'; await clearDaily(); await page.reload();
 const second = await context.newPage(); await second.goto(`${base}/daily`);
 await page.locator('button[data-answer="5 Pizzen"]').click();
 await second.locator('button[data-answer="5 Pizzen"]').click();
 await Promise.all([page.getByRole('button',{name:'Überprüfen ✓'}).click(), second.getByRole('button',{name:'Überprüfen ✓'}).click()]);
 await page.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor();
 await second.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor();
 assert.equal(await xp(),50); await second.close();
 // Active-child change opens a separate daily task without losing A's review.
 await page.evaluate(()=>{localStorage.setItem(`cleverli_active_profile__${localStorage.getItem('qa-scope')}`,'qa-child-b');window.dispatchEvent(new Event('cleverli-active-profile-change'));});
 await page.locator('button[data-answer="5 Pizzen"]').waitFor();
 await answer('5 Pizzen'); await page.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor();
 assert.equal(await xp(),50);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem(`cleverli_profile_qa-child-b__${localStorage.getItem('qa-scope')}`)||'{}').xp),50);
 await page.evaluate(()=>{localStorage.setItem(`cleverli_active_profile__${localStorage.getItem('qa-scope')}`,'qa-child-a');window.dispatchEvent(new Event('cleverli-active-profile-change'));});
 await page.getByRole('region',{name:'Aufgabe und Lösung'}).waitFor();
 await page.evaluate(()=>{ const key=`cleverli_profile_qa-child-a__${localStorage.getItem('qa-scope')}`; const p=JSON.parse(localStorage.getItem(key)||'{}'); p.xp=1235; localStorage.setItem(key,JSON.stringify(p)); });
 await page.goto(`${base}/missionen`); await page.getByRole('region',{name:'Deine Ränge'}).waitFor();
 await page.getByText('65 XP → Cleverli-Meister',{exact:true}).waitFor();
 assert.equal(await page.locator('[aria-current="step"]').innerText().then(t=>t.includes('Cleverli-Star')),true);
 assert.equal(await page.getByRole('progressbar',{name:'XP'}).getAttribute('value'),'89');
 assert.equal(await page.getByRole('region',{name:'Deine Ränge'}).locator('li').count(),5);
 await page.screenshot({path:`${out}/ranks-mobile.png`,fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.setViewportSize({width:1365,height:1000}); await page.screenshot({path:`${out}/ranks-desktop.png`,fullPage:true});
 await page.goto(`${base}/trophies`); await page.getByRole('region',{name:'Deine Ränge'}).waitFor();
 assert.deepEqual(errors,[]); assert.deepEqual(failures,[]);
 console.log(JSON.stringify({status:'passed',errors,failures,speech,checks:'3 wrong retries, reload, legacy wrong, +50 XP once (30 daily +10 answer +10 first-answer achievement), all four renderers, persistent review, self-review double submit, simultaneous tabs, live child switch/isolation, ranks desktop/mobile, trophies alias, overflow'},null,2));
} finally { fs.writeFileSync(`${out}/browser-diagnostics.json`,JSON.stringify({errors,failures,speech},null,2)); await browser.close(); }
