import type { Exercise } from "@/types/exercise";
import reviewed from "./grade6MiQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Verified Grade 6 MI defects; German-interface localization boundary only. */
export function applyGrade6MiQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
