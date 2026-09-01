import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getCatalogSubjects, getTopicSummaries } from "../src/data/topicCatalog";
import {
  createCurriculumSelection,
  getAvailableCurriculumSubjectIds,
  type SwissCanton,
} from "../src/lib/curriculumProfiles";

const QA_DIR = path.join(process.cwd(), ".qa/parent-dashboard-v2-2026-09-01");
const PARENTS_PAGE = path.join(process.cwd(), "src/app/parents/PageClient.tsx");

const representativeCantons: SwissCanton[] = ["ZH", "BE", "AI", "SO", "LU", "UR"];
const failures: string[] = [];

mkdirSync(QA_DIR, { recursive: true });

const source = readFileSync(PARENTS_PAGE, "utf8");
for (const required of [
  "buildSubjectCoverage",
  "getAvailableCurriculumSubjectIds",
  "getTopicSummaries",
  "subjectCoverage.map",
  "nextPractice",
  "curriculumLabel",
]) {
  if (!source.includes(required)) failures.push(`Parent dashboard source missing ${required}`);
}

const coverageRows: {
  profile: string;
  grade: number;
  subject: string;
  topics: number;
  exercises: number;
}[] = [];

for (const canton of representativeCantons) {
  const selection = createCurriculumSelection(canton, "de");
  for (const grade of [1, 2, 3, 4, 5, 6]) {
    const allowed = new Set(getAvailableCurriculumSubjectIds(grade, selection));
    const visibleSubjects = getCatalogSubjects(grade).filter(subject => allowed.has(subject.id));
    if (visibleSubjects.length === 0) failures.push(`${canton} grade ${grade}: no visible subjects`);
    for (const subject of visibleSubjects) {
      const topics = getTopicSummaries(grade, subject.id);
      const exercises = topics.reduce((sum, topic) => sum + topic.exerciseCount, 0);
      coverageRows.push({ profile: `${canton}-DE`, grade, subject: subject.id, topics: topics.length, exercises });
      if (topics.length === 0) failures.push(`${canton} grade ${grade} ${subject.id}: no topics`);
      if (exercises === 0) failures.push(`${canton} grade ${grade} ${subject.id}: no exercises`);
    }
  }
}

for (const grade of [3, 4, 5, 6]) {
  const miExercises = getTopicSummaries(grade, "mi").reduce((sum, topic) => sum + topic.exerciseCount, 0);
  if (miExercises !== 54) failures.push(`grade ${grade} MI expected 54 exercises, found ${miExercises}`);
}

for (const grade of [3, 4, 5, 6]) {
  const mathTopics = getTopicSummaries(grade, "math");
  if (!mathTopics.some(topic => topic.exerciseCount > 50)) {
    failures.push(`grade ${grade} math enrichment not visible in topic catalogue`);
  }
}

for (const grade of [4, 5, 6]) {
  const nmgTopics = getTopicSummaries(grade, "science");
  if (!nmgTopics.some(topic => topic.exerciseCount > 50)) {
    failures.push(`grade ${grade} NMG enrichment not visible in topic catalogue`);
  }
  for (const subject of ["english", "french"]) {
    const topics = getTopicSummaries(grade, subject);
    if (!topics.some(topic => topic.exerciseCount > 50)) {
      failures.push(`grade ${grade} ${subject} enrichment not visible in topic catalogue`);
    }
  }
}

writeFileSync(
  path.join(QA_DIR, "coverage.json"),
  JSON.stringify(coverageRows, null, 2),
);

writeFileSync(
  path.join(QA_DIR, "REPORT.md"),
  `# Parent Dashboard V2 QA - 2026-09-01

Verdict: ${failures.length === 0 ? "approved" : "changes_requested"}

Checks:
- Parent dashboard builds subject coverage from the generated topic catalogue.
- Parent dashboard filters subjects through canton/curriculum availability.
- Parent dashboard exposes untouched subjects, topic totals, exercise totals, next practice and curriculum profile context.
- Representative LP21 profiles checked: ${representativeCantons.map(canton => `${canton}-DE`).join(", ")}.
- Recent enriched MI, NMG, language and Math exercise counts are visible through the catalogue.

Coverage rows checked: ${coverageRows.length}
Failures: ${failures.length}

${failures.map(item => `- ${item}`).join("\n") || "No failures."}
`,
);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Parent dashboard V2 QA approved: ${coverageRows.length} coverage rows checked.`);
