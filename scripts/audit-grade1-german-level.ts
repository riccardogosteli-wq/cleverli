import rawGerman from "../src/data/grade1/german";
import { getTopics } from "../src/data";

const failures: string[] = [];
const levelled = getTopics(1, "german");
const rawById = new Map(rawGerman.flatMap((topic) => topic.exercises).map((exercise) => [exercise.id, exercise]));
const levelledExercises = levelled.flatMap((topic) => topic.exercises);
const levelledById = new Map(levelledExercises.map((exercise) => [exercise.id, exercise]));

if (levelledExercises.length !== 550) failures.push(`Expected 550 exercises, found ${levelledExercises.length}`);
if (rawById.size !== levelledById.size) failures.push(`ID count changed: ${rawById.size} -> ${levelledById.size}`);

for (const [id, original] of rawById) {
  const current = levelledById.get(id);
  if (!current) {
    failures.push(`Missing exercise ID ${id}`);
    continue;
  }
  if (current.type !== original.type) failures.push(`${id}: type changed ${original.type} -> ${current.type}`);
  if (current.difficulty !== original.difficulty) failures.push(`${id}: difficulty changed`);
  if (Boolean(current.free) !== Boolean(original.free)) failures.push(`${id}: free flag changed`);
}

const forbiddenDevelopmentalLanguage = /\b(?:Nomen|Verben?|Adjektiv\w*|Oberbegriff|Wörterbuch|Telefonbuch|alphabetisch|KOMPLETT|Korrigiere|Rechtschreibregel\w*)\b|alle Fehler|Jede Schwester|die Hälfte|Seite 12 von 20/i;
const malformedForms = /\b(?:Teir|Teer|Tir|Iel)\b|A-PFel|KI-ND|ER-DB-EER-E/i;

for (const exercise of levelledExercises) {
  const searchable = [exercise.question, ...(exercise.options ?? []), ...(exercise.hints ?? [])].join(" ");
  if (forbiddenDevelopmentalLanguage.test(searchable)) failures.push(`${exercise.id}: developmentally advanced wording remains`);
  if (malformedForms.test(searchable)) failures.push(`${exercise.id}: malformed word form remains`);
  if (exercise.type === "multiple-choice" && !exercise.options?.includes(exercise.answer)) {
    failures.push(`${exercise.id}: answer is not present in options`);
  }
  if (!exercise.question.trim() || !exercise.answer.trim()) failures.push(`${exercise.id}: empty question or answer`);
}

const soundTopic = levelled.find((topic) => topic.id === "ie-ei");
if (!soundTopic || soundTopic.title !== "Laute hören: ie und ei") failures.push("ie-ei topic was not retitled");
for (const exercise of soundTopic?.exercises ?? []) {
  if (exercise.type === "multiple-choice" && JSON.stringify(exercise.options) !== JSON.stringify(["ie", "ei"])) {
    failures.push(`${exercise.id}: ie/ei choice must offer only ie and ei`);
  }
  if (exercise.type !== "drag-drop" && !["ie", "ei"].includes(exercise.answer)) {
    failures.push(`${exercise.id}: ie/ei answer must be a two-letter choice`);
  }
}

const changed = levelledExercises.filter((exercise) => rawById.get(exercise.id)?.question !== exercise.question).length;
if (changed < 220) failures.push(`Expected at least 220 developmental rewrites, found ${changed}`);

console.log(JSON.stringify({
  topics: levelled.length,
  exercises: levelledExercises.length,
  rewritten: changed,
  preservedIds: rawById.size === levelledById.size,
  soundTopicExercises: soundTopic?.exercises.length ?? 0,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
