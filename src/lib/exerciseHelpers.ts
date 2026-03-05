/**
 * Exercise helper functions for progress tracking
 */

import { Exercise } from "@/types/exercise";

export interface ExercisesByDifficulty {
  completed: Record<number, number>;
  total: Record<number, number>;
}

/**
 * Count exercises completed by difficulty level
 */
export function countExercisesByDifficulty(
  exercises: Exercise[],
  completedIds: string[]
): ExercisesByDifficulty {
  const completed: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  const total: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

  exercises.forEach((ex) => {
    const difficulty = ex.difficulty || 1;
    const level = Math.min(3, Math.max(1, difficulty)); // Clamp to 1-3

    total[level] = (total[level] || 0) + 1;

    if (completedIds.includes(ex.id)) {
      completed[level] = (completed[level] || 0) + 1;
    }
  });

  return { completed, total };
}

/**
 * Get all difficulty levels present in exercise set
 */
export function getDifficultyLevels(exercises: Exercise[]): number[] {
  const levels = new Set<number>();
  exercises.forEach((ex) => {
    const level = Math.min(3, Math.max(1, ex.difficulty || 1));
    levels.add(level);
  });
  return Array.from(levels).sort();
}

/**
 * Calculate progress percentage
 */
export function getProgressPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
}

/**
 * Determine checkpoint status
 */
export function isCheckpointComplete(completed: number, total: number): boolean {
  return total > 0 && completed >= total;
}
