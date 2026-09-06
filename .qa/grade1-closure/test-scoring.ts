import assert from 'node:assert/strict';
import fs from 'node:fs';
import { scoreDropZones } from '../../src/lib/dragDropScoring.ts';
const rows = fs.readFileSync('.qa/grade1-closure/current-de.jsonl','utf8').trim().split('\n').map(x=>JSON.parse(x));
const e = rows.find(r=>r.key==='1/math/mengen-zaehlen/m5').content;
let equivalent=0, exact=0;
for(let mask=0;mask<256;mask++) {
 const placed:{[key:string]:string[]}={t1:[],t2:[]};
 e.dragItems.forEach((item:{id:string},i:number)=>placed[mask&(1<<i)?'t1':'t2'].push(item.id));
 const result=Object.values(scoreDropZones(e.dragItems,e.dropZones,e.dropAnswers,placed,true)).every(Boolean);
 assert.equal(result,placed.t1.length===4,`distribution ${mask}`); equivalent+=Number(result);
 const strict=Object.values(scoreDropZones(e.dragItems,e.dropZones,e.dropAnswers,placed)).every(Boolean);
 assert.equal(strict,mask===15);exact+=Number(strict);
}
const ok={t1:['e5','e6','e7','e8'],t2:['e1','e2','e3','e4']};
for(const field of ['label','image','emoji']) {
 const items=e.dragItems.map((item:{id:string})=>({...item,...(item.id==='e1'?{[field]:'different'}:{})}));
 assert.equal(Object.values(scoreDropZones(items,e.dropZones,e.dropAnswers,ok,true)).every(Boolean),false,field);
}
for(const placed of [
 {t1:['e1','e1','e2','e3'],t2:['e5','e6','e7','e8']},
 {t1:['unknown','e2','e3','e4'],t2:['e5','e6','e7','e8']},
 {...ok,unknown:[]}, {t1:[],t2:[]}, {t1:['e1'],t2:[]},
]) assert.equal(Object.values(scoreDropZones(e.dragItems,e.dropZones,e.dropAnswers,placed,true)).every(Boolean),false);
assert.equal(e.interchangeableDragItems,true);
console.log(JSON.stringify({distributions:256,equivalentAccepted:equivalent,exactAccepted:exact,distinctVisualFieldsRejected:3,invalidOrIncompleteRejected:5}));
