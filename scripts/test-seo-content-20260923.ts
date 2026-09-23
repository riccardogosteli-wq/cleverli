import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { withPageSocial } from '../src/lib/pageSocialMetadata';
import { getTopicsForSubject } from '../src/data';
import { GRADE_SUBJECT_SEO_PAGES } from '../src/lib/gradeSubjectSeo';
import { matheUebungenKinderConfig, deutschUebungenKinderConfig } from '../src/app/ads/intent/configs';
let checks = 0;
for (const slug of ['mathe-uebungen-5-klasse', 'deutsch-uebungen-3-klasse']) {
 const p = GRADE_SUBJECT_SEO_PAGES.find(p => p.slug === slug)!;
 assert.equal(p.workedExamples?.length, 3); assert.equal(p.faqItems?.length,4); checks+=2;
 for (const sample of p.workedExamples!) {
  const t = getTopicsForSubject(p.grade,p.subject).find(t=>t.id===sample.topicId)!;
  const e = t.exercises.find(e=>e.id===sample.exerciseId)!;
  assert.ok(e?.question); assert.ok(e?.answer); assert.ok(sample.explanation.length>60); checks+=3;
  if(e.options){assert.equal(e.options.filter(o=>o===e.answer).length,1);checks++;}
 }
 const config = slug.startsWith('mathe') ? matheUebungenKinderConfig : deutschUebungenKinderConfig;
 assert.ok(config.relatedLinks?.some(l=>l.href===p.href));checks++;
}
assert.equal(matheUebungenKinderConfig.title,'Mathe üben für die Schweizer Primarschule');checks++;
assert.equal(GRADE_SUBJECT_SEO_PAGES.filter(p=>p.workedExamples).length,2);checks++;
const pageSource = readFileSync('src/app/mathe-uebungen-kinder/page.tsx','utf8');
const title = pageSource.match(/title: "([^"]+)"/)?.[1];
assert.equal(title,'Mathe Übungen für Kinder der 1. bis 6. Klasse');
const social=withPageSocial({title});
assert.equal(social.openGraph?.title,title);assert.equal(social.twitter?.title,title);checks+=3;
assert.equal(matheUebungenKinderConfig.trialTitle,matheUebungenKinderConfig.title);checks++;
console.log(`${checks} SEO content assertions passed`);
