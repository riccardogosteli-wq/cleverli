import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getTopics,getSubjects} from '../../src/data';
import {localizeExercise} from '../../src/lib/exerciseLocalization';
import {getExerciseSpeechText} from '../../src/hooks/useVoice';
import {matchOrderedTextAnswer} from '../../src/lib/fillInBlankMatching';
import {applyGrade1DeutschQaCorrections} from '../../src/lib/grade1DeutschQaCorrections';
const base=JSON.parse(fs.readFileSync('.qa/grade1-german/baseline.json','utf8'));
const topics=getTopics(1,'german'); const records=topics.flatMap(t=>t.exercises.map(s=>({t,s,e:localizeExercise(s,'de')})));
assert.equal(topics.length,11);assert.equal(records.length,550);
const by=new Map(records.map(x=>[x.e.id,x]));let checks=0;
for(const b of base){const {s,e}=by.get(b.content.id)!;assert.ok(e);for(const k of ['id','type','difficulty','free'])assert.equal(e[k as keyof typeof e],b.content[k],`${e.id}/${k}`);assert.equal(e.hints.length,2);assert.ok(e.hints.every(h=>h.trim()));assert.ok(!JSON.stringify({question:e.question,hints:e.hints,answer:e.answer,options:e.options}).includes('ß'),e.id+' Swiss spelling');if(e.type==='multiple-choice'){assert.equal(e.options!.filter(o=>o===e.answer).length,1);assert.equal(new Set(e.options).size,e.options!.length);}if(e.type==='drag-drop'){assert.equal(Object.keys(e.dropAnswers!).length,e.dragItems!.length);for(const item of e.dragItems!)assert.ok(e.dropZones!.some(z=>z.id===e.dropAnswers![item.id]));}if(e.image)assert.ok(fs.existsSync('public'+e.image),e.image);assert.ok(getExerciseSpeechText(s,e,'german','de').length>0,e.id+' speech');checks++;}
let untouched=0;for(let g=1;g<=6;g++)for(const subject of getSubjects(g))for(const t of getTopics(g,subject.id))for(const e of t.exercises){if(g===1&&subject.id==='german')continue;assert.equal(applyGrade1DeutschQaCorrections(e),e,`outside-scope collision ${g}/${subject.id}/${e.id}`);untouched++;}
const e=(id:string)=>by.get(id)!.e;
assert.equal(e('b45').answer,'KATE');assert.equal(e('r32').answer,'bloss');assert.equal(e('r49').answer,'Wangen');assert.ok(!e('sk26').options!.includes('Sonnenschein'));assert.ok(!e('sk30').options!.includes('Einhorn'));assert.equal(e('ew1').image,'/images/animals/Katze.svg');
for(const id of ['gk6','gk9','gk28','gk50','b29'])assert.equal(e(id).caseSensitiveAnswer,true,id);
for(const id of ['ew37','ew48','sl18','sl26','sl30','g1gs28']){assert.ok(e(id).altAnswers!.length);for(const alt of e(id).altAnswers!)assert.ok([e(id).answer,...e(id).altAnswers!].some(a=>matchOrderedTextAnswer(alt,a)));}
const syllables:Record<string,number>={HUND:1,KATZE:2,SCHMETTERLING:3,BLUME:2,SONNE:2,FISCH:1,SCHULE:2,APFEL:2,HAUS:1,ELEFANT:3,VOGEL:2,BALL:1,TAGEBUCH:3,KIND:1,BUCH:1,SONNENBLUME:4,WASSERFALL:3,REGENSCHIRM:3,HASENOHR:3,ERDBEERE:3,SCHOKOLADE:4,FAHRRAD:2,KROKODIL:3,ZITRONE:3,HIMBEERE:3,TAFEL:2,ZWILLING:2,SCHOKO:2,STRASSE:2,KÄSE:2,ABENTEUER:4,TOMATE:3,KAISER:2,REGENBOGEN:4,KIRSCHE:2,EICHHÖRNCHEN:3,KINDERZIMMER:4,SCHWIMMBAD:2};
for(const {t,e} of records){if(t.id==='silben-klatschen'&&e.question.includes('«')){const word=e.question.match(/«([^»]+)»/)![1];assert.equal(Number(e.answer),syllables[word],e.id+word);}if(t.id==='abc-reihenfolge'&&e.type!=='drag-drop'){const previous=e.question.match(/nach «([A-Z])»/)?.[1]??e.question.match(/fehlt\? ([A-Z]),/)?.[1];assert.ok(previous,e.id);assert.equal(e.answer,String.fromCharCode(previous!.charCodeAt(0)+1),e.id);}if(t.id==='ie-ei'&&e.type!=='drag-drop'){const word=e.question.match(/«([^»]+)»/)![1];assert.equal(e.answer,word[0].toUpperCase(),e.id);assert.ok(!e.question.includes('Welchen Laut'),e.id);}}
const result={structuralReviewed:checks,outsideScopeUnchanged:untouched,semanticAssertions:'passed',releaseCertified:false};fs.writeFileSync('.qa/grade1-german/test-review-result.json',JSON.stringify(result,null,2));console.log(result);
