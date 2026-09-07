import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getTopics} from '../../src/data';
import {localizeExercise} from '../../src/lib/exerciseLocalization';
const rows=getTopics(1,'science').flatMap(t=>t.exercises.map(s=>({topic:t.id,e:localizeExercise(s,'de')})));
const byId=new Map(rows.map(r=>[r.e.id,r.e]));
const key=(id:string,answer:string)=>assert.equal(byId.get(id)?.answer,answer,id);
for(const [id,answer] of Object.entries({t22:'Raupe',k12:'Beine',k20:'schlafen',p35:'Gemüse, dessen Wurzeln wir essen',p39:'Nadelbaum',fg19:'Bern',ph8:'stossen',ph13:'stärker',wm32:'365',wm50:'365',j23:'Grad Celsius',u26:'6:15','g1-science-fuenf-sinne-s22':'Hören'}))key(id,answer);
assert.equal(byId.get('ph8')?.question.replace('___',byId.get('ph8')!.answer),'Wenn zwei gleiche Magnetpole zusammenkommen, stossen sie sich ab.');
assert.ok(byId.get('j28')?.altAnswers?.includes('rot'));
assert.ok(byId.get('ph13')?.altAnswers?.includes('fester'));
for(const id of ['wm32','wm50'])assert.ok(byId.get(id)?.question.includes('kein Schaltjahr'));
for(const id of ['j32','u26','wm17','ph23'])assert.ok(!byId.get(id)?.sequentialAnswer);
const memory=rows.filter(r=>r.e.type==='memory');assert.equal(memory.length,8);
for(const {e} of memory){assert.equal(e.question,'Finde immer zwei gleiche Karten!');assert.ok(e.hints[1].includes('demselben Bild'));}
for(const topic of ['sinne','wetter-klima']){const count=[0,0,0,0];for(const {e} of rows.filter(r=>r.topic===topic&&r.e.type==='multiple-choice'))count[e.options!.indexOf(e.answer)]++;assert.ok(Math.max(...count)-Math.min(...count)<=1,JSON.stringify(count));}
fs.writeFileSync('.qa/grade1-nmg/final-semantics-result.json',JSON.stringify({status:'pass',answerKeys:13,memoryInstructions:8,balancedTopics:2,obsoleteScoringModesRemoved:4,acceptedAlternatives:2,nonLeapYearQuestions:2},null,2));console.log('PASS final NMG semantics:13 independent keys,8 memory instructions,2 balanced topics,4 scoring modes,2 accepted alternatives,2 non-leap-year questions');
