import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getTopics } from "../src/data";
import { getLanguageRichEnrichmentIds } from "../src/data/languageRichEnrichment";
import type { Exercise } from "../src/types/exercise";

const QA_DIR = path.join(process.cwd(), ".qa/language-rich-enrichment-2026-09-01");
const ids = getLanguageRichEnrichmentIds();
const failures: string[] = [];
const rows: Record<string, unknown>[] = [];
const allowedTypes = new Set(["matching", "memory", "drag-drop", "word-search", "self-review"]);
const expectedSubjects = new Set(["english", "french"]);
const weakWording = [
  /artificial intelligence/i,
  /künstliche intelligenz/i,
  /Schlüsselbegriff/i,
  /Denk an die Übersetzung/i,
  /Das Wort beginnt/i,
  /What is .* Deutsch/i,
  /Which .* gehört/i,
  /Sortiere the/i,
  /unvollständige Version/i,
  /verwandter Begriff/i,
  /pumpt sang/i,
  /lebenslang/i,
  /CHF\s*249/i,
];

function keyFor(grade: number, subject: string, topicId: string, exerciseId: string) {
  return `${grade}/${subject}/${topicId}/${exerciseId}`;
}

function checkPairs(key: string, exercise: Exercise) {
  if (!exercise.pairs || exercise.pairs.length !== 8) failures.push(`${key}: expected 8 pair cards`);
  const pairIds = new Set((exercise.pairs ?? []).map((pair) => pair.id));
  if (pairIds.size !== (exercise.pairs ?? []).length) failures.push(`${key}: duplicate pair IDs`);
}

function checkDragDrop(key: string, exercise: Exercise) {
  if (!exercise.dragItems?.length || !exercise.dropZones?.length || !exercise.dropAnswers) {
    failures.push(`${key}: incomplete drag/drop structure`);
    return;
  }
  const itemIds = new Set(exercise.dragItems.map((item) => item.id));
  const zoneIds = new Set(exercise.dropZones.map((zone) => zone.id));
  for (const [itemId, zoneId] of Object.entries(exercise.dropAnswers)) {
    if (!itemIds.has(itemId)) failures.push(`${key}: drop answer references missing item ${itemId}`);
    if (!zoneIds.has(zoneId)) failures.push(`${key}: drop answer references missing zone ${zoneId}`);
  }
  if (Object.keys(exercise.dropAnswers).length !== exercise.dragItems.length) failures.push(`${key}: not all drag items mapped`);
}

function checkExercise(grade: number, subject: string, topicId: string, exercise: Exercise) {
  const key = keyFor(grade, subject, topicId, exercise.id);
  if (!expectedSubjects.has(subject)) failures.push(`${key}: unexpected subject ${subject}`);
  if (grade < 4 || grade > 6) failures.push(`${key}: unexpected grade ${grade}`);
  if (!allowedTypes.has(exercise.type)) failures.push(`${key}: unexpected type ${exercise.type}`);
  if (!exercise.hints || exercise.hints.length < 2) failures.push(`${key}: expected two hints`);
  if (exercise.type === "matching" || exercise.type === "memory") checkPairs(key, exercise);
  if (exercise.type === "drag-drop") checkDragDrop(key, exercise);
  if (exercise.type === "word-search" && (!exercise.wordList || exercise.wordList.length < 5 || !exercise.gridSize)) failures.push(`${key}: incomplete word-search`);
  if (exercise.type === "self-review" && (!exercise.reviewCriteria || exercise.reviewCriteria.length < 3 || exercise.answer !== "review")) failures.push(`${key}: incomplete self-review`);

  const text = JSON.stringify(exercise);
  for (const pattern of weakWording) {
    if (pattern.test(text)) failures.push(`${key}: weak/weird wording matched ${pattern}`);
  }
}

for (const entry of ids) {
  const topic = getTopics(entry.grade, entry.subject).find((candidate) => candidate.id === entry.topicId);
  const exercise = topic?.exercises.find((candidate) => candidate.id === entry.exerciseId);
  if (!topic || !exercise) {
    failures.push(`${keyFor(entry.grade, entry.subject, entry.topicId, entry.exerciseId)}: missing from served catalogue`);
    continue;
  }
  checkExercise(entry.grade, entry.subject, entry.topicId, exercise);
  rows.push({
    grade: entry.grade,
    subject: entry.subject,
    topicId: entry.topicId,
    topic: topic.title,
    exerciseId: exercise.id,
    type: exercise.type,
    difficulty: exercise.difficulty,
    question: exercise.question,
  });
}

