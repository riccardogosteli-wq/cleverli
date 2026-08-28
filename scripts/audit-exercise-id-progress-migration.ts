import { getSubjects, getTopics, getTopicsBeforeExerciseIdMigration } from "../src/data";
import { EXERCISE_ID_MIGRATIONS } from "../src/data/exerciseIdMigrations";
import { normaliseCorrectExerciseIds } from "../src/lib/exerciseIdProgress";

const failures: string[] = [];
let topicsChecked = 0;
let prefixesChecked = 0;
let aliasChecks = 0;

for (let grade = 1; grade <= 6; grade += 1) {
  for (const { id: subject } of getSubjects(grade)) {
    const beforeTopics = getTopicsBeforeExerciseIdMigration(grade, subject);
    const afterTopics = getTopics(grade, subject);
    beforeTopics.forEach((beforeTopic, topicIndex) => {
      const afterTopic = afterTopics[topicIndex];
      topicsChecked += 1;
      const expectedByLegacy = new Map(afterTopic.exercises.map((exercise) => [exercise.legacyId ?? exercise.id, exercise.id]));

      for (let completed = 0; completed <= beforeTopic.exercises.length; completed += 1) {
        const historicalIds = beforeTopic.exercises.slice(0, completed).map((exercise) => exercise.id);
        const expected = historicalIds.map((id) => expectedByLegacy.get(id));
        const normalised = normaliseCorrectExerciseIds(afterTopic, JSON.parse(JSON.stringify(historicalIds)) as string[]);
        prefixesChecked += 1;
        if (normalised.size !== completed || expected.some((id) => !id || !normalised.has(id))) {
          failures.push(`${grade}/${subject}/${beforeTopic.id}: ${completed} historical completions became ${normalised.size}`);
        }
        const idempotent = normaliseCorrectExerciseIds(afterTopic, [...normalised]);
        if (idempotent.size !== normalised.size || [...normalised].some((id) => !idempotent.has(id))) {
          failures.push(`${grade}/${subject}/${beforeTopic.id}: canonical normalisation is not idempotent`);
        }
      }

      const unknown = normaliseCorrectExerciseIds(afterTopic, ["__unknown_exercise_id__"]);
      if (unknown.size !== 0) failures.push(`${grade}/${subject}/${beforeTopic.id}: unknown ID was retained`);
    });
  }
}

for (const migration of EXERCISE_ID_MIGRATIONS) {
  const topic = getTopics(migration.grade, migration.subject).find((candidate) => candidate.id === migration.topicId);
  if (!topic) {
    failures.push(`Missing migrated topic ${migration.grade}/${migration.subject}/${migration.topicId}`);
    continue;
  }
  const normalised = normaliseCorrectExerciseIds(topic, [migration.legacyId, migration.canonicalId, migration.legacyId]);
  aliasChecks += 1;
  if (normalised.size !== 1 || !normalised.has(migration.canonicalId)) {
    failures.push(`${migration.grade}/${migration.subject}/${migration.topicId}/${migration.legacyId}: alias did not deduplicate to canonical ID`);
  }
}

console.log(JSON.stringify({ topicsChecked, prefixesChecked, aliasChecks, failures: failures.length, sampleFailures: failures.slice(0, 20) }, null, 2));
if (failures.length) process.exitCode = 1;
