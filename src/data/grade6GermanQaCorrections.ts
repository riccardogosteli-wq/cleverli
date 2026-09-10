import type { Exercise } from "@/types/exercise";
import reviewed from "./grade6GermanQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Canonical-ID German-interface Grade 6 Deutsch verified defect repairs. */
export function applyGrade6GermanQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
