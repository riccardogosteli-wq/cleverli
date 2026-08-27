import type { Exercise } from "../src/types/exercise";

const normalise = (value: string) => value.trim().toLowerCase();

export function getExerciseDuplicateKey(exercise: Exercise): string {
  return JSON.stringify({
    type: exercise.type,
    question: normalise(exercise.question),
    options: (exercise.options ?? []).map(normalise),
    answer: normalise(exercise.answer),
    pairs: (exercise.pairs ?? []).map((pair) => [normalise(pair.label), pair.image ?? "", pair.emoji ?? ""]),
    dragItems: (exercise.dragItems ?? []).map((item) => [normalise(item.label), item.image ?? "", item.emoji ?? ""]),
    dropZones: (exercise.dropZones ?? []).map((zone) => normalise(zone.label)),
    numberLine: [exercise.numberMin ?? null, exercise.numberMax ?? null, exercise.numberStep ?? null],
    wordList: (exercise.wordList ?? []).map(normalise),
    gridSize: exercise.gridSize ?? null,
  });
}
