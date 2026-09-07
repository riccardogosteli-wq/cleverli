import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getTopics as current} from '../../src/data';
import {getTopics as baseline} from '../../../grade1-german-review/src/data';
import {localizeExercise as locCurrent} from '../../src/lib/exerciseLocalization';
import {localizeExercise as locBase} from '../../../grade1-german-review/src/lib/exerciseLocalization';
const a=baseline(1,'science'), b=current(1,'science');
let checked=0;const deltas=[];
for(const lang of ['fr','it','en'] as const)for(let t=0;t<a.length;t++)for(let n=0;n<a[t].exercises.length;n++){
const old=locBase(a[t].exercises[n],lang),now=locCurrent(b[t].exercises[n],lang);checked++;
try{assert.deepEqual(now,old)}catch{deltas.push({lang,topic:a[t].id,id:old.id,fields:Object.keys(now).filter(k=>JSON.stringify(now[k as keyof typeof now])!==JSON.stringify(old[k as keyof typeof old]))});}
}
fs.writeFileSync('.qa/grade1-nmg/locale-isolation.json',JSON.stringify({checked,deltas,status:deltas.length?'fail':'pass'},null,2));assert.equal(deltas.length,0,JSON.stringify(deltas.slice(0,6)));console.log('PASS '+checked+' foreign-localized exercises unchanged');
