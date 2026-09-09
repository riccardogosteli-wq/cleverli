import type { Exercise } from "@/types/exercise";
import reviewed from "./grade5EnglishQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Canonical Grade 5 English IDs, applied only at the German interface boundary. */
export function applyGrade5EnglishQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
