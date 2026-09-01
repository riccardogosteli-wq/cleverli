import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getSubjects, getTopics } from "../src/data";
import type { ExerciseType } from "../src/types/exercise";

const QA_DIR = path.join(process.cwd(), ".qa/exercise-type-coverage-2026-09-01");
const GRADES = [1, 2, 3, 4, 5, 6] as const;
const ALL_TYPES: ExerciseType[] = [
  "multiple-choice",
  "fill-in-blank",
  "self-review",
  "counting",
  "matching",
  "memory",
  "drag-drop",
  "number-line",
  "word-search",
];
const FAST_TYPES = new Set<ExerciseType>(["multiple-choice", "fill-in-blank"]);
const RICH_INTERACTIVE_TYPES = new Set<ExerciseType>([
  "counting",
  "matching",
  "memory",
  "drag-drop",
  "number-line",
  "word-search",
]);

type Severity = "High" | "Medium" | "Low";

type Finding = {
  severity: Severity;
  priority: number;
  grade: number;
  subject: string;
  issue: string;
  recommendation: string;
};

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 1000) / 10;
}

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function subjectLabel(subjectId: string) {
  return ({
    math: "Mathe",
    german: "Deutsch",
    science: "NMG",
    english: "Englisch",
    french: "Franzoesisch",
    mi: "Medien und Informatik",
  } as Record<string, string>)[subjectId] ?? subjectId;
}

const rows = GRADES.flatMap((grade) => {
  return getSubjects(grade).map((subject) => {
    const topics = getTopics(grade, subject.id);
    const typeCounts = Object.fromEntries(ALL_TYPES.map((type) => [type, 0])) as Record<ExerciseType, number>;
    const difficultyCounts: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
    let exerciseCount = 0;
    let topicWithoutRich = 0;
    let topicFastOnly = 0;
    let selfReviewCount = 0;
    let listeningCount = 0;

    for (const topic of topics) {
      const topicTypes = new Set(topic.exercises.map((exercise) => exercise.type));
      if (![...topicTypes].some((type) => RICH_INTERACTIVE_TYPES.has(type))) topicWithoutRich += 1;
      if ([...topicTypes].every((type) => FAST_TYPES.has(type))) topicFastOnly += 1;

      for (const exercise of topic.exercises) {
        exerciseCount += 1;
        typeCounts[exercise.type] += 1;
        difficultyCounts[exercise.difficulty] += 1;
        if (exercise.type === "self-review") selfReviewCount += 1;
        if (exercise.listeningText) listeningCount += 1;
      }
    }

    const fastCount = typeCounts["multiple-choice"] + typeCounts["fill-in-blank"];
    const richInteractiveCount = [...RICH_INTERACTIVE_TYPES].reduce((sum, type) => sum + typeCounts[type], 0);
    const usedTypes = ALL_TYPES.filter((type) => typeCounts[type] > 0);

    return {
      grade,
      subjectId: subject.id,
      subject: subjectLabel(subject.id),
      topics: topics.length,
      exercises: exerciseCount,
      fastCount,
      fastShare: pct(fastCount, exerciseCount),
      richInteractiveCount,
      richInteractiveShare: pct(richInteractiveCount, exerciseCount),
      selfReviewCount,
      listeningCount,
      topicWithoutRich,
      topicFastOnly,
      usedTypes: usedTypes.join(", "),
      difficulty1: difficultyCounts[1],
      difficulty2: difficultyCounts[2],
      difficulty3: difficultyCounts[3],
      ...typeCounts,
    };
  });
});

const totals = rows.reduce((acc, row) => {
  acc.exercises += row.exercises;
  acc.fastCount += row.fastCount;
  acc.richInteractiveCount += row.richInteractiveCount;
  acc.selfReviewCount += row.selfReviewCount;
  acc.listeningCount += row.listeningCount;
  for (const type of ALL_TYPES) acc.typeCounts[type] += row[type];
  return acc;
}, {
  exercises: 0,
  fastCount: 0,
  richInteractiveCount: 0,
  selfReviewCount: 0,
  listeningCount: 0,
  typeCounts: Object.fromEntries(ALL_TYPES.map((type) => [type, 0])) as Record<ExerciseType, number>,
});

