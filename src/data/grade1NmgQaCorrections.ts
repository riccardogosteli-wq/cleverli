import type { Exercise } from "@/types/exercise";
import reviewed from "./grade1NmgQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
const removedFields = reviewed.removedFields as Record<string, (keyof Exercise)[]>;
/** Exact canonical-ID patches from Grade 1 NMG review; invoked only for German. */
export function applyGrade1NmgQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  if (!patch) return exercise;
  const result = { ...exercise, ...patch };
  for (const field of removedFields[exercise.id] ?? []) delete result[field];
  return result;
}
