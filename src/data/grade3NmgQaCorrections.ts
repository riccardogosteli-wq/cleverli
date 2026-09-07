import type { Exercise } from "@/types/exercise";
import reviewed from "./grade3NmgQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Verified Grade 3 NMG defects, keyed by globally unique ID; DE boundary only. */
export function applyGrade3NmgQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
