import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getTopics } from "../src/data";
import {
  createCurriculumSelection,
  getAvailableCurriculumSubjectIds,
} from "../src/lib/curriculumProfiles";
import type { Exercise, ExerciseType, Topic } from "../src/types/exercise";

const QA_DIR = path.join(process.cwd(), ".qa/mi-module-2026-09-01");
const GRADES = [3, 4, 5, 6] as const;
const RICH_TYPES = new Set<ExerciseType>(["matching", "memory", "drag-drop", "word-search", "self-review"]);
const failures: string[] = [];
const rows: Record<string, string | number | boolean>[] = [];

function location(grade: number, topic: Topic, exercise: Exercise) {
  return `${grade}/mi/${topic.id}/${exercise.id}`;
}

function assertOk(condition: unknown, message: string) {
  if (!condition) failures.push(message);
}

function includesAnswer(hint: string, answer: string) {
  if (!answer || answer.length <= 2) return false;
  return hint.toLowerCase().includes(answer.toLowerCase());
}

function hasOneBlank(question: string) {
  return (question.match(/___/g) ?? []).length === 1;
}

function inspectExercise(grade: number, topic: Topic, exercise: Exercise) {
  const loc = location(grade, topic, exercise);
  assertOk(Boolean(exercise.id), `${loc}: missing id`);
  assertOk(Boolean(exercise.question?.trim()), `${loc}: missing question`);
  assertOk(Boolean(exercise.answer?.trim()), `${loc}: missing answer`);
  assertOk([1, 2, 3].includes(exercise.difficulty), `${loc}: invalid difficulty`);
  assertOk((exercise.hints ?? []).length >= 2, `${loc}: needs two hints`);
  for (const hint of exercise.hints ?? []) {
    assertOk(!includesAnswer(hint, exercise.answer), `${loc}: hint reveals answer`);
  }
  assertOk(!/[ß]/.test(`${exercise.question} ${exercise.answer} ${(exercise.hints ?? []).join(" ")}`), `${loc}: uses non-Swiss ß`);
  assertOk(!/\b(?:Schlüsselbegriff|Internet souverän|GDPR|Great Firewall|Big Data|Deep Learning)\b/i.test(`${exercise.question} ${exercise.answer}`), `${loc}: weird or over-advanced wording`);

  if (grade <= 4) {
    assertOk(!/\b(?:Phishing|Verschlüsselung|Filterblase|Empfehlungsalgorithmus)\b/i.test(`${exercise.question} ${exercise.answer}`), `${loc}: lower-grade wording is too advanced`);
    assertOk(exercise.difficulty !== 3 || /Bedingung|Wenn-dann/.test(`${exercise.question} ${exercise.answer}`), `${loc}: grade ${grade} hard task is not clearly scaffolded`);
  }

  if (exercise.type === "multiple-choice") {
    assertOk((exercise.options ?? []).length === 4, `${loc}: MC needs four options`);
    assertOk((exercise.options ?? []).includes(exercise.answer), `${loc}: MC answer not in options`);
    assertOk(new Set(exercise.options ?? []).size === (exercise.options ?? []).length, `${loc}: duplicate MC options`);
  }

  if (exercise.type === "fill-in-blank") {
    assertOk(hasOneBlank(exercise.question), `${loc}: fill-in must have exactly one blank`);
    assertOk(!exercise.answer.includes(" "), `${loc}: fill-in answer should be one compact response`);
  }

  if (exercise.type === "matching") {
    assertOk(Boolean(exercise.pairs?.length) && (exercise.pairs?.length ?? 0) % 2 === 0, `${loc}: matching needs even pairs`);
    assertOk((exercise.pairs?.length ?? 0) >= 8, `${loc}: matching should have at least four pairs`);
    assertOk(new Set((exercise.pairs ?? []).map((pair) => pair.id)).size === (exercise.pairs ?? []).length, `${loc}: duplicate matching ids`);
  }

  if (exercise.type === "memory") {
    assertOk((exercise.pairs?.length ?? 0) >= 3 && (exercise.pairs?.length ?? 0) <= 6, `${loc}: memory needs 3-6 pairs`);
    assertOk(new Set((exercise.pairs ?? []).map((pair) => pair.id)).size === (exercise.pairs ?? []).length, `${loc}: duplicate memory ids`);
  }

  if (exercise.type === "drag-drop") {
    const zoneIds = new Set((exercise.dropZones ?? []).map((zone) => zone.id));
    const itemIds = new Set((exercise.dragItems ?? []).map((item) => item.id));
    assertOk(zoneIds.size >= 2, `${loc}: drag-drop needs at least two zones`);
    assertOk(itemIds.size >= 4, `${loc}: drag-drop needs at least four items`);
    for (const [itemId, zoneId] of Object.entries(exercise.dropAnswers ?? {})) {
      assertOk(itemIds.has(itemId), `${loc}: drop answer item ${itemId} missing`);
      assertOk(zoneIds.has(zoneId), `${loc}: drop answer zone ${zoneId} missing`);
    }
    assertOk(Object.keys(exercise.dropAnswers ?? {}).length === itemIds.size, `${loc}: each drag item needs an answer`);
  }

  if (exercise.type === "word-search") {
    assertOk((exercise.wordList ?? []).length >= 4, `${loc}: word-search needs at least four words`);
    for (const word of exercise.wordList ?? []) {
      assertOk(word === word.toUpperCase(), `${loc}: word-search word ${word} must be uppercase`);
      assertOk(word.length <= (exercise.gridSize ?? 0), `${loc}: word-search word ${word} too long`);
    }
  }

  if (exercise.type === "self-review") {
    assertOk((exercise.reviewCriteria ?? []).length >= 3, `${loc}: self-review needs at least three criteria`);
    assertOk(exercise.question.length >= 30, `${loc}: self-review prompt is too thin`);
  }

  rows.push({
    grade,
    subject: "Medien & Informatik",
    topicId: topic.id,
    topic: topic.title,
    exerciseId: exercise.id,
    type: exercise.type,
    difficulty: exercise.difficulty,
    question: exercise.question,
    answer: exercise.answer,
    lp21: topic.curriculumCodes?.join(", ") ?? "",
    richType: RICH_TYPES.has(exercise.type),
  });
}

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

