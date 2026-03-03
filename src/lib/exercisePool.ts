/**
 * Exercise Pool & Rotation
 *
 * Ensures kids get different exercises each session.
 * - Tracks recently shown exercise IDs per topic
 * - Fresh exercises shown first, then cycles back through stale ones
 * - Respects EXERCISES_PER_SESSION cap (default 10)
 */

import { Exercise } from "@/types/exercise";

const POOL_KEY_PREFIX = "cleverli_pool_";
const EXERCISES_PER_SESSION = 10;
const RECENT_MEMORY = 20; // how many IDs to remember (avoids repeats for ~2 sessions)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRecentlyShown(topicId: string): string[] {
  try {
    const raw = localStorage.getItem(POOL_KEY_PREFIX + topicId);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecentlyShown(topicId: string, ids: string[]) {
  try {
    localStorage.setItem(POOL_KEY_PREFIX + topicId, JSON.stringify(ids.slice(0, RECENT_MEMORY)));
  } catch { /* ignore */ }
}

/**
 * Select exercises for a session.
 * - If pool has ≤ EXERCISES_PER_SESSION items, return all (shuffled)
 * - Otherwise: prefer exercises not shown recently
 * - Records shown IDs after selection so next session gets fresh ones
 */
export function selectExercises(topicId: string, allExercises: Exercise[], count = EXERCISES_PER_SESSION): Exercise[] {
  if (allExercises.length <= count) {
    // Small pool — just shuffle every time
    return shuffle(allExercises);
  }

  const recentIds = getRecentlyShown(topicId);

  // Partition into fresh (not recently shown) and stale (recently shown)
  const fresh = allExercises.filter(e => !recentIds.includes(e.id ?? ""));
  const stale = allExercises.filter(e => recentIds.includes(e.id ?? ""));

  // Build session: fresh first, then stale if needed
  const pool = [...shuffle(fresh), ...shuffle(stale)];
  const selected = pool.slice(0, count);

  // Save shown IDs — prepend new ones so most recent are at front
  const newRecent = [
    ...selected.map(e => e.id ?? ""),
    ...recentIds,
  ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

  saveRecentlyShown(topicId, newRecent);
  return selected;
}

export { EXERCISES_PER_SESSION };
