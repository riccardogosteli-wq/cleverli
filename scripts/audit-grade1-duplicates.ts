import { getSubjects, getTopics } from "../src/data";
import type { Exercise } from "../src/types/exercise";
import { getExerciseDuplicateKey } from "./exercise-duplicate-key";

type LocatedExercise = {
  key: string;
  subject: string;
  topic: string;
  exercise: Exercise;
};

const groups = new Map<string, LocatedExercise[]>();
let total = 0;

for (const subject of getSubjects(1)) {
  for (const topic of getTopics(1, subject.id)) {
    for (const exercise of topic.exercises) {
      total += 1;
      const contentKey = getExerciseDuplicateKey(exercise);
      const located = {
        key: `${subject.id}/${topic.id}/${exercise.id}`,
        subject: subject.id,
        topic: topic.id,
        exercise,
      };
      groups.set(contentKey, [...(groups.get(contentKey) ?? []), located]);
    }
  }
}

const duplicates = [...groups.values()].filter((group) => group.length > 1);
const payload = {
  grade: 1,
  exercises: total,
  duplicateGroups: duplicates.length,
  duplicateRows: duplicates.reduce((sum, group) => sum + group.length, 0),
  groups: duplicates.map((group) => group.map(({ key, exercise }) => ({
    key,
    type: exercise.type,
    difficulty: exercise.difficulty,
    question: exercise.question,
    answer: exercise.answer,
    options: exercise.options ?? [],
  }))),
};

console.log(JSON.stringify(payload, null, 2));
if (duplicates.length && !process.argv.includes("--allow-existing")) process.exit(1);
