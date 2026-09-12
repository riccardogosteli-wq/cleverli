import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getSubjects, getTopics } from '../src/data/index';
import { KNOWLEDGE_CHOICE_REVIEWS } from '../src/data/knowledgeChoiceReviews';
import { getQuestionForDisplay } from '../src/lib/exerciseQuestionVisuals';
import { localizeExercise } from '../src/lib/exerciseLocalization';
import { getExerciseSpeechText } from '../src/hooks/useVoice';

const reviewed = new Map(KNOWLEDGE_CHOICE_REVIEWS.map(r => [r.key,r]));
assert.equal(reviewed.size, KNOWLEDGE_CHOICE_REVIEWS.length);
const current = new Map<string, ReturnType<typeof getTopics>[number]['exercises'][number]>();
for (let grade=1;grade<=6;grade++) for(const {id:subject} of getSubjects(grade)) for(const topic of getTopics(grade,subject)) for(const exercise of topic.exercises) current.set(`${grade}/${subject}/${topic.id}/${exercise.id}`,exercise);
let localeChecks=0;
for(const [key,review] of reviewed){
 const exercise=current.get(key);assert.ok(exercise,key);assert.equal(exercise.type,'multiple-choice',key);
 assert.equal(exercise.sequentialAnswer,undefined);assert.equal(exercise.altAnswers,undefined);
 for(const lang of ['de','en','fr','it'] as const){
  const localized=localizeExercise(exercise,lang);const copy=review[lang];
  assert.equal(localized.question,getQuestionForDisplay(copy[0],'multiple-choice'),`${key}/${lang}: question`);assert.equal(localized.answer,copy[1],`${key}/${lang}: answer`);
  assert.equal(localized.options?.length,4);assert.equal(new Set(localized.options?.map(s=>s.normalize('NFKC').toLocaleLowerCase().trim())).size,4);
  assert.equal(localized.options?.filter(o=>o===localized.answer).length,1);assert.deepEqual(new Set(localized.options),new Set(copy.slice(1,5)));
  assert.equal(localized.hints.length,2);assert.ok(localized.hints.every(h=>h.trim().length>0));assert.ok(!/___|\[\d\]|Lernrunde/.test(localized.question));
  assert.ok(!localized.options?.some(o=>/Gegenteil des beschriebenen|Version des Begriffs|anderen Fachgebiet/.test(o)));
  const speech=getExerciseSpeechText(exercise,localized,key.split('/')[1],lang);assert.ok(speech);assert.ok(!/___|Lernrunde|Antwort:/.test(speech));
  if(lang==='de')assert.ok(!/ß/.test(JSON.stringify(localized)));
  localeChecks++;
 }
}
const arg=process.argv.indexOf('--baseline');let unchanged=0;
if(arg>=0){
 const baseline: Array<{key:string;exercise:any}>=JSON.parse(fs.readFileSync(process.argv[arg+1],'utf8'));
 assert.equal(current.size,baseline.length);
 for(const before of baseline){const after=current.get(before.key);assert.ok(after,before.key);
  if(!reviewed.has(before.key)){assert.deepEqual(JSON.parse(JSON.stringify(after)),before.exercise,`Unrelated change: ${before.key}`);unchanged++;continue;}
  for(const property of ['id','legacyId','difficulty','free','image','mascot'] as const)assert.deepEqual(after[property],before.exercise[property],`${before.key}: ${property}`);
  assert.equal(before.exercise.type,'fill-in-blank');
 }
}
const grade1Remaining=[...current].map(([key,e])=>[key,localizeExercise(e,'de')] as const).filter(([key,e])=>key.startsWith('1/science/')&&e.type==='fill-in-blank'&&(e.answer.match(/\p{L}+(?:[-’']\p{L}+)*/gu)||[]).length>=3);
assert.equal(grade1Remaining.length,0,'Grade1 NMG long text candidates must all be reviewed');
const grade2Remaining=[...current].map(([key,e])=>[key,localizeExercise(e,'de')] as const).filter(([key,e])=>key.startsWith('2/science/')&&e.type==='fill-in-blank'&&(e.answer.match(/\p{L}+(?:[-’']\p{L}+)*/gu)||[]).length>=3);
assert.equal(grade2Remaining.length,0,'Grade2 NMG long text candidates must all be reviewed');
assert.equal(current.get('2/science/schweiz-symbole/ch47')?.type,'fill-in-blank','Preserve short proper-name retrieval');
const grade3Remaining=[...current].map(([key,e])=>[key,localizeExercise(e,'de')] as const).filter(([key,e])=>key.startsWith('3/science/')&&e.type==='fill-in-blank'&&(e.answer.match(/\p{L}+(?:[-’']\p{L}+)*/gu)||[]).length>=3);
assert.equal(grade3Remaining.length,0,'Grade3 NMG long text candidates must all be reviewed');
const grade4Remaining=[...current].map(([key,e])=>[key,localizeExercise(e,'de')] as const).filter(([key,e])=>key.startsWith('4/science/')&&e.type==='fill-in-blank'&&(e.answer.match(/\p{L}+(?:[-’']\p{L}+)*/gu)||[]).length>=3);
assert.equal(grade4Remaining.length,0,'Grade4 NMG long text candidates must all be reviewed');
const grade5Remaining=[...current].map(([key,e])=>[key,localizeExercise(e,'de')] as const).filter(([key,e])=>key.startsWith('5/science/')&&e.type==='fill-in-blank'&&(e.answer.match(/\p{L}+(?:[-’']\p{L}+)*/gu)||[]).length>=3);
assert.equal(grade5Remaining.length,0,'Grade5 NMG long text candidates must all be reviewed');
assert.equal([...reviewed.keys()].filter(key=>key.startsWith('5/science/')).length,318,'Grade5 scope must match individually reviewed inventory');
const grade6Remaining=[...current].map(([key,e])=>[key,localizeExercise(e,'de')] as const).filter(([key,e])=>key.startsWith('6/science/')&&e.type==='fill-in-blank'&&(e.answer.match(/\p{L}+(?:[-’']\p{L}+)*/gu)||[]).length>=3);
assert.equal(grade6Remaining.length,0,'Grade6 scope exhausted');
assert.equal([...reviewed.keys()].filter(key=>key.startsWith('6/science/')).length,216,'Grade6 exact inventory');
console.log(JSON.stringify({status:'pass',reviewed:reviewed.size,localeChecks,unchanged,grade1Remaining:grade1Remaining.length,grade2Remaining:grade2Remaining.length,grade3Remaining:grade3Remaining.length,grade4Remaining:grade4Remaining.length,grade5Remaining:grade5Remaining.length,grade6Remaining:grade6Remaining.length,total:current.size},null,2));
