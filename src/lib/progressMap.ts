/**
 * Progress Map System
 * 
 * Each topic has a 3-checkpoint roadmap:
 * - Checkpoint 1: Easy exercises (Difficulty 1)
 * - Checkpoint 2: Medium exercises (Difficulty 2)
 * - Checkpoint 3: Hard exercises (Difficulty 3+)
 * 
 * Completing all exercises at a checkpoint unlocks that mission.
 */

export interface Checkpoint {
  id: number;
  label: string;      // "Anfänger", "Fortgeschritten", "Meister"
  difficulty: number; // 1, 2, or 3
  exerciseCount: number; // How many exercises total
  reward: string;     // Mission unlocked message
  color: string;      // Tailwind color for visual
}

export interface ProgressMap {
  topicId: string;
  topicTitle: string;
  grade: number;
  subject: string;
  checkpoints: Checkpoint[];
  description: string;
}

/**
 * Checkpoint definitions (universal across all topics)
 */
export const CHECKPOINT_DEFINITIONS: Checkpoint[] = [
  {
    id: 1,
    label: "Anfänger",
    difficulty: 1,
    exerciseCount: 15,
    reward: "Mission Stufe 1 freigeschaltet! 🎯",
    color: "bg-green-100 border-green-400",
  },
  {
    id: 2,
    label: "Fortgeschritten",
    difficulty: 2,
    exerciseCount: 20,
    reward: "Mission Stufe 2 freigeschaltet! 🎯🎯",
    color: "bg-blue-100 border-blue-400",
  },
  {
    id: 3,
    label: "Meister",
    difficulty: 3,
    exerciseCount: 15,
    reward: "Mission Stufe 3 freigeschaltet! 🎯🎯🎯",
    color: "bg-purple-100 border-purple-400",
  },
];

/**
 * Build a progress map for a topic
 * Analyzes exercises by difficulty level and creates checkpoints
 */
export function buildProgressMap(
  topicId: string,
  topicTitle: string,
  grade: number,
  subject: string,
  exercisesByDifficulty: Record<number, number> // { 1: 15, 2: 20, 3: 12 }
): ProgressMap {
  return {
    topicId,
    topicTitle,
    grade,
    subject,
    checkpoints: CHECKPOINT_DEFINITIONS.map((cp) => ({
      ...cp,
      exerciseCount: exercisesByDifficulty[cp.difficulty] || 0,
    })),
    description: `${topicTitle} — Arbeite dich vom Anfänger bis zum Meister vor!`,
  };
}

/**
 * Calculate progress percentage for a checkpoint
 * (exercisesCompleted / totalExercises) * 100
 */
export function getCheckpointProgress(
  completedExercises: number,
  totalExercises: number
): number {
  if (totalExercises === 0) return 0;
  return Math.min(100, (completedExercises / totalExercises) * 100);
}

/**
 * Check if a checkpoint is completed
 */
export function isCheckpointCompleted(
  completedExercises: number,
  totalExercises: number
): boolean {
  return completedExercises >= totalExercises;
}

/**
 * Get milestone message for progress
 */
export function getMilestoneMessage(progress: number): string {
  if (progress === 0) return "Starten!";
  if (progress < 25) return "Guter Start!";
  if (progress < 50) return "Auf dem Weg!";
  if (progress < 75) return "Fast da!";
  if (progress < 100) return "Ein bisschen mehr!";
  return "Abgeschlossen! 🎉";
}

/**
 * Translations for checkpoint labels
 */
export const CHECKPOINT_LABELS = {
  de: { 1: "Anfänger", 2: "Fortgeschritten", 3: "Meister" },
  fr: { 1: "Débutant", 2: "Intermédiaire", 3: "Maître" },
  it: { 1: "Principiante", 2: "Intermedio", 3: "Maestro" },
  en: { 1: "Beginner", 2: "Intermediate", 3: "Expert" },
};

/**
 * Mission titles for each checkpoint
 */
export const MISSION_TITLES = {
  de: {
    1: "Mission Stufe 1",
    2: "Mission Stufe 2",
    3: "Mission Stufe 3",
  },
  fr: {
    1: "Mission Niveau 1",
    2: "Mission Niveau 2",
    3: "Mission Niveau 3",
  },
  it: {
    1: "Missione Livello 1",
    2: "Missione Livello 2",
    3: "Missione Livello 3",
  },
  en: {
    1: "Mission Level 1",
    2: "Mission Level 2",
    3: "Mission Level 3",
  },
};
