import { getSubjects, getTopics } from "../src/data";
import type { Exercise } from "../src/types/exercise";

const failures: string[] = [];
const exercises = new Map<string, Exercise>();

function germanStrings(exercise: Exercise): string[] {
  return [
    exercise.question,
    exercise.answer,
    ...(exercise.options ?? []),
    ...(exercise.altAnswers ?? []),
    ...exercise.hints,
    ...(exercise.reviewCriteria ?? []),
    ...(exercise.explanation ? [exercise.explanation] : []),
    ...(exercise.pairs ?? []).map((item) => item.label),
    ...(exercise.dragItems ?? []).map((item) => item.label),
    ...(exercise.dropZones ?? []).map((item) => item.label),
    ...(exercise.wordList ?? []),
  ];
}

for (const subject of getSubjects(5)) {
  for (const topic of getTopics(5, subject.id)) {
    for (const exercise of topic.exercises) {
      const key = `${subject.id}/${topic.id}/${exercise.id}`;
      exercises.set(key, exercise);
      for (const value of germanStrings(exercise)) {
        if (/«\s[^»]*»|«[^»]*\s»/u.test(value)) {
          failures.push(`${key}: French spacing remains in ${JSON.stringify(value)}`);
        }
      }
      if (exercise.type === "multiple-choice" && !(exercise.options ?? []).includes(exercise.answer)) {
        failures.push(`${key}: answer is absent from options`);
      }
    }
  }
}

const commaRule = exercises.get("german/direkte-rede/g5dr2p");
if (
  !commaRule
  || commaRule.answer !== "«Kommst du?», fragte sie."
  || !commaRule.hints.some((hint) => /Begleitsatz.*Komma|Komma.*Begleitsatz/iu.test(hint))
) {
  failures.push("german/direkte-rede/g5dr2p: the question-mark plus Begleitsatz comma rule is not correct");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "passed",
  grade: 5,
  exercises: exercises.size,
  frenchSpacingViolations: 0,
  commaRuleVerified: true,
}, null, 2));
