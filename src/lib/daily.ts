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

const DAILY_RENDERABLE_TYPES = new Set<Exercise["type"]>([
  "multiple-choice",
  "fill-in-blank",
  "self-review",
  "counting",
]);

export function isDailyRenderableExercise(exercise: Exercise): boolean {
  return DAILY_RENDERABLE_TYPES.has(exercise.type) && !exercise.listeningText?.trim();
}

function getDailyExercisePool(topic: Topic): Exercise[] {
  const eligibleExercises = topic.exercises.filter(isDailyRenderableExercise);
  const freeExercises = topic.exercises
    .filter((_, index) => index < 3)
    .filter(isDailyRenderableExercise);
  return freeExercises.length > 0 ? freeExercises : eligibleExercises;
}

export function getDailyChallenge(grade: number, date = todayKey()): DailyChallenge | null {
  const today = date;
  const subjects = ["math", "german"];

  // Pick subject based on date
  const subjectIdx = seededRand(today + "subject", subjects.length);
  const subject = subjects[subjectIdx];

  const topics = getTopics(grade, subject);
  if (!topics.length) return null;

  // Pick a topic, falling forward deterministically if the seeded topic has
  // no exercise that Daily can render safely.
  const startTopicIdx = seededRand(today + "topic", topics.length);
  for (let offset = 0; offset < topics.length; offset++) {
    const topic = topics[(startTopicIdx + offset) % topics.length];
    const pool = getDailyExercisePool(topic);
    if (!pool.length) continue;

    const exerciseSeed = offset === 0 ? `${today}exercise` : `${today}exercise${offset}`;
    const exIdx = seededRand(exerciseSeed, pool.length);
    const exercise = pool[exIdx];

    return { date: today, grade, subject, topicId: topic.id, exerciseId: exercise.id, exercise, topic };
  }

  return null;
}
