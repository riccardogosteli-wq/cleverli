import type { Exercise } from "../src/types/exercise";
import { getSubjects, getTopics } from "../src/data";
import targets from "../src/data/gradeSuitabilityTargets.json";
import { reviewGradeSuitability } from "./grade-suitability-review";

const exercise = (question: string, answer: string, options?: string[], difficulty: 1 | 2 | 3 = 1): Exercise => ({
  id: "regression",
  type: options ? "multiple-choice" : "fill-in-blank",
  question,
  answer,
  options,
  hints: ["Denke nach.", "Prüfe deine Antwort."],
  difficulty,
});

const cases: Array<{ name: string; grade: number; subject: string; topic: string; item: Exercise; minimum: number; maximum?: number }> = [
  { name: "old Grade-1 ie/ei near-miss spelling pattern", grade: 1, subject: "german", topic: "ie-ei", item: exercise("Welches Wort wird mit ie geschrieben?", "Tier", ["Tier", "Teir", "Tir", "Tiehr"]), minimum: 4 },
  { name: "Grade-1 exoskeleton terminology", grade: 1, subject: "science", topic: "tiere", item: exercise("Was ist ein Exoskelett?", "Aussenskelett"), minimum: 4 },
  { name: "Grade-2 passive terminology", grade: 2, subject: "german", topic: "verben", item: exercise("Bestimme das Passiv.", "wird gebaut"), minimum: 4 },
  { name: "Grade-3 volume formalism", grade: 3, subject: "math", topic: "groessen", item: exercise("Berechne das Volumen des Würfels.", "125 cm³"), minimum: 4 },
  { name: "Grade-4 spectroscopy", grade: 4, subject: "science", topic: "materie", item: exercise("Was zeigt die Spektroskopie?", "ein Spektrum"), minimum: 5 },
  { name: "Grade-5 Gini coefficient", grade: 5, subject: "science", topic: "wirtschaft", item: exercise("Was misst der Gini-Koeffizient?", "Ungleichheit"), minimum: 5 },
  { name: "Grade-6 Snell law", grade: 6, subject: "science", topic: "physik", item: exercise("Nutze Snellius für die Brechung.", "Brechungswinkel"), minimum: 5 },
  { name: "Unicode-leading ecological niche term", grade: 4, subject: "science", topic: "oekologie", item: exercise("Was ist eine ökologische Nische?", "Rolle einer Art im Ökosystem"), minimum: 4 },
  { name: "Grade-2 three-digit multiplication", grade: 2, subject: "math", topic: "schaetzen", item: exercise("Schätze 498 × 6.", "3000"), minimum: 4 },
  { name: "simple Grade-1 counting", grade: 1, subject: "math", topic: "zahlen-1-10", item: exercise("3 + 2 = ___", "5"), minimum: 1, maximum: 2 },
  { name: "simple Grade-2 reading", grade: 2, subject: "german", topic: "texte-lesen", item: exercise("Lina hat einen Ball. Was hat Lina?", "einen Ball"), minimum: 1, maximum: 2 },
];

const failures: string[] = [];
for (const test of cases) {
  const review = reviewGradeSuitability(test.grade, test.subject, test.topic, test.item);
  if (review.score < test.minimum || (test.maximum !== undefined && review.score > test.maximum)) {
    failures.push(`${test.name}: expected ${test.minimum}-${test.maximum ?? 5}, got ${review.score} (${review.reason})`);
  }
}

const targetKeys = new Set(targets.map((target) => `${target.grade}/${target.subject}/${target.topic}/${target.id}`));
const resolved = new Set<string>();
const targetTypes: Record<string, number> = {};
for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const item of topic.exercises) {
        const key = `${grade}/${subject.id}/${topic.id}/${item.legacyId ?? item.id}`;
        if (!targetKeys.has(key)) continue;
        resolved.add(key);
        targetTypes[item.type] = (targetTypes[item.type] ?? 0) + 1;
        const review = reviewGradeSuitability(grade, subject.id, topic.id, item);
        if (review.score > 3) failures.push(`${key}: repaired target exceeds the accepted 1–3 range with score ${review.score} (${review.reason})`);
      }
    }
  }
}
if (targets.length !== 393 || targetKeys.size !== 393 || resolved.size !== 393) {
  failures.push(`target resolution mismatch: rows=${targets.length}, unique=${targetKeys.size}, resolved=${resolved.size}`);
}
if (targetTypes["multiple-choice"] !== 220 || targetTypes["fill-in-blank"] !== 172 || targetTypes["drag-drop"] !== 1) {
  failures.push(`target type preservation mismatch: ${JSON.stringify(targetTypes)}`);
}

console.log(JSON.stringify({ cases: cases.length, repairedTargets: resolved.size, targetTypes, failures }, null, 2));
if (failures.length) process.exit(1);
