import type { Exercise } from "@/types/exercise";
import reviewed from "./grade4GermanQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Canonical-ID German-interface Grade 4 Deutsch verified defect repairs. */
export function applyGrade4GermanQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
