import type { Topic } from "@/types/exercise";

/**
 * Converts historical topic-scoped exercise IDs to their canonical IDs.
 * Unknown IDs are discarded and canonical IDs remain unchanged, making this
 * safe for localStorage and Supabase rows from before or after the migration.
 */
export function normaliseCorrectExerciseIds(topic: Topic, storedIds: string[]): Set<string> {
  const canonicalIds = new Set(topic.exercises.map((exercise) => exercise.id));
  const legacyToCanonical = new Map(
    topic.exercises
      .filter((exercise) => exercise.legacyId)
      .map((exercise) => [exercise.legacyId as string, exercise.id]),
  );

  const normalised = new Set<string>();
  for (const storedId of storedIds) {
    if (canonicalIds.has(storedId)) normalised.add(storedId);
    else {
      const canonicalId = legacyToCanonical.get(storedId);
      if (canonicalId) normalised.add(canonicalId);
    }
  }
  return normalised;
}
