import type { Exercise } from "@/types/exercise";
import reviewed from "./grade6MathsQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Exact-ID German-interface Grade 6 Maths corrections. */
export function applyGrade6MathsQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
