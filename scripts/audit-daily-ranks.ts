import assert from 'node:assert/strict';
import { getDailyContext, getDailyState, getDailyStorageKey, isDailyDoneToday, markDailyComplete, todayKey } from '../src/lib/dailyState';
import { getActiveProfileStorageKey } from '../src/lib/accountScopedStorage';
import { getLevelForXp, getNextLevel, getLevelProgress, LEVELS } from '../src/lib/xp';
import { getDailyChallenge, isDailyRenderableExercise } from '../src/lib/daily';
import { localizeExercise } from '../src/lib/exerciseLocalization';
import { getExerciseSpeechText } from '../src/hooks/useVoice';
import { GET } from '../src/app/api/daily-challenge/route';
import { NextRequest } from 'next/server';

async function main() {
const values = new Map<string, string>();
const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
Object.assign(globalThis, { window: { localStorage: storage }, localStorage: storage });
const child = (id: string) => storage.setItem(getActiveProfileStorageKey(), id);
child('qa-a');
for (let i = 0; i < 20; i++) { assert.equal(markDailyComplete(false), false); assert.equal(isDailyDoneToday(), false); }
assert.equal(getDailyState()?.completed, false);
storage.setItem(getDailyStorageKey(), JSON.stringify({ date: todayKey(), completed: true, correct: false }));
assert.equal(isDailyDoneToday(), false, 'legacy wrong is reopened');
const context = getDailyContext();
assert.equal(markDailyComplete(true), true);
for (let i = 0; i < 20; i++) assert.equal(markDailyComplete(true), false, 'reload/double callback never rewards twice');
assert.equal(markDailyComplete(false), false);
assert.equal(isDailyDoneToday(), true);
child('qa-b');
assert.equal(isDailyDoneToday(), false);
assert.equal(markDailyComplete(true, context), false, 'late callback cannot credit another child');
assert.equal(markDailyComplete(true), true);
child('qa-a'); assert.equal(isDailyDoneToday(), true);
storage.setItem(getDailyStorageKey(), JSON.stringify({ date: '2020-01-01', completed: true, correct: true }));
assert.equal(isDailyDoneToday(), false);
assert.equal(markDailyComplete(true), false, 'dated bonus ledger survives replacing daily state');
storage.setItem('cleverli_session', JSON.stringify({ userId: 'qa-account-two' }));
child('qa-a'); assert.equal(isDailyDoneToday(), false); assert.equal(markDailyComplete(true), true);
assert.equal(todayKey(new Date('2026-09-06T21:59:59Z')), '2026-09-06');
assert.equal(todayKey(new Date('2026-09-06T22:00:00Z')), '2026-09-07');
assert.equal(todayKey(new Date('2026-01-06T23:00:00Z')), '2026-01-07');
for (const rank of LEVELS) { assert.equal(getLevelForXp(rank.minXp).id, rank.id); if (rank.minXp) assert.equal(getLevelForXp(rank.minXp - 1).id, rank.id - 1); }
assert.equal(getLevelForXp(1235).title, 'Cleverli-Star');
assert.equal(getNextLevel(1235)!.minXp - 1235, 65);
assert.equal(getLevelProgress(1235), 89);
assert.equal(getNextLevel(1300), null);
assert.equal(getLevelProgress(1300), 100);
const types = new Set<string>(); let pizzaDate = ''; let count = 0;
for (let day = 0; day < 730; day++) {
 const date = new Date(Date.UTC(2026, 0, 1 + day)).toISOString().slice(0, 10);
 for (let grade = 1; grade <= 6; grade++) {
  const challenge = getDailyChallenge(grade, date); assert.ok(challenge);
  types.add(challenge.exercise.type); assert.equal(Boolean(challenge.exercise.listeningText?.trim()), false);
  const exercise = localizeExercise(challenge.exercise, 'de');
  assert.ok(exercise.question && exercise.answer);
  assert.ok(getExerciseSpeechText(exercise, exercise, challenge.subject, 'de'));
  if (challenge.exercise.id === 'm3') { pizzaDate = date; assert.equal(exercise.question, 'Welche Gruppe hat mehr: 3 Pizzen oder 5 Pizzen?'); }
  count++;
 }
}
assert.deepEqual([...types].sort(), ['counting', 'fill-in-blank', 'multiple-choice']);
assert.equal(isDailyRenderableExercise({id:'qa-self-review',type:'self-review',question:'Schreibe.',answer:'Beispiel',hints:[],difficulty:1}), true);
assert.ok(pizzaDate);
const pizza = await (await GET(new NextRequest(`http://localhost/api/daily-challenge?grade=1&lang=de&date=${pizzaDate}`))).json();
assert.equal(pizza.exercise.question, 'Welche Gruppe hat mehr: 3 Pizzen oder 5 Pizzen?');
assert.equal(pizza.exercise.answer, '5 Pizzen');
for (const lang of ['de','en','fr','it']) {
 const date = '2026-09-07';
 const challenge = await (await GET(new NextRequest(`http://localhost/api/daily-challenge?grade=1&lang=${lang}&date=${date}`))).json();
 if (challenge.subject === 'german') assert.equal(challenge.exercise.question, localizeExercise(getDailyChallenge(1,date)!.exercise, 'de').question);
}
console.log(JSON.stringify({ status: 'passed', dailySelections: count, types: [...types], pizzaDate, rank1235: 'Star; 65 XP to Meister', cases: 'wrong/retry, legacy, reload, double callback, account/child isolation, stale callback, day ledger, Swiss midnight, rank boundaries, served pizza, speech, subject language' }, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
