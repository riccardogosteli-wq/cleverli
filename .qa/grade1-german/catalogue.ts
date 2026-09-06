import fs from 'node:fs';import crypto from 'node:crypto';
import {getSubjects,getTopics} from '../../src/data';
import {localizeExercise} from '../../src/lib/exerciseLocalization';
import {getExerciseSpeechText} from '../../src/hooks/useVoice';
import type {Lang} from '../../src/lib/i18n';
const out='.qa/grade1-german/';const rows:any[]=[];const counts:any={};
for(let grade=1;grade<=6;grade++)for(const subject of getSubjects(grade))for(const topic of getTopics(grade,subject.id))for(const source of topic.exercises){const e=localizeExercise(source,'de');const language:Lang=source.listeningText?source.listeningLanguage??'de':subject.id==='english'?'en':subject.id==='french'?'fr':'de';const content=Object.fromEntries(Object.entries(e).filter(([k])=>!/(EN|FR|IT)$/.test(k)));const speech=getExerciseSpeechText(source,e,subject.id,language);const key=`${grade}/${subject.id}/${topic.id}/${e.id}`;rows.push({key,grade,subject:subject.id,topic:topic.id,title:topic.title,content,speech,language,hash:crypto.createHash('sha256').update(JSON.stringify({content,speech,language})).digest('hex')});counts[`${grade}/${subject.id}`]=(counts[`${grade}/${subject.id}`]??0)+1;}
fs.writeFileSync(out+'current-de.jsonl',rows.map(r=>JSON.stringify(r)).join('\n')+'\n');fs.writeFileSync(out+'current-inventory.json',JSON.stringify({at:new Date().toISOString(),total:rows.length,counts},null,2));console.log(JSON.stringify({total:rows.length,counts}));
