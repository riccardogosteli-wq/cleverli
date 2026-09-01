import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getTopics } from "../src/data";
import { getNmgRichEnrichmentIds } from "../src/data/nmgRichEnrichment";
import type { Exercise } from "../src/types/exercise";

const QA_DIR = path.join(process.cwd(), ".qa/nmg-rich-enrichment-2026-09-01");
const ids = getNmgRichEnrichmentIds();
const failures: string[] = [];
const rows: Record<string, unknown>[] = [];
const allowedTypes = new Set(["matching", "memory", "drag-drop", "word-search", "self-review"]);
const weakWording = [
  /\bAI\b/i,
  /künstliche intelligenz/i,
  /Das Gegenteil des beschriebenen Konzepts/i,
  /Schlüsselbegriff/i,
  /unvollständige Version/i,
  /verwandter Begriff aus einem anderen Fachgebiet/i,
  /pumpt sang/i,
  /What is .* Deutsch/i,
];

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

function checkExercise(grade: number, topicId: string, exercise: Exercise) {
  const key = `${grade}/science/${topicId}/${exercise.id}`;
  if (!allowedTypes.has(exercise.type)) failures.push(`${key}: unexpected type ${exercise.type}`);
  if (!exercise.hints || exercise.hints.length < 2) failures.push(`${key}: expected two hints`);
  if (grade === 4 && exercise.difficulty === 3 && exercise.type === "word-search") failures.push(`${key}: grade 4 word-search should not be hard`);
  if (grade === 6 && exercise.difficulty === 1 && exercise.type === "self-review") failures.push(`${key}: grade 6 self-review should require cycle-2 reasoning`);
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
    failures.push(`${entry.grade}/science/${entry.topicId}/${entry.exerciseId}: missing from served catalogue`);
    continue;
  }
  checkExercise(entry.grade, entry.topicId, exercise);
  rows.push({
    grade: entry.grade,
    topicId: entry.topicId,
    topic: topic.title,
    exerciseId: exercise.id,
    type: exercise.type,
    difficulty: exercise.difficulty,
    question: exercise.question,
  });
}

const byGrade = rows.reduce<Record<string, number>>((acc, row) => {
  const grade = String(row.grade);
  acc[grade] = (acc[grade] ?? 0) + 1;
  return acc;
}, {});
for (const grade of [4, 5, 6]) {
  if (byGrade[String(grade)] !== 20) failures.push(`grade ${grade}: expected 20 enriched exercises, found ${byGrade[String(grade)] ?? 0}`);
}

const byType = rows.reduce<Record<string, number>>((acc, row) => {
  const type = String(row.type);
  acc[type] = (acc[type] ?? 0) + 1;
  return acc;
}, {});
const byGradeDifficulty = rows.reduce<Record<string, Record<string, number>>>((acc, row) => {
  const grade = String(row.grade);
  const difficulty = Number(row.difficulty);
  const label = difficulty === 1 ? "easy" : difficulty === 2 ? "medium" : "hard";
  acc[grade] ??= { easy: 0, medium: 0, hard: 0 };
  acc[grade][label] += 1;
  return acc;
}, {});
const expectedByGradeDifficulty: Record<string, Record<string, number>> = {
  "4": { easy: 5, medium: 10, hard: 5 },
  "5": { easy: 4, medium: 10, hard: 6 },
  "6": { easy: 3, medium: 9, hard: 8 },
};
for (const [grade, expected] of Object.entries(expectedByGradeDifficulty)) {
  for (const [label, count] of Object.entries(expected)) {
    if ((byGradeDifficulty[grade]?.[label] ?? 0) !== count) {
      failures.push(`grade ${grade} ${label}: expected ${count}, found ${byGradeDifficulty[grade]?.[label] ?? 0}`);
    }
  }
}
const expectedByType: Record<string, number> = {
  "drag-drop": 20,
  matching: 15,
  memory: 10,
  "self-review": 9,
  "word-search": 6,
};
for (const [type, expected] of Object.entries(expectedByType)) {
  if ((byType[type] ?? 0) !== expected) failures.push(`type ${type}: expected ${expected}, found ${byType[type] ?? 0}`);
}

mkdirSync(QA_DIR, { recursive: true });
writeFileSync(path.join(QA_DIR, "nmg-rich-exercises.json"), JSON.stringify(rows, null, 2));
writeFileSync(path.join(QA_DIR, "REPORT.md"), `# NMG Rich Enrichment QA - 2026-09-01

## Verdict

${failures.length ? "changes_requested" : "approved"}

## Scope

- Grades: 4, 5, 6
- Added exercises checked individually: ${rows.length}
- Expected per grade: 20
- Counts by grade: ${JSON.stringify(byGrade)}
- Difficulty by grade: ${JSON.stringify(byGradeDifficulty)}
- Counts by type: ${JSON.stringify(byType)}

## Guardrails

- Klasse 4 stays concrete: observing, sorting, everyday cause/effect.
- Klasse 5 uses comparison and simple models.
- Klasse 6 uses justification, consequences and system links.
- Weak generated wording patterns are blocked.

## Failures

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- None."}
`);

console.log(JSON.stringify({ verdict: failures.length ? "changes_requested" : "approved", checked: rows.length, byGrade, byType, failures }, null, 2));
if (failures.length) process.exit(1);
