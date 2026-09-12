import assert from 'node:assert/strict';
import { getTopics } from '../src/data';
import { localizeExercise } from '../src/lib/exerciseLocalization';
import { getExerciseSpeechText } from '../src/hooks/useVoice';
let checked=0;
for(let grade=1;grade<=6;grade++)for(const topic of getTopics(grade,'german'))for(const exercise of topic.exercises){
 if(!exercise.listeningText)continue;
 for(const lang of ['de','fr','it','en'] as const){const localized=localizeExercise(exercise,lang);assert.equal(getExerciseSpeechText(exercise,localized,'german',lang),localized.listeningText??exercise.listeningText);assert.ok(["de","fr","it","en"].includes(exercise.listeningLanguage ?? "de"));checked++;}
}
assert.ok(checked>0);console.log(`${checked} essential listening stimulus/language contracts passed; no live curriculum audit claimed.`);
