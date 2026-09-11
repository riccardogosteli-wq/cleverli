const fs=require('fs'),assert=require('assert/strict');let checks=0;
const page=fs.readFileSync('src/app/lehrpersonen/TeacherPage.tsx','utf8');
for(const text of ['CHF 99 pro Klasse und Jahr','CHF 99 par classe et par an','CHF 99 per classe all’anno','CHF 99 per class per year','Mehrere Lehrpersonen derselben Klasse','Plusieurs enseignants de la même classe','Più docenti della stessa classe','Teachers of the same class']){assert.ok(page.includes(text),text);checks++;}
assert.equal((page.match(/\{c.price\}/g)||[]).length,1);checks++;
for(const text of ['Preis nach Vereinbarung','Your login details remain personal','Verwendet möglichst Spitznamen.']){assert.ok(!page.includes(text));checks++;}
const terms=fs.readFileSync('src/app/agb/AgbClient.tsx','utf8');
for(const text of ['CHF 99.00 pro Klasse und Jahr','CHF 99.00 par classe et par an','CHF 99.00 per classe all’anno','CHF 99.00 per class per year','ohne Aufpreis','sans supplément','senza supplemento','no extra charge','CHF 9.90 / Monat','CHF 99.00 / Jahr','bis zu drei Kinderprofile']){assert.ok(terms.includes(text),text);checks++;}
// Preserve every unrelated legal section exactly versus already deployed teacher release.
const old=require('child_process').execFileSync('git',['show','08c533e:src/app/agb/AgbClient.tsx'],{encoding:'utf8'});
const parts=s=>[...s.matchAll(/heading: "([^"]+)",[\s\S]*?body: `([\s\S]*?)`,/g)].filter(m=>!/^4\.|^5\./.test(m[1])).map(m=>[m[1],m[2]]);
assert.deepEqual(parts(terms),parts(old));checks++;
const route=fs.readFileSync('src/app/internal-log-dashboard/teacher-accounts/route.ts','utf8');assert.ok(route.includes('Schule und Klasse'));assert.ok(route.includes('CHF 99 pro Klasse und Jahr'));checks+=2;
console.log(`${checks} class-price, shared-access, four-language and legal-preservation checks passed.`);
