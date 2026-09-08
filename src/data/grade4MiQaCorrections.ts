import type { Exercise } from "@/types/exercise";
import reviewed from "./grade4MiQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Verified Grade 4 MI defects; German-interface localization boundary only. */
export function applyGrade4MiQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
