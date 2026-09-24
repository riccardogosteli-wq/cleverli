import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {getGradeSubjectSeoPage} from '../src/lib/gradeSubjectSeo';
import {matheUebungenKinderConfig,deutschUebungenKinderConfig} from '../src/app/ads/intent/configs';
let checks=0;
const read=(p:string)=>readFileSync(p,'utf8');
const home=read('src/app/page.tsx');assert.ok(home.includes('title: "Lernplattform für die Primarschule Schweiz | Cleverli"'));checks++;
const guide=read('src/app/lernapp-primarschule/page.tsx');
for(const text of ['https://www.cleverli.ch/lernapp-primarschule','CHF 9.90','CHF 99','Zahlungskarte','kein unabhängiger Appvergleich','Internetverbindung','/lehrplanbezug','/datenschutz','/impressum','/lehrpersonen','/mathe-uebungen-5-klasse','/deutsch-uebungen-3-klasse']){assert.ok(guide.includes(text),text);checks++;}
for(const config of [matheUebungenKinderConfig,deutschUebungenKinderConfig])for(const href of ['/','/lernapp-primarschule']){assert.ok(config.relatedLinks?.some(l=>l.href===href));checks++;}
for(const slug of ['mathe-uebungen-5-klasse','deutsch-uebungen-3-klasse']){const p=getGradeSubjectSeoPage(slug)!;assert.equal(p.workedExamples?.length,3);assert.equal(p.faqItems?.length,4);checks+=2;for(const href of ['/','/lernapp-primarschule']){assert.ok(p.extraLinks?.some(l=>l.href===href));checks++;}}
for(const img of ['mathe-beispiel.png','eltern-vorschau.png']){assert.ok(existsSync('public/images/seo/'+img));checks++;}
assert.ok(read('src/components/HomePlatformOverview.tsx').includes('Beispieldaten, keine echten Lernergebnisse'));checks++;
assert.ok(!read('src/app/sitemap.ts').includes('lernapp-primarschule'));checks++;
for(const p of ['src/app/lernapp-primarschule/page.tsx','src/components/HomePlatformOverview.tsx']){assert.ok(!/ohne Kreditkarte|Keine Kreditkarte|ß/.test(read(p)));checks++;}
console.log(`${checks} category SEO assertions passed; GSC and sitemap submission hold preserved`);
