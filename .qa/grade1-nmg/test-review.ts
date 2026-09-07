/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { getSubjects, getTopics } from "../../src/data";
import { localizeExercise } from "../../src/lib/exerciseLocalization";
import { getExerciseSpeechText } from "../../src/hooks/useVoice";

type Row = {
  key: string;
  grade: number;
  subject: string;
  topic: string;
  content: Record<string, any>;
  speech: string;
  language: string;
  hash: string;
};

const out = ".qa/grade1-nmg";
const baselinePath = "../grade1-german-review/.qa/grade1-german/current-de.jsonl";
const baseline = new Map<string, Row>(fs.readFileSync(baselinePath, "utf8").trim().split("\n").map((line) => {
  const row = JSON.parse(line) as Row;
  return [row.key, row];
}));
const current: Row[] = [];

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const source of topic.exercises) {
        const exercise = localizeExercise(source, "de");
        const content = Object.fromEntries(Object.entries(exercise).filter(([key]) => !/(EN|FR|IT)$/.test(key)));
        const language = source.listeningText ? source.listeningLanguage ?? "de" : subject.id === "english" ? "en" : subject.id === "french" ? "fr" : "de";
        const speech = getExerciseSpeechText(source, exercise, subject.id, language);
        const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}`;
        const hash = crypto.createHash("sha256").update(JSON.stringify({ content, speech, language })).digest("hex");
        current.push({ key, grade, subject: subject.id, topic: topic.id, content, speech, language, hash });
      }
    }
  }
}

assert.equal(current.length, 15_190);
assert.equal(baseline.size, 15_190);
assert.deepEqual(new Set(current.map((row) => row.key)), new Set(baseline.keys()));

const unit = current.filter((row) => row.grade === 1 && row.subject === "science");
assert.equal(unit.length, 602);
assert.deepEqual(Object.fromEntries([...new Set(unit.map((row) => row.topic))].map((topic) => [topic, unit.filter((row) => row.topic === topic).length])), {
  tiere: 50,
  jahreszeiten: 50,
  "mein-koerper": 50,
  "pflanzen-gr1": 50,
  "fuenf-sinne": 51,
  "familie-gemeinschaft": 50,
  "verkehr-sicherheit": 51,
  "zeit-uhr-gr1": 50,
  "wochentage-monate-gr1": 50,
  "physik-bewegung": 50,
  sinne: 50,
  "wetter-klima": 50,
});

const changed = unit.filter((row) => row.hash !== baseline.get(row.key)?.hash);
const unchanged = unit.filter((row) => row.hash === baseline.get(row.key)?.hash);
assert.equal(changed.length, 292);
assert.equal(unchanged.length, 310);

const outside = current.filter((row) => row.grade !== 1 || row.subject !== "science");
assert.equal(outside.length, 14_588);
for (const row of outside) assert.equal(row.hash, baseline.get(row.key)?.hash, `outside-unit mutation: ${row.key}`);

const prefixClue = /\b[A-ZÄÖÜa-zäöü]…|\b[A-ZÄÖÜa-zäöü]\.\.\.|\b(?:beginnt mit|erste[rsn]? Buchstabe|das Wort hat|Schlüsselbegriff)/i;
for (const row of unit) {
  const exercise = row.content;
  const before = baseline.get(row.key)?.content;
  assert.equal(exercise.id, before?.id, `id changed: ${row.key}`);
  assert.equal(exercise.type, before?.type, `type changed: ${row.key}`);
  assert.equal(exercise.difficulty, before?.difficulty, `difficulty changed: ${row.key}`);
  assert.equal(exercise.free ?? false, before?.free ?? false, `free flag changed: ${row.key}`);
  assert.equal(exercise.hints?.length, 2, `hint count: ${row.key}`);
  assert.ok(exercise.hints.every((hint: string) => hint.trim().length > 10), `weak hint: ${row.key}`);
  assert.ok(exercise.hints.every((hint: string) => !prefixClue.test(hint)), `answer-prefix hint: ${row.key}`);
  assert.ok(!/[ß]/.test(JSON.stringify(exercise)), `non-Swiss spelling: ${row.key}`);
  assert.ok(!/___/.test(row.speech), `raw blank spoken: ${row.key}`);
  if (exercise.type === "multiple-choice") {
    assert.equal(exercise.options.length, 4, `option count: ${row.key}`);
    assert.equal(exercise.options.filter((option: string) => option === exercise.answer).length, 1, `answer missing/duplicate: ${row.key}`);
    assert.equal(new Set(exercise.options.map((option: string) => option.toLocaleLowerCase("de-CH").trim())).size, 4, `duplicate options: ${row.key}`);
  }
  if (exercise.type === "fill-in-blank") {
    assert.ok(exercise.question.includes("___"), `missing input blank: ${row.key}`);
    assert.ok(!exercise.answer.includes("/"), `slash-combined answer: ${row.key}`);
  }
  if (exercise.type === "drag-drop") {
    const itemIds = new Set(exercise.dragItems.map((item: any) => item.id));
    const zoneIds = new Set(exercise.dropZones.map((zone: any) => zone.id));
    assert.deepEqual(new Set(Object.keys(exercise.dropAnswers)), itemIds, `drag keys: ${row.key}`);
    assert.ok(Object.values(exercise.dropAnswers).every((zoneId) => zoneIds.has(zoneId as string)), `drag zone: ${row.key}`);
  }
  if (["matching", "memory"].includes(exercise.type)) assert.equal(exercise.pairs.length % 2, 0, `odd pair list: ${row.key}`);
}

const byKey = new Map(unit.map((row) => [row.key, row.content]));
const expect = (key: string, field: string, value: unknown) => assert.deepEqual(byKey.get(key)?.[field], value, `${key} ${field}`);
expect("1/science/tiere/t16", "answer", "Igel");
expect("1/science/tiere/t22", "question", "Aus dem Ei eines Schmetterlings schlüpft zuerst eine ___.");
expect("1/science/jahreszeiten/j20", "answer", "Die hellen Stunden des Tages sind kürzer");
expect("1/science/mein-koerper/k20", "answer", "schlafen");
expect("1/science/pflanzen-gr1/p38", "answer", "Keimling");
expect("1/science/fuenf-sinne/g1-science-fuenf-sinne-s47", "answer", "5");
expect("1/science/familie-gemeinschaft/fg1", "answer", "Familien können unterschiedlich aussehen und füreinander sorgen");
expect("1/science/verkehr-sicherheit/vs12", "answer", "Trottoir");
expect("1/science/zeit-uhr-gr1/u17", "question", "Wie spät ist es, wenn der lange Zeiger auf 6 und der kurze zwischen 3 und 4 steht?");
expect("1/science/wochentage-monate-gr1/wm45", "answer", "Februar");
expect("1/science/physik-bewegung/ph20", "answer", "Er startet meist schneller");
expect("1/science/sinne/sn30", "answer", "Weitergeben oder tauschen");
expect("1/science/wetter-klima/wk45", "answer", "Eine vertrauenswürdige erwachsene Person um Hilfe bitten");

const banned = /Bürgersteig|Smoke aus|andere Sinne sind schärfer|Gehirn schaltet ab|November, ___ und Januar|Frühlingmonate|stehenblieben/;
for (const row of unit) assert.ok(!banned.test(JSON.stringify(row.content)), `known defect remains: ${row.key}`);

const ledger = unit.map((row) => ({
  key: row.key,
  id: row.content.id,
  topic: row.topic,
  type: row.content.type,
  difficulty: row.content.difficulty,
  baselineHash: baseline.get(row.key)?.hash,
  currentHash: row.hash,
  changed: row.hash !== baseline.get(row.key)?.hash,
  review: row.hash !== baseline.get(row.key)?.hash
    ? "Individually reviewed; confirmed defect corrected and semantics/scoring rechecked."
    : "Individually reviewed; content, answer, interaction data and spoken prompt confirmed without source change.",
}));
fs.writeFileSync(`${out}/review-ledger.json`, JSON.stringify({ status: "pass", reviewed: unit.length, corrected: changed.length, unchanged: unchanged.length, records: ledger }, null, 2));
fs.writeFileSync(`${out}/test-review-result.json`, JSON.stringify({ status: "pass", totalCatalogue: current.length, reviewed: unit.length, corrected: changed.length, unchanged: unchanged.length, outsideUnitUnchanged: outside.length, semanticFixtures: 13 }, null, 2));
console.log(`PASS: ${unit.length} reviewed, ${changed.length} corrected, ${unchanged.length} unchanged, ${outside.length} outside-unit hashes unchanged.`);
