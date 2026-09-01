import { getSubjects, getTopicsAfterExerciseIdMigrationBeforeEditorial, getTopicsBeforeExerciseIdMigration } from "../src/data";
import { EXERCISE_ID_MIGRATIONS } from "../src/data/exerciseIdMigrations";

const failures: string[] = [];
const beforeSeen = new Map<string, string>();
const beforeDuplicateIds = new Set<string>();
let beforeDuplicateOccurrences = 0;
const afterSeen = new Map<string, string>();
const migrationByLocation = new Map(EXERCISE_ID_MIGRATIONS.map((migration) => [
  `${migration.grade}/${migration.subject}/${migration.topicId}/${migration.legacyId}`,
  migration,
]));
const usedMigrations = new Set<string>();
let exerciseCount = 0;

function withoutMigrationFields(value: Record<string, unknown>) {
  const copy = { ...value };
  delete copy.id;
  delete copy.legacyId;
  return copy;
}

for (let grade = 1; grade <= 6; grade += 1) {
  for (const { id: subject } of getSubjects(grade)) {
    const beforeTopics = getTopicsBeforeExerciseIdMigration(grade, subject);
    const afterTopics = getTopicsAfterExerciseIdMigrationBeforeEditorial(grade, subject);
    if (beforeTopics.length !== afterTopics.length) failures.push(`${grade}/${subject}: topic count changed`);

    beforeTopics.forEach((beforeTopic, topicIndex) => {
      const afterTopic = afterTopics[topicIndex];
      if (!afterTopic || beforeTopic.id !== afterTopic.id) {
        failures.push(`${grade}/${subject}: topic order changed at ${beforeTopic.id}`);
        return;
      }
      if (beforeTopic.exercises.length !== afterTopic.exercises.length) failures.push(`${grade}/${subject}/${beforeTopic.id}: exercise count changed`);

      beforeTopic.exercises.forEach((beforeExercise, exerciseIndex) => {
        exerciseCount += 1;
        const afterExercise = afterTopic.exercises[exerciseIndex];
        const location = `${grade}/${subject}/${beforeTopic.id}`;
        const locationKey = `${location}/${beforeExercise.id}`;
        const first = beforeSeen.get(beforeExercise.id);
        if (first) {
          beforeDuplicateOccurrences += 1;
          beforeDuplicateIds.add(beforeExercise.id);
        } else beforeSeen.set(beforeExercise.id, location);

        if (!afterExercise) return;
        if (JSON.stringify(withoutMigrationFields(beforeExercise as unknown as Record<string, unknown>)) !== JSON.stringify(withoutMigrationFields(afterExercise as unknown as Record<string, unknown>))) {
          failures.push(`${locationKey}: content changed during ID migration`);
        }

        const migration = migrationByLocation.get(locationKey);
        if (migration) {
          usedMigrations.add(locationKey);
          if (afterExercise.id !== migration.canonicalId || afterExercise.legacyId !== migration.legacyId) {
            failures.push(`${locationKey}: expected ${migration.canonicalId} with legacy alias`);
          }
        } else if (afterExercise.id !== beforeExercise.id || afterExercise.legacyId) {
          failures.push(`${locationKey}: unexpected migration`);
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(afterExercise.id)) failures.push(`${locationKey}: unsafe canonical ID ${afterExercise.id}`);
        if (afterExercise.id.length > 120) failures.push(`${locationKey}: canonical ID exceeds telemetry limit`);
        const afterFirst = afterSeen.get(afterExercise.id);
        if (afterFirst) failures.push(`Canonical collision ${afterExercise.id}: ${afterFirst} / ${location}`);
        else afterSeen.set(afterExercise.id, location);
      });
    });
  }
}

if (exerciseCount !== 15_034) failures.push(`Expected 15,034 exercises, found ${exerciseCount}`);
if (beforeDuplicateOccurrences !== 1_220) failures.push(`Expected 1,220 legacy duplicate occurrences, found ${beforeDuplicateOccurrences}`);
if (beforeDuplicateIds.size !== 1_107) failures.push(`Expected 1,107 colliding legacy IDs, found ${beforeDuplicateIds.size}`);
if (EXERCISE_ID_MIGRATIONS.length !== 1_220) failures.push(`Expected 1,220 migrations, found ${EXERCISE_ID_MIGRATIONS.length}`);
if (usedMigrations.size !== EXERCISE_ID_MIGRATIONS.length) failures.push(`Only ${usedMigrations.size}/${EXERCISE_ID_MIGRATIONS.length} migrations were used`);
if (afterSeen.size !== exerciseCount) failures.push(`Expected ${exerciseCount} globally unique canonical IDs, found ${afterSeen.size}`);

console.log(JSON.stringify({
  exerciseCount,
  legacyUniqueIds: beforeSeen.size,
  legacyCollidingIds: beforeDuplicateIds.size,
  legacyDuplicateOccurrences: beforeDuplicateOccurrences,
  migrations: EXERCISE_ID_MIGRATIONS.length,
  canonicalUniqueIds: afterSeen.size,
  failures: failures.length,
  sampleFailures: failures.slice(0, 20),
}, null, 2));

if (failures.length) process.exitCode = 1;
