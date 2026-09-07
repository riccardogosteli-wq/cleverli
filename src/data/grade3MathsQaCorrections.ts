import type { Exercise } from "@/types/exercise";
import reviewed from "./grade3MathsQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Final-stage German-only, canonical-ID Grade 3 Maths defect corrections. */
export function applyGrade3MathsQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
