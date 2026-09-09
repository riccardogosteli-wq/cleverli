import type { Exercise } from "@/types/exercise";
import reviewed from "./grade5NmgQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Scoped German-interface corrections; renderer identities and foreign content stay unchanged. */
export function applyGrade5NmgQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
