import { writeFileSync } from "node:fs";
import { getSubjects, getTopics } from "../src/data";
import type { Exercise } from "../src/types/exercise";

const subjectNames: Record<string, string> = {
  math: "Mathematik",
  german: "Deutsch",
  science: "Natur, Mensch, Gesellschaft",
  english: "Englisch",
  french: "Französisch",
};

function specialSolution(exercise: Exercise): string {
  if (exercise.type === "counting") {
    return exercise.emoji ? `${exercise.answer} × ${exercise.emoji}` : exercise.answer;
  }
  if (exercise.type === "matching" || exercise.type === "memory") {
    return (exercise.pairs ?? []).map(pair => `${pair.id}: ${pair.label}`).join(" | ");
  }
  if (exercise.type === "drag-drop") {
    const items = new Map((exercise.dragItems ?? []).map(item => [item.id, item.label]));
    const zones = new Map((exercise.dropZones ?? []).map(zone => [zone.id, zone.label]));
    return Object.entries(exercise.dropAnswers ?? {})
      .map(([itemId, zoneId]) => `${items.get(itemId) ?? itemId} → ${zones.get(zoneId) ?? zoneId}`)
      .join(" | ");
  }
  if (exercise.type === "number-line") {
    return `${exercise.answer} (Bereich ${exercise.numberMin}–${exercise.numberMax}, Schritt ${exercise.numberStep})`;
  }
  if (exercise.type === "word-search") {
    return (exercise.wordList ?? []).join(", ");
  }
  return exercise.answer;
}

function technicalStructure(exercise: Exercise): string {
  if (exercise.type === "matching" || exercise.type === "memory") return JSON.stringify(exercise.pairs ?? []);
  if (exercise.type === "drag-drop") {
    return JSON.stringify({ items: exercise.dragItems ?? [], zones: exercise.dropZones ?? [], answers: exercise.dropAnswers ?? {} });
  }
  if (exercise.type === "number-line") {
    return JSON.stringify({ min: exercise.numberMin, max: exercise.numberMax, step: exercise.numberStep, answer: exercise.answer });
  }
  if (exercise.type === "word-search") return JSON.stringify({ words: exercise.wordList ?? [], gridSize: exercise.gridSize });
  if (exercise.type === "counting") return JSON.stringify({ answer: exercise.answer, emoji: exercise.emoji });
  return "";
}

const grades = process.argv.slice(2).map(Number).filter(grade => Number.isInteger(grade) && grade >= 1 && grade <= 6);
if (!grades.length) throw new Error("Pass one or more grades, e.g. 2 3 4 5 6");

for (const grade of grades) {
  const rows: Record<string, unknown>[] = [];
  const topics: Record<string, unknown>[] = [];
  const seen = new Map<string, string>();
  const duplicateIds: { id: string; first: string; second: string }[] = [];

  for (const subject of getSubjects(grade)) {
    const subjectName = subjectNames[subject.id] ?? subject.id;
    for (const topic of getTopics(grade, subject.id)) {
      topics.push({ subject: subjectName, topicId: topic.id, topic: topic.title, count: topic.exercises.length });
      for (const exercise of topic.exercises) {
        const location = `${subject.id}/${topic.id}`;
        const first = seen.get(exercise.id);
        if (first) duplicateIds.push({ id: exercise.id, first, second: location });
        else seen.set(exercise.id, location);
        rows.push({
          grade,
          exerciseId: exercise.id,
          legacyExerciseId: exercise.legacyId ?? "",
          subject: subjectName,
          subjectId: subject.id,
          topic: topic.title,
          topicId: topic.id,
          type: exercise.type,
          difficulty: exercise.difficulty,
          question: exercise.listeningText ? `${exercise.question}\n[Hörtext: ${exercise.listeningText}]` : exercise.question,
          options: exercise.options ?? [],
          correct: specialSolution(exercise),
          storedAnswer: exercise.answer,
          hints: exercise.hints ?? [],
          structure: exercise.listeningText ? JSON.stringify({ listeningText: exercise.listeningText, interaction: technicalStructure(exercise) }) : technicalStructure(exercise),
          exercise,
        });
      }
    }
  }

  const output = { grade, rows, topics, duplicateIds };
  writeFileSync(`/tmp/cleverli-grade-${grade}-qa.json`, JSON.stringify(output));
  console.log(JSON.stringify({ grade, exercises: rows.length, topics: topics.length, duplicateIds: duplicateIds.length }));
}
