import { Topic } from "@/types/exercise";

export interface TierInfo {
  easy: { total: number; done: number };
  medium: { total: number; done: number };
  hard: { total: number; done: number };
  isTiered: boolean; // true if all 3 difficulties present with ≥5 each
  easyBoundary: number;   // number of easy exercises
  mediumBoundary: number; // easy + medium exercises
}

export function getTierProgress(topic: Topic, completed: number): TierInfo {
  const easy   = topic.exercises.filter(e => e.difficulty === 1);
  const medium = topic.exercises.filter(e => e.difficulty === 2);
  const hard   = topic.exercises.filter(e => e.difficulty === 3);

  const isTiered = easy.length >= 5 && medium.length >= 5 && hard.length >= 5;
  const easyBoundary   = easy.length;
  const mediumBoundary = easy.length + medium.length;

  return {
    easy:   { total: easy.length,   done: Math.min(completed, easyBoundary) },
    medium: { total: medium.length, done: Math.max(0, Math.min(completed - easyBoundary, medium.length)) },
    hard:   { total: hard.length,   done: Math.max(0, completed - mediumBoundary) },
    isTiered,
    easyBoundary,
    mediumBoundary,
  };
}

/** Which tier is the exercise at index `idx` in? */
export function tierAtIndex(tierInfo: TierInfo, idx: number): "easy" | "medium" | "hard" {
  if (idx < tierInfo.easyBoundary) return "easy";
  if (idx < tierInfo.mediumBoundary) return "medium";
  return "hard";
}
