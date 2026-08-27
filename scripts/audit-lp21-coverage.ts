import { getTopics } from "../src/data";
import { CONSOLIDATED_NMG_TOPIC_KEYS } from "../src/data/nmgConsolidation";

const OFFICIAL_COMPETENCE_AREAS = {
  german: ["Hören", "Lesen", "Sprechen", "Schreiben", "Sprache(n) im Fokus", "Literatur im Fokus"],
  math: ["Zahl und Variable", "Form und Raum", "Grössen, Funktionen, Daten und Zufall"],
  nmg: Array.from({ length: 12 }, (_, index) => `NMG.${index + 1}`),
} as const;

const EXPECTED_TOPIC_COUNTS: Record<number, Record<string, number>> = {
  1: { math: 13, german: 11, science: 12 },
  2: { math: 13, german: 11, science: 11 },
  3: { math: 10, german: 9, science: 12 },
  4: { math: 10, german: 10, science: 21 },
  5: { math: 9, german: 10, science: 21 },
  6: { math: 9, german: 10, science: 21 },
};

const OPEN_COVERAGE_FINDINGS = [
  { grades: [1, 2, 3, 4, 5, 6], area: "Deutsch", finding: "Dedicated listening added; speaking strand remains absent" },
] as const;

const failures: string[] = [];
const topicCounts: Record<number, Record<string, number>> = {};
for (const grade of [1, 2, 3, 4, 5, 6]) {
  topicCounts[grade] = {};
  for (const subject of ["math", "german", "science"]) {
    const count = getTopics(grade, subject).length;
    topicCounts[grade][subject] = count;
    if (count !== EXPECTED_TOPIC_COUNTS[grade][subject]) {
      failures.push(`Grade ${grade} ${subject}: expected ${EXPECTED_TOPIC_COUNTS[grade][subject]} topics, found ${count}`);
    }
  }
}

for (const key of CONSOLIDATED_NMG_TOPIC_KEYS) {
  const [gradeText, topicId] = key.split("/");
  const topic = getTopics(Number(gradeText), "science").find(candidate => candidate.id === topicId);
  if (!topic || topic.exercises.length !== 50) failures.push(`Consolidated NMG topic ${key} is incomplete`);
}

const grade4DataTopic = getTopics(4, "math").find(topic => topic.id === "daten-diagramme-zufall-4");
if (!grade4DataTopic || grade4DataTopic.exercises.length !== 50) failures.push("Grade 4 mathematics data/probability strand is incomplete");

for (const grade of [1, 2]) {
  const topic = getTopics(grade, "german").find(candidate => candidate.id === `gefuehrtes-schreiben-${grade}`);
  if (!topic || topic.exercises.length !== 50) failures.push(`Grade ${grade} guided-composition strand is incomplete`);
}

for (const grade of [1, 2, 3, 4, 5, 6]) {
  const topic = getTopics(grade, "german").find(candidate => candidate.id === `hoerverstehen-${grade}`);
  if (!topic || topic.exercises.length !== 50 || topic.exercises.some(exercise => !exercise.listeningText)) failures.push(`Grade ${grade} listening-comprehension strand is incomplete`);
}

console.log(JSON.stringify({
  officialCompetenceAreas: OFFICIAL_COMPETENCE_AREAS,
  topicCounts,
  openCoverageFindings: OPEN_COVERAGE_FINDINGS,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