const byGradeSubject = rows.reduce<Record<string, number>>((acc, row) => {
  const key = `${row.grade}/${row.subject}`;
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});
const byGradeSubjectDifficulty = rows.reduce<Record<string, Record<string, number>>>((acc, row) => {
  const key = `${row.grade}/${row.subject}`;
  const difficulty = Number(row.difficulty);
  const label = difficulty === 1 ? "easy" : difficulty === 2 ? "medium" : "hard";
  acc[key] ??= { easy: 0, medium: 0, hard: 0 };
  acc[key][label] += 1;
  return acc;
}, {});
const byGradeSubjectType = rows.reduce<Record<string, Record<string, number>>>((acc, row) => {
  const key = `${row.grade}/${row.subject}`;
  const type = String(row.type);
  acc[key] ??= { matching: 0, memory: 0, "drag-drop": 0, "word-search": 0, "self-review": 0 };
  acc[key][type] += 1;
  return acc;
}, {});

const expectedDifficulty = { easy: 2, medium: 4, hard: 2 };
const expectedTypes = { matching: 2, memory: 1, "drag-drop": 2, "word-search": 1, "self-review": 2 };
for (const grade of [4, 5, 6]) {
  for (const subject of ["english", "french"]) {
    const key = `${grade}/${subject}`;
    if ((byGradeSubject[key] ?? 0) !== 8) failures.push(`${key}: expected 8 enriched exercises, found ${byGradeSubject[key] ?? 0}`);
    for (const [label, count] of Object.entries(expectedDifficulty)) {
      if ((byGradeSubjectDifficulty[key]?.[label] ?? 0) !== count) {
        failures.push(`${key} ${label}: expected ${count}, found ${byGradeSubjectDifficulty[key]?.[label] ?? 0}`);
      }
    }
    for (const [type, count] of Object.entries(expectedTypes)) {
      if ((byGradeSubjectType[key]?.[type] ?? 0) !== count) {
        failures.push(`${key} ${type}: expected ${count}, found ${byGradeSubjectType[key]?.[type] ?? 0}`);
      }
    }
  }
}

if (rows.length !== 48) failures.push(`expected 48 language rich exercises, found ${rows.length}`);

mkdirSync(QA_DIR, { recursive: true });
writeFileSync(path.join(QA_DIR, "language-rich-exercises.json"), JSON.stringify(rows, null, 2));
writeFileSync(path.join(QA_DIR, "REPORT.md"), `# Language Rich Enrichment QA - 2026-09-01

## Verdict

${failures.length ? "changes_requested" : "approved"}

## Scope

- Subjects: English, French
- Grades: 4, 5, 6
- Added exercises checked individually: ${rows.length}
- Expected per grade and subject: 8
- Counts by grade/subject: ${JSON.stringify(byGradeSubject)}
- Difficulty by grade/subject: ${JSON.stringify(byGradeSubjectDifficulty)}
- Type mix by grade/subject: ${JSON.stringify(byGradeSubjectType)}

## Guardrails

- Each grade/subject has 2 easy, 4 medium and 2 hard tasks.
- Each grade/subject has 2 matching, 2 drag/drop, 1 memory, 1 word-search and 2 self-review tasks.
- Klasse 4 stays concrete: routine, home, food, hobbies and directions.
- Klasse 5 practises plans, past experiences, classroom/family language and core verbs.
- Klasse 6 practises structured reading, discussion, routes, culture and simple argumentation.
- Weak generated wording patterns are blocked.

## Failures

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- None."}
`);

console.log(JSON.stringify({
  verdict: failures.length ? "changes_requested" : "approved",
  checked: rows.length,
  byGradeSubject,
  byGradeSubjectDifficulty,
  byGradeSubjectType,
  failures,
}, null, 2));
if (failures.length) process.exit(1);
