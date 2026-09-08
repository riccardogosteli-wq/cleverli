import type { Exercise } from "@/types/exercise";
import reviewed from "./grade4NmgQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Canonical-ID Grade 4 NMG corrections, applied only at the German interface boundary. */
export function applyGrade4NmgQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
