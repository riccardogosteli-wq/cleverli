const fs = require('node:fs');
const assert = require('node:assert/strict');
const root = '.next/server/app/';
const base = process.env.SEO_QA_BASE || 'http://localhost:3109';
(async()=>{
const sitemapResponse=await fetch(base+'/sitemap.xml');assert.equal(sitemapResponse.status,200);
const sitemap=await sitemapResponse.text();
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
const paths=[...new Set([...urls.map(x=>new URL(x).pathname),'/reset-password','/test/roadmap'])];
const pages=new Map();let next=0;
await Promise.all(Array.from({length:4},async()=>{while(next<paths.length){const path=paths[next++];const response=await fetch(base+path);assert.equal(response.status,200,path);pages.set(path==='/'?'index':path.slice(1),await response.text());}}));
const html=p=>{assert.ok(pages.has(p),p);return pages.get(p);};
const meta = (h, name) => h.match(new RegExp(`<meta name="${name}" content="([^"]*)"`))?.[1];
const title = h => h.match(/<title>(.*?)<\/title>/s)?.[1];
const blocks = h => [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(x=>JSON.parse(x[1]));
let checks=0;
for(const p of ['reset-password','test/roadmap']) {
 assert.match(meta(html(p),'robots'),/noindex/); checks++;
 assert.match(meta(html(p),'robots'),/nofollow/); checks++;
}
for(let grade=1;grade<=6;grade++) for(const [subject,label] of [['math','mathe'],['german','deutsch']]) {
 const hub=html(`learn/${grade}/${subject}`);
 assert.match(title(hub),/Themenübersicht/);checks++;
 const file=root+`${label}-uebungen-${grade}-klasse.html`;
 if(fs.existsSync(file)){assert.notEqual(title(hub),title(fs.readFileSync(file,'utf8')));checks++;}
}
const offer=blocks(html('lehrpersonen')).find(x=>x['@id']==='https://www.cleverli.ch/lehrpersonen#offer');
assert.equal(offer.price,'99');assert.equal(offer.priceCurrency,'CHF');assert.equal(offer.priceSpecification.referenceQuantity.unitCode,'ANN');checks+=3;
assert.match(offer.description,/pro Klasse und Jahr/);assert.match(offer.description,/Mehrere Lehrpersonen derselben Klasse/);checks+=2;
assert.match(offer.description,/auf Anfrage/);checks++;
const home=blocks(html('index'));
const app=home.flatMap(x=>x['@graph']||[]).find(x=>x['@type']==='SoftwareApplication');
assert.equal(app.offers[0].description,'Die ersten 20 Aufgaben kostenlos testen');checks++;
assert.match(fs.readFileSync('src/components/ExercisePlayer.tsx','utf8'),/const FREE_EXERCISE_LIMIT = 20;/);checks++;
assert.deepEqual(app.offers.map(x=>x.price),['0','9.90','99','249']);checks++;
assert.equal(urls.length,362);assert.equal(new Set(urls).size,362);checks+=2;
assert.ok(urls.includes('https://www.cleverli.ch/lehrpersonen'));checks++;
assert.ok(!urls.some(x=>/\/(reset-password|test)(\/|$)/.test(x)));checks++;
const titles=new Set();
for(const url of urls){let p=new URL(url).pathname.slice(1)||'index';const h=html(p);assert.ok(!meta(h,'robots')?.includes('noindex'));const t=title(h);assert.ok(t&&!titles.has(t),`duplicate or missing title: ${url}: ${t}`);titles.add(t);blocks(h);checks+=3;}
console.log(`${checks} rendered SEO assertions passed, including362 unique canonical sitemap titles, teacher offer, helper noindex and unchanged family/free offers.`);

})().catch(error=>{console.error(error);process.exitCode=1;});
