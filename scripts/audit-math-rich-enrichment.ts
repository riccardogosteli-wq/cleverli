import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getTopics } from "../src/data";
import { getMathRichEnrichmentIds } from "../src/data/mathRichEnrichment";
import type { Exercise } from "../src/types/exercise";

const QA_DIR = path.join(process.cwd(), ".qa/math-rich-enrichment-2026-09-01");
const ids = getMathRichEnrichmentIds();
const failures: string[] = [];
const rows: Record<string, unknown>[] = [];
const allowedTypes = new Set(["matching", "memory", "drag-drop", "number-line", "self-review"]);
const weakWording = [
  /artificial intelligence/i,
  /künstliche intelligenz/i,
  /Schlüsselbegriff/i,
  /unvollständige Version/i,
  /verwandter Begriff/i,
  /What is .* Deutsch/i,
  /Which .* gehört/i,
  /CHF\s*249/i,
  /lebenslang/i,
  /einfach nur/i,
  /irgendwie/i,
];

function keyFor(grade: number, topicId: string, exerciseId: string) {
  return `${grade}/math/${topicId}/${exerciseId}`;
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

function checkNumberLine(key: string, exercise: Exercise) {
  const answer = Number(exercise.answer);
  if (exercise.numberMin === undefined || exercise.numberMax === undefined || exercise.numberStep === undefined) {
    failures.push(`${key}: incomplete number-line configuration`);
    return;
  }
  if (!Number.isFinite(answer)) failures.push(`${key}: number-line answer is not numeric`);
  if (Number.isFinite(answer) && (answer < exercise.numberMin || answer > exercise.numberMax)) failures.push(`${key}: answer outside number-line range`);
  const steps = Number.isFinite(answer) ? Math.round((answer - exercise.numberMin) / exercise.numberStep) : NaN;
  if (Number.isFinite(answer) && Math.abs(exercise.numberMin + steps * exercise.numberStep - answer) > 0.000001) {
    failures.push(`${key}: answer is not reachable with configured step`);
  }
}

function checkExercise(grade: number, topicId: string, exercise: Exercise) {
  const key = keyFor(grade, topicId, exercise.id);
  if (grade < 3 || grade > 6) failures.push(`${key}: unexpected grade ${grade}`);
  if (!allowedTypes.has(exercise.type)) failures.push(`${key}: unexpected type ${exercise.type}`);
  if (!exercise.hints || exercise.hints.length < 2) failures.push(`${key}: expected two hints`);
  if (exercise.type === "matching" || exercise.type === "memory") checkPairs(key, exercise);
  if (exercise.type === "drag-drop") checkDragDrop(key, exercise);
  if (exercise.type === "number-line") checkNumberLine(key, exercise);
  if (exercise.type === "self-review" && (!exercise.reviewCriteria || exercise.reviewCriteria.length < 3 || exercise.answer !== "review")) {
    failures.push(`${key}: incomplete self-review`);
  }
  if (grade === 3 && /Gleichung|Prozent|negative|Koordinate/i.test(JSON.stringify(exercise))) failures.push(`${key}: content above grade 3 level`);
  if (grade === 4 && /Variable|Gleichung|negativ/i.test(JSON.stringify(exercise))) failures.push(`${key}: content above grade 4 level`);

  const text = JSON.stringify(exercise);
  for (const pattern of weakWording) {
    if (pattern.test(text)) failures.push(`${key}: weak/weird wording matched ${pattern}`);
  }
}

for (const entry of ids) {
  const topic = getTopics(entry.grade, entry.subject).find((candidate) => candidate.id === entry.topicId);
  const exercise = topic?.exercises.find((candidate) => candidate.id === entry.exerciseId);
  if (!topic || !exercise) {
    failures.push(`${keyFor(entry.grade, entry.topicId, entry.exerciseId)}: missing from served catalogue`);
    continue;
  }
  checkExercise(entry.grade, entry.topicId, exercise);
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

const byGrade = rows.reduce<Record<string, number>>((acc, row) => {
  const grade = String(row.grade);
  acc[grade] = (acc[grade] ?? 0) + 1;
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
const byGradeType = rows.reduce<Record<string, Record<string, number>>>((acc, row) => {
  const grade = String(row.grade);
  const type = String(row.type);
  acc[grade] ??= { "number-line": 0, matching: 0, memory: 0, "drag-drop": 0, "self-review": 0 };
  acc[grade][type] += 1;
  return acc;
}, {});

const expectedDifficulty = { easy: 3, medium: 6, hard: 3 };
const expectedTypes = { "number-line": 4, matching: 3, memory: 2, "drag-drop": 2, "self-review": 1 };
for (const grade of [3, 4, 5, 6]) {
  const key = String(grade);
  if ((byGrade[key] ?? 0) !== 12) failures.push(`grade ${grade}: expected 12 enriched exercises, found ${byGrade[key] ?? 0}`);
  for (const [label, count] of Object.entries(expectedDifficulty)) {
    if ((byGradeDifficulty[key]?.[label] ?? 0) !== count) failures.push(`grade ${grade} ${label}: expected ${count}, found ${byGradeDifficulty[key]?.[label] ?? 0}`);
  }
  for (const [type, count] of Object.entries(expectedTypes)) {
    if ((byGradeType[key]?.[type] ?? 0) !== count) failures.push(`grade ${grade} ${type}: expected ${count}, found ${byGradeType[key]?.[type] ?? 0}`);
  }
}
if (rows.length !== 48) failures.push(`expected 48 math rich exercises, found ${rows.length}`);

mkdirSync(QA_DIR, { recursive: true });
writeFileSync(path.join(QA_DIR, "math-rich-exercises.json"), JSON.stringify(rows, null, 2));
writeFileSync(path.join(QA_DIR, "REPORT.md"), `# Math Rich Enrichment QA - 2026-09-01

## Verdict

${failures.length ? "changes_requested" : "approved"}

## Scope

- Subject: Math
- Grades: 3, 4, 5, 6
- Added exercises checked individually: ${rows.length}
- Expected per grade: 12
- Counts by grade: ${JSON.stringify(byGrade)}
- Difficulty by grade: ${JSON.stringify(byGradeDifficulty)}
- Type mix by grade: ${JSON.stringify(byGradeType)}

## Guardrails

- Each grade has 3 easy, 6 medium and 3 hard tasks.
- Each grade has 4 number-line, 3 matching, 2 memory, 2 drag/drop and 1 self-review task.
- Klasse 3 stays concrete: place value, Einmaleins, simple division, first fractions and diagrams.
- Klasse 4 practises larger numbers, rounding, fractions, geometry, measuring and data.
- Klasse 5 adds decimals, percentages, coordinates, units and probability with simple models.
- Klasse 6 adds negative numbers, equations, ratios, statistics, geometry and probability.
- Weak generated wording patterns are blocked.

## Failures

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- None."}
`);

console.log(JSON.stringify({
  verdict: failures.length ? "changes_requested" : "approved",
  checked: rows.length,
  byGrade,
  byGradeDifficulty,
  byGradeType,
  failures,
}, null, 2));
if (failures.length) process.exit(1);
