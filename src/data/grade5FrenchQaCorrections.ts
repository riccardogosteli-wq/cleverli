import type { Exercise } from "@/types/exercise";
import reviewed from "./grade5FrenchQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Reviewed Grade 5 French records, only at the German interface boundary. */
export function applyGrade5FrenchQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
