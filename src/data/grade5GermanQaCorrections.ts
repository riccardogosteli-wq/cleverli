import type { Exercise } from "@/types/exercise";
import reviewed from "./grade5GermanQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Canonical-ID German-interface Grade 5 Deutsch verified defect repairs. */
export function applyGrade5GermanQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
