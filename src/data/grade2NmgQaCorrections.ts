import type { Exercise } from "@/types/exercise";
import reviewed from "./grade2NmgQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Verified Grade 2 NMG defects, keyed by globally unique ID; DE boundary only. */
export function applyGrade2NmgQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
