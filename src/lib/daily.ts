// ── Daily Challenge System ────────────────────────────────────────────────────
// Picks one exercise per day deterministically (same for all users on same day).
// Stores completion in localStorage so the badge shows on the dashboard.

import { Exercise, Topic } from "@/types/exercise";
import { getTopics } from "@/data/index";
export {
  DAILY_XP_BONUS,
  getDailyState,
  isDailyDoneToday,
  markDailyComplete,
  todayKey,
} from "@/lib/dailyState";
import { todayKey } from "@/lib/dailyState";

export interface DailyChallenge {
  date: string;          // "YYYY-MM-DD"
  grade: number;
  subject: string;
  topicId: string;
  exerciseId: string;
  exercise: Exercise;
  topic: Topic;
}

/** Deterministic seeded random based on date string */
function seededRand(seed: string, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % max;
}

export function getDailyChallenge(grade: number): DailyChallenge | null {
  const today = todayKey();
  const subjects = ["math", "german"];

  // Pick subject based on date
  const subjectIdx = seededRand(today + "subject", subjects.length);
  const subject = subjects[subjectIdx];

  const topics = getTopics(grade, subject);
  if (!topics.length) return null;

  // Pick topic
  const topicIdx = seededRand(today + "topic", topics.length);
  const topic = topics[topicIdx];
  if (!topic.exercises.length) return null;

  // Pick exercise (prefer free exercises for accessibility)
  const freeExercises = topic.exercises.filter((_, i) => i < 3);
  const pool = freeExercises.length > 0 ? freeExercises : topic.exercises;
  const exIdx = seededRand(today + "exercise", pool.length);
  const exercise = pool[exIdx];

  return { date: today, grade, subject, topicId: topic.id, exerciseId: exercise.id, exercise, topic };
}