const summaries = GRADES.map((grade) => {
  const topics = getTopics(grade, "mi");
  assertOk(topics.length >= 2, `grade ${grade}: expected at least two MI topics`);
  const topicIds = new Set<string>();
  const exerciseIds = new Set<string>();
  const typeCounts: Partial<Record<ExerciseType, number>> = {};
  const gradeCodes = new Set<string>();
  let exercises = 0;

  for (const topic of topics) {
    assertOk(!topicIds.has(topic.id), `grade ${grade}: duplicate topic ${topic.id}`);
    topicIds.add(topic.id);
    assertOk(topic.curriculumCodes?.some((code) => code.startsWith("MI.1") || code.startsWith("MI.2")), `${grade}/mi/${topic.id}: needs MI curriculum code`);
    for (const code of topic.curriculumCodes ?? []) gradeCodes.add(code);

    for (const exercise of topic.exercises) {
      const key = exercise.id;
      assertOk(!exerciseIds.has(key), `${grade}/mi: duplicate exercise id ${key}`);
      exerciseIds.add(key);
      exercises += 1;
      typeCounts[exercise.type] = (typeCounts[exercise.type] ?? 0) + 1;
      inspectExercise(grade, topic, exercise);
    }

    const topicTypeCount = new Set(topic.exercises.map((exercise) => exercise.type)).size;
    const richCount = topic.exercises.filter((exercise) => RICH_TYPES.has(exercise.type)).length;
    assertOk(topicTypeCount >= 6, `${grade}/mi/${topic.id}: needs at least six exercise types`);
    assertOk(richCount / topic.exercises.length >= 0.35, `${grade}/mi/${topic.id}: rich/gamified share below 35%`);
    assertOk(topic.exercises.filter((exercise) => exercise.free).length === 3, `${grade}/mi/${topic.id}: first three free exercises expected`);
  }

  assertOk(typeCounts["matching"] && typeCounts.memory && typeCounts["drag-drop"] && typeCounts["word-search"] && typeCounts["self-review"], `grade ${grade}: missing rich type coverage`);
  assertOk([...gradeCodes].some((code) => code.startsWith("MI.1")), `grade ${grade}: missing MI.1 media coverage`);
  assertOk([...gradeCodes].some((code) => code.startsWith("MI.2")), `grade ${grade}: missing MI.2 informatics coverage`);
  return { grade, topics: topics.length, exercises, typeCounts };
});

assertOk(getAvailableCurriculumSubjectIds(3, createCurriculumSelection("SO")).includes("mi"), "SO grade 3 should include MI");
assertOk(getAvailableCurriculumSubjectIds(3, createCurriculumSelection("VS")).includes("mi"), "VS integrated grade 3 should include MI practice");
assertOk(!getAvailableCurriculumSubjectIds(3, createCurriculumSelection("ZH")).includes("mi"), "ZH grade 3 should not include standalone MI");
assertOk(getAvailableCurriculumSubjectIds(5, createCurriculumSelection("ZH")).includes("mi"), "ZH grade 5 should include MI");

mkdirSync(QA_DIR, { recursive: true });
const csvHeader = ["grade", "subject", "topicId", "topic", "exerciseId", "type", "difficulty", "question", "answer", "lp21", "richType"];
writeFileSync(
  path.join(QA_DIR, "mi-exercises.csv"),
  `${csvHeader.join(",")}\n${rows.map((row) => csvHeader.map((key) => csvEscape(row[key])).join(",")).join("\n")}\n`,
);

for (const grade of GRADES) {
  const gradeRows = rows.filter((row) => row.grade === grade);
  writeFileSync(
    path.join(QA_DIR, `mi-exercises-grade-${grade}.csv`),
    `${csvHeader.join(",")}\n${gradeRows.map((row) => csvHeader.map((key) => csvEscape(row[key])).join(",")).join("\n")}\n`,
  );
}

const report = {
  generatedAt: new Date().toISOString(),
  verdict: failures.length ? "changes_requested" : "approved",
  officialLp21Basis: "Lehrplan 21 module Medien und Informatik: Medien (MI.1) and Informatik (MI.2).",
  summaries,
  exerciseRows: rows.length,
  failures,
};

writeFileSync(path.join(QA_DIR, "REPORT.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  path.join(QA_DIR, "REPORT.md"),
  `# MI Module QA - 2026-09-01

## Verdict

${report.verdict}

## Scope

- Grades: 3-6
- Subject: Medien & Informatik
- LP21 basis: MI.1 Medien and MI.2 Informatik
- Exercise-level rows checked: ${rows.length}

## Summaries

| Grade | Topics | Exercises | Type counts |
|---:|---:|---:|---|
${summaries.map((summary) => `| ${summary.grade} | ${summary.topics} | ${summary.exercises} | ${Object.entries(summary.typeCounts).map(([type, count]) => `${type}: ${count}`).join(", ")} |`).join("\n")}

## Failures

${failures.length ? failures.map((failure) => `- ${failure}`).join("\n") : "- None."}
`,
);

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
