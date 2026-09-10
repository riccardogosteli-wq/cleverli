import type { Exercise } from "@/types/exercise";
import reviewed from "./grade6EnglishQaCorrections.json";

const patches = reviewed.patches as Record<string, Partial<Exercise>>;

/** Canonical-ID corrections for German-interface Grade 6 English. */
export function applyGrade6EnglishQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
