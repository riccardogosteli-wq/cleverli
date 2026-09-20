import assert from 'node:assert/strict';
import { getLehrplanOverview, getLehrplanSchema } from '../src/lib/lehrplanOverview';
import { LEHRPLAN_LANGS, lehrplanCopy, lehrplanUrl } from '../src/lib/lehrplanCopy';
import { getLehrplanTopicTitle } from '../src/lib/lehrplanTopicTitles';
import sitemap from '../src/app/sitemap';
const de = getLehrplanOverview();
for (const lang of LEHRPLAN_LANGS) {
 const rows = getLehrplanOverview(lang); const schema = getLehrplanSchema(rows, lang); const c = lehrplanCopy[lang];
 assert.equal(schema.inLanguage,c.locale); assert.equal(schema.url,lehrplanUrl(lang)); assert.equal(schema.mainEntity.numberOfItems,303);
 assert(sitemap().some(r=>r.url===lehrplanUrl(lang)));
 assert(c.scope.includes('Lehrplan 21') && c.scope.includes('Piano di studio'));
 rows.forEach((r,i)=>r.subjects.forEach((s,j)=>s.topics.forEach((t,k)=>{
   const base=de[i].subjects[j].topics[k];assert.deepEqual(t.codes,base.codes);assert.equal(t.count,base.count);
   assert.equal(t.title,getLehrplanTopicTitle(t.id,lang,base.title));
   const item=schema.mainEntity.itemListElement.find(e=>e.item.url===t.url+(lang==='de'?'':`?lang=${lang}`))!.item;
   assert.equal(item.name,t.title);assert.equal(item.about,s.name);assert.equal(item.inLanguage,c.locale);
 })));
 console.log(lang, 'PASS 303 topic mappings, localized titles/schema, scope and discoverable URL');
}

for (const l of ["fr","it","en"] as const) assert.notEqual(getLehrplanTopicTitle("digitale-spuren-3",l,"Digitale Spuren"),"Digitale Spuren");

for (const l of ['fr','it','en'] as const) {
 for (const r of getLehrplanOverview(l)) {
  const mi=r.subjects.find(s=>s.id==='mi');
  for (const t of mi?.topics ?? []) assert(!/Digitale Spuren|Algorithmen im Alltag|Informationen prüfen|Programme & Befehle|Sicher online|Daten verstehen|Feeds & Algorithmen|Netzwerke & Sicherheit/.test(t.title));
 }
}
for (const l of ['it','en'] as const) assert.notEqual(getLehrplanTopicTitle('bonjour-classe-3',l,'Bonjour et la classe'),'Bonjour et la classe');
