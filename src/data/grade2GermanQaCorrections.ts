import type { Exercise } from "@/types/exercise";
import reviewed from "./grade2GermanQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
const removedFields = reviewed.removedFields as Record<string, (keyof Exercise)[]>;
/** Canonical-ID Grade2 Deutsch review patches; German localization only. */
export function applyGrade2GermanQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  if (!patch) return exercise;
  const result = { ...exercise, ...patch };
  for (const field of removedFields[exercise.id] ?? []) delete result[field];
  return result;
}
