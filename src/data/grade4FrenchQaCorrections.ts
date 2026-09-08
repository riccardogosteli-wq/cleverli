import type { Exercise } from "@/types/exercise";
import reviewed from "./grade4FrenchQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Verified Grade 4 French defects; only the German-interface localization boundary. */
export function applyGrade4FrenchQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
