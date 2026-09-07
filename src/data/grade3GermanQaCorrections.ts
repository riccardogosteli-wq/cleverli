import type { Exercise } from "@/types/exercise";
import reviewed from "./grade3GermanQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Canonical-ID, German-only Grade 3 Deutsch verified defect repairs. */
export function applyGrade3GermanQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
