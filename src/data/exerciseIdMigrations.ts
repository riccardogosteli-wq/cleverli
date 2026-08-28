import migrations from "./generatedExerciseIdMigrations.json";
import type { Topic } from "@/types/exercise";

export interface ExerciseIdMigration {
  grade: number;
  subject: string;
  topicId: string;
  legacyId: string;
  canonicalId: string;
}

export const EXERCISE_ID_MIGRATIONS = migrations as ExerciseIdMigration[];

const migrationByLocation = new Map(
  EXERCISE_ID_MIGRATIONS.map((migration) => [
    `${migration.grade}/${migration.subject}/${migration.topicId}/${migration.legacyId}`,
    migration,
  ]),
);

export function applyExerciseIdMigrations(grade: number, subject: string, topics: Topic[]): Topic[] {
  return topics.map((topic) => ({
    ...topic,
    exercises: topic.exercises.map((exercise) => {
      const migration = migrationByLocation.get(`${grade}/${subject}/${topic.id}/${exercise.id}`);
      return migration
        ? { ...exercise, id: migration.canonicalId, legacyId: migration.legacyId }
        : exercise;
    }),
  }));
}
