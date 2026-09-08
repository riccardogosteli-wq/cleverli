import type { Exercise } from "@/types/exercise";
import reviewed from "./grade4EnglishQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Canonical-ID Grade 4 English corrections at the German interface boundary only. */
export function applyGrade4EnglishQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
