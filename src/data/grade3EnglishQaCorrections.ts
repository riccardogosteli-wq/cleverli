import type { Exercise } from "@/types/exercise";
import reviewed from "./grade3EnglishQaCorrections.json";
const patches = reviewed.patches as Record<string, Partial<Exercise>>;
/** Verified Grade 3 English defects; only the German-interface localization boundary. */
export function applyGrade3EnglishQaCorrections(exercise: Exercise): Exercise {
  const patch = patches[exercise.id];
  return patch ? { ...exercise, ...patch } : exercise;
}
