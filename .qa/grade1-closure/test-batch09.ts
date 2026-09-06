import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {getSubjects,getTopics} from '../../src/data';
import {localizeExercise} from '../../src/lib/exerciseLocalization';
import {localizeExercise as baseline} from './baselineLocalization';
import {getExerciseSpeechText} from '../../src/hooks/useVoice';
const review={...JSON.parse(fs.readFileSync('.qa/grade1-closure/batch02-review.json','utf8')),...JSON.parse(fs.readFileSync('.qa/grade1-closure/batch03-review.json','utf8'))};
Object.assign(review,JSON.parse(fs.readFileSync('.qa/grade1-closure/batch04-review.json','utf8')));
Object.assign(review,JSON.parse(fs.readFileSync('.qa/grade1-closure/batch05-review.json','utf8')));
Object.assign(review,JSON.parse(fs.readFileSync('.qa/grade1-closure/batch06-review.json','utf8')));
Object.assign(review,JSON.parse(fs.readFileSync('.qa/grade1-closure/batch07-review.json','utf8')));
Object.assign(review,JSON.parse(fs.readFileSync('.qa/grade1-closure/batch08-review.json','utf8')));
Object.assign(review,JSON.parse(fs.readFileSync('.qa/grade1-closure/batch09-review.json','utf8')));
const patch={...JSON.parse(fs.readFileSync('.qa/grade1-closure/batch01-corrections.json','utf8')),...Object.fromEntries(Object.entries(review).map(([id,r]:[string,any])=>[id,r.patch]))};
const findings=JSON.parse(fs.readFileSync('/Users/riccardogosteli/projects/cleverli/.qa/de-only-2026-09-06/direct/grade1-full-review.json','utf8')).remainingFindings;
const notes:Record<string,string>={
 z11:'Target 7 remains on 0–10 line; count from zero replaces answer-centred interval.',
 z16:'Target 2 remains on 0–10 line; removed misleading far-left direction and interval.',
 z20:'Unique option 7 between 6 and 8; count-forward strategy replaces unrelated interval.',
 z32:'Unique answer 2 between 1 and 3; natural semantic question and middle-number strategy.',
 m20x2:'Cards contain numerals, not points. Compare each numeral to 2; exact mapping unchanged.',
 f3:'Triangle has 3 corners; draw and mark corners, removing direct Latin answer cue.',
 f4:'Square has 4 sides; trace perimeter once instead of narrowing numeric answer.',
 f8:'Triangle has 3 sides; count segments rather than reveal three; speech asks count.',
 f10:'Rectangle has 4 sides; paper-edge tracing replaces answer interval.',
 f12:'Circle has 0 corners; inspect curved outline, removing negative-number hint and answer leak.',
 f14:'Square has 4 equal sides; draw/compare/count instead of answer interval.',
 f15:'Rectangle has 4 corners; count joins of edges rather than answer interval.',
 f17:'Only Quadrat among Kreis/Dreieck/Quadrat/Oval satisfies four equal sides plus right angles; hints now inspect these properties.',
 f19:'Disjoint triangle and square: 3+4=7 corners; drawing/count-on hints and natural speech.',
 f24:'Viereck has 4 corners; count drawn corners instead of spelling out answer or interval.',
 f28:'Explicit front-view roof outline has two slopes and a base: triangle. Removed ambiguous generic roof and grammar-check hint.',
 f30:'Closed flat figures with exclusively straight boundary segments are Vielecke; excluded open figures and solids in prompt.',
 f31:'Triangle has 3 interior angles; link each corner to one angle, not answer interval.',
 f33:'Chessboard cells are squares; retained required plural Quadrate and prompts about equal sides/corners.',
 f34:'Five-corner closed polygon has 5 sides; count segments instead of direct answer cue.',
 f35:'Disjoint triangle plus quadrilateral gives 7 corners; count-on strategy and natural speech replace equation reading.',
 f39:'Hard-level replacement compares four pairs: corner totals 7/4/6/8; unique Dreieck und Quadrat. Both options and key replaced together.',
 f40:'Hard-level replacement counts two disjoint squares: 4+4=8 sides; numeric key updated, no stale alternatives exist.',
 f41:'Hard task now applies exclusion rule to four shapes; only circle has no straight edge. Key/options unchanged.',
 f42:'Infer corner count one beyond square (4+1=5), then name Fünfeck; replaces mere repetition and explicit answer hint.',
 f43:'Rotation preserves side lengths/right angles: square stays Quadrat. Infer invariance rather than repeat basic shape identification.',
 f44:'Two disjoint triangles have 3+3=6 sides; multi-form counting replaces hard-level name-to-number repetition; key remains 6.',
 f48:'Three disjoint forms: square+triangle+circle have 4+3+0=7 corners; numeric key replaces Kreis consistently.',
 f50:'Missing-form inference: 7−4=3 corners; among circle/triangle/rectangle only triangle. Existing key Dreieck retained.',
 m5:'All 70 visually indistinguishable four/four distributions now accepted; default exact-ID scoring preserved, distinct visuals and invalid placements rejected. Browser verification still pending.',
};
Object.assign(notes,Object.fromEntries(Object.entries(review).map(([id,r]:[string,any])=>[id,r.note])));
let checked=0,unchanged=0;const ledger:any[]=[];
const hash=(x:unknown)=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
for(let grade=1;grade<=6;grade++) for(const subject of getSubjects(grade)) for(const topic of getTopics(grade,subject.id)) for(const source of topic.exercises) for(const lang of ['de','en','fr','it'] as const) {
 const before=baseline(source,lang),after=localizeExercise(source,lang);checked++;
 const expected=grade===1&&subject.id==='math'&&lang==='de'&&(patch[source.id]||source.id==='m5');
 if(!expected){assert.deepEqual(after,before,`${grade}/${subject.id}/${source.id}/${lang} unexpected delta`);unchanged++;continue;}
 const delta=patch[source.id]??{interchangeableDragItems:true,hints:['Lege abwechselnd eine Erdbeere auf jeden Teller.','Prüfe am Schluss: Liegen auf beiden Tellern gleich viele Erdbeeren?']};
 assert.deepEqual(after,{...before,...delta},source.id+' exact delta');
 assert.ok(notes[source.id]);assert.ok(findings[source.id]);
 if(after.type==='multiple-choice') assert.equal(after.options?.filter(x=>x===after.answer).length,1,source.id+' unique key');
 assert.equal(after.difficulty,before.difficulty);assert.equal(after.type,before.type);
 const speech=getExerciseSpeechText(source,after,subject.id,'de');
 if(delta.spokenPrompt) assert.equal(speech,delta.spokenPrompt,source.id+' speech');
 ledger.push({key:`${grade}/${subject.id}/${topic.id}/${source.id}`,id:source.id,findings:findings[source.id],note:notes[source.id],beforeHash:hash(before),afterHash:hash(after),before,after,speech,changedFields:Object.keys(delta),status:'source_corrected_tested',browserTested:false,sheetSynced:false,deployed:false});
}
assert.equal(ledger.length,264);
const result={baseline:'4c30131',checked,unchanged,sourceCorrectedTested:ledger.length,remainingWithoutCandidate:264-ledger.length,browserTested:0,sheetSynced:0,deployed:0,subjectStatus:'changes_requested'};
fs.writeFileSync('.qa/grade1-closure/batch09-ledger.json',JSON.stringify({at:new Date().toISOString(),...result,records:ledger},null,2));
console.log(JSON.stringify(result));
