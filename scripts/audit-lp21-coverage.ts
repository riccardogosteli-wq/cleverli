import { getTopics } from "../src/data";

const OFFICIAL_COMPETENCE_AREAS = {
  german: ["Hören", "Lesen", "Sprechen", "Schreiben", "Sprache(n) im Fokus", "Literatur im Fokus"],
  math: ["Zahl und Variable", "Form und Raum", "Grössen, Funktionen, Daten und Zufall"],
  nmg: Array.from({ length: 12 }, (_, index) => `NMG.${index + 1}`),
} as const;

const EXPECTED_TOPIC_COUNTS: Record<number, Record<string, number>> = {
  1: { math: 13, german: 9, science: 12 },
  2: { math: 13, german: 9, science: 11 },
  3: { math: 10, german: 8, science: 12 },
  4: { math: 9, german: 9, science: 21 },
  5: { math: 9, german: 9, science: 21 },
  6: { math: 9, german: 9, science: 21 },
};

const OPEN_COVERAGE_FINDINGS = [
  { grades: [1, 2], area: "Deutsch", finding: "No dedicated listening, speaking or composition strand" },
  { grades: [3, 4, 5, 6], area: "Deutsch", finding: "No dedicated listening or speaking strand" },
  { grades: [4], area: "Mathematik", finding: "No dedicated data, diagrams or probability topic" },
  { grades: [1], area: "NMG", finding: "Parallel senses and weather strands create overrepresentation" },
  { grades: [3], area: "NMG", finding: "Parallel energy, light, time and map strands create overrepresentation" },
  { grades: [4], area: "NMG", finding: "Parallel body, energy, light and map strands create overrepresentation" },
  { grades: [5], area: "NMG", finding: "Parallel space, electricity and history/time strands create overrepresentation" },
  { grades: [6], area: "NMG", finding: "Parallel space, electricity and history/time strands create overrepresentation" },
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

const grade4MathTitles = getTopics(4, "math").map((topic) => topic.title).join(" ");
if (/Daten|Diagramm|Wahrscheinlichkeit/i.test(grade4MathTitles)) {
  failures.push("Grade 4 mathematics coverage gap changed; re-review the documented finding");
}

for (const grade of [1, 2, 3, 4, 5, 6]) {
  const germanTitles = getTopics(grade, "german").map((topic) => topic.title).join(" ");
  if (/Hören|Sprechen|Mündlich/i.test(germanTitles)) {
    failures.push(`Grade ${grade} German now has an oral-language topic; re-review the documented gap`);
  }
}

console.log(JSON.stringify({
  officialCompetenceAreas: OFFICIAL_COMPETENCE_AREAS,
  topicCounts,
  openCoverageFindings: OPEN_COVERAGE_FINDINGS,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