function addFinding(findings: Finding[], row: typeof rows[number]) {
  if (row.exercises < 20) return;

  if (row.richInteractiveShare === 0 && row.exercises >= 100) {
    findings.push({
      severity: "High",
      priority: 1,
      grade: row.grade,
      subject: row.subject,
      issue: "No rich interactive exercise type in a large subject set.",
      recommendation: "Add a first small batch of matching, drag-drop, memory, number-line or word-search tasks before adding more MC/fill-in.",
    });
  } else if (row.richInteractiveShare < 5 && row.exercises >= 200) {
    findings.push({
      severity: "High",
      priority: 2,
      grade: row.grade,
      subject: row.subject,
      issue: `Only ${row.richInteractiveShare}% rich interactive exercises.`,
      recommendation: "Prioritise this grade/subject for the next interaction-format enrichment pass.",
    });
  } else if (row.richInteractiveShare < 10 && row.fastShare >= 85) {
    findings.push({
      severity: "Medium",
      priority: 3,
      grade: row.grade,
      subject: row.subject,
      issue: `${row.fastShare}% of exercises are MC/fill-in and rich interaction is still below 10%.`,
      recommendation: "Add richer practice to the highest-volume topics first.",
    });
  }

  if (row.topicWithoutRich > Math.max(2, Math.ceil(row.topics * 0.75)) && row.exercises >= 100) {
    findings.push({
      severity: "Medium",
      priority: 4,
      grade: row.grade,
      subject: row.subject,
      issue: `${row.topicWithoutRich}/${row.topics} topics have no rich interactive exercise.`,
      recommendation: "Spread new rich types across topics instead of adding them all to one topic.",
    });
  }

  if (row.subjectId === "mi" && row.richInteractiveShare >= 30) {
    findings.push({
      severity: "Low",
      priority: 9,
      grade: row.grade,
      subject: row.subject,
      issue: "MI is now healthy on exercise-type variety.",
      recommendation: "Keep MI stable; do not expand it again until broader subjects catch up.",
    });
  }
}

const findings: Finding[] = [];
for (const row of rows) addFinding(findings, row);
findings.sort((a, b) => a.priority - b.priority || a.grade - b.grade || a.subject.localeCompare(b.subject));

const report = {
  generatedAt: new Date().toISOString(),
  verdict: findings.some((finding) => finding.severity === "High") ? "changes_recommended" : "approved_with_observations",
  interpretation: "Cleverli has all supported exercise types in the catalogue. MI is now balanced; the next quality opportunity is enriching older large subject sets that are still dominated by multiple-choice and fill-in-blank.",
  totals: {
    subjects: rows.length,
    exercises: totals.exercises,
    fastShare: pct(totals.fastCount, totals.exercises),
    richInteractiveShare: pct(totals.richInteractiveCount, totals.exercises),
    selfReviewCount: totals.selfReviewCount,
    listeningCount: totals.listeningCount,
    typeCounts: totals.typeCounts,
  },
  rows,
  findings,
};

const csvHeader = [
  "grade",
  "subjectId",
  "subject",
  "topics",
  "exercises",
  "fastShare",
  "richInteractiveShare",
  "topicWithoutRich",
  "topicFastOnly",
  "usedTypes",
  "difficulty1",
  "difficulty2",
  "difficulty3",
  ...ALL_TYPES,
];

const markdown = `# Exercise-Type Coverage Audit - 2026-09-01

## Verdict

${report.verdict}

${report.interpretation}

## Catalogue Summary

- Subjects scanned: ${report.totals.subjects}
- Exercises scanned: ${report.totals.exercises}
- MC/fill-in share: ${report.totals.fastShare}%
- Rich interactive share: ${report.totals.richInteractiveShare}%
- Self-review exercises: ${report.totals.selfReviewCount}
- Listening exercises: ${report.totals.listeningCount}

## Type Totals

| Type | Count |
|---|---:|
${ALL_TYPES.map((type) => `| ${type} | ${report.totals.typeCounts[type]} |`).join("\n")}

## Grade/Subject Matrix

| Grade | Subject | Topics | Exercises | MC/fill-in | Rich interactive | Topics w/o rich | Used types |
|---:|---|---:|---:|---:|---:|---:|---|
${rows.map((row) => `| ${row.grade} | ${row.subject} | ${row.topics} | ${row.exercises} | ${row.fastShare}% | ${row.richInteractiveShare}% | ${row.topicWithoutRich} | ${row.usedTypes} |`).join("\n")}

## Prioritised Findings

${findings.length ? findings.map((finding) => `- ${finding.severity}: Klasse ${finding.grade} ${finding.subject}: ${finding.issue} ${finding.recommendation}`).join("\n") : "- None."}

## Recommendation

Do not add more MI right now. The highest-value next content pass should add rich interaction formats to the older high-volume subjects with the weakest variety, while keeping LP21 topic level and wording constraints in each subject-specific QA.
`;

mkdirSync(QA_DIR, { recursive: true });
writeFileSync(path.join(QA_DIR, "coverage.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  path.join(QA_DIR, "coverage.csv"),
  `${csvHeader.join(",")}\n${rows.map((row) => csvHeader.map((key) => csvEscape(row[key as keyof typeof row])).join(",")).join("\n")}\n`,
);
writeFileSync(path.join(QA_DIR, "REPORT.md"), markdown);

console.log(JSON.stringify({
  verdict: report.verdict,
  subjects: report.totals.subjects,
  exercises: report.totals.exercises,
  fastShare: report.totals.fastShare,
  richInteractiveShare: report.totals.richInteractiveShare,
  highFindings: findings.filter((finding) => finding.severity === "High").length,
  report: path.relative(process.cwd(), path.join(QA_DIR, "REPORT.md")),
}, null, 2));
