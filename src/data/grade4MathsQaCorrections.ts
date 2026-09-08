import type { Exercise } from "@/types/exercise";
import reviewed from "./grade4MathsQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Canonical-ID, German-only Grade 4 Maths verified-defect corrections. */
export function applyGrade4MathsQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
