import { getSubjects, getTopics } from "../src/data";
import { matchPunctuationOnlyAnswer } from "../src/lib/fillInBlankMatching";
import type { Exercise } from "../src/types/exercise";
import { getExerciseDuplicateKey } from "./exercise-duplicate-key";

const expectedGradeCounts: Record<number, number> = {
  1: 1863,
  2: 1752,
  3: 2002,
  4: 2501,
  5: 2900,
  6: 2900,
};

const selfReviewKeys = new Set([
  "5/english/environment-5/env5-42",
  "5/english/technology-5/tech5-36",
  "6/english/writing-skills-6/ws6-44",
]);

const constrainedKeys = new Set([
  "3/german/adjektive/aj30",
  "3/german/adjektive/aj32",
  "3/german/verben-konjugieren/vk46",
  "5/german/direkte-rede/g5d2",
  "5/german/direkte-rede/g5d4",
  "5/german/direkte-rede/g5dr1g",
  "5/german/rechtschreibung-5/rs5-16",
  "5/english/technology-5/tech5-38",
  "6/english/vocabulary-6/vb6-36",
  "6/english/culture-media-6/cm6-40",
  "6/english/culture-media-6/cm6-48",
]);

const malformedKeys = new Set([
  "2/math/laengen-messen/lm47",
  "2/german/wortfamilien/wf48",
  "3/math/rechnen-bis-1000/r25k",
  "5/science/mittelalter-5/ma5-30",
]);

const failures: string[] = [];
const exercises = new Map<string, Exercise>();
let total = 0;

for (let grade = 1; grade <= 6; grade += 1) {
  let gradeCount = 0;
  const duplicateGroups = new Map<string, string[]>();
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        const key = `${grade}/${subject.id}/${topic.id}/${exercise.legacyId ?? exercise.id}`;
        exercises.set(key, exercise);
        gradeCount += 1;
        total += 1;
        const contentKey = getExerciseDuplicateKey(exercise);
        duplicateGroups.set(contentKey, [...(duplicateGroups.get(contentKey) ?? []), key]);

        if (exercise.type === "multiple-choice" && !(exercise.options ?? []).includes(exercise.answer)) {
          failures.push(`${key}: German multiple-choice answer is absent from options`);
        }
      }
    }
  }
  if (gradeCount !== expectedGradeCounts[grade]) {
    failures.push(`Grade ${grade}: expected ${expectedGradeCounts[grade]} exercises, found ${gradeCount}`);
  }
  const exactDuplicates = [...duplicateGroups.values()].filter((group) => group.length > 1);
  const expectedDuplicates = 0;
  if (exactDuplicates.length !== expectedDuplicates) {
    failures.push(`Grade ${grade}: expected ${expectedDuplicates} exact duplicate groups, found ${exactDuplicates.length}`);
  }
}

const punctuationRows = [...exercises.entries()].filter(([, exercise]) =>
  exercise.type === "fill-in-blank" && matchPunctuationOnlyAnswer(exercise.answer, exercise.answer) === true
);
if (punctuationRows.length !== 48) {
  failures.push(`Expected 48 punctuation-only fill-ins, found ${punctuationRows.length}`);
}
const wrongPunctuation = [".", ",", "?", "!", ":", "«", "»", "..."];
for (const [key, exercise] of punctuationRows) {
  if (matchPunctuationOnlyAnswer(exercise.answer, exercise.answer) !== true) {
    failures.push(`${key}: correct punctuation is rejected`);
  }
  for (const candidate of wrongPunctuation) {
    const candidateMatchesExpected = candidate.replace(/\s+/gu, "") === exercise.answer.normalize("NFKC").replace(/\s+/gu, "");
    if (!candidateMatchesExpected && matchPunctuationOnlyAnswer(candidate, exercise.answer) !== false) {
      failures.push(`${key}: wrong punctuation ${JSON.stringify(candidate)} is accepted for ${JSON.stringify(exercise.answer)}`);
    }
  }
}
if (matchPunctuationOnlyAnswer("ordinary text", "ordinary text") !== null) {
  failures.push("Ordinary text was incorrectly routed through punctuation-only matching");
}

for (const key of selfReviewKeys) {
  const exercise = exercises.get(key);
  if (!exercise) failures.push(`${key}: missing`);
  else if (exercise.type !== "self-review" || (exercise.reviewCriteria?.length ?? 0) < 3) {
    failures.push(`${key}: expected guided self-review with at least three criteria`);
  }
}
for (const key of constrainedKeys) {
  const exercise = exercises.get(key);
  if (!exercise) failures.push(`${key}: missing`);
  else {
    const blanks = exercise.question.match(/___+/gu)?.length ?? 0;
    if (exercise.type !== "fill-in-blank" || blanks !== 1) {
      failures.push(`${key}: expected one objectively gradable fill-in blank, found type=${exercise.type} blanks=${blanks}`);
    }
  }
}

const lm47 = exercises.get("2/math/laengen-messen/lm47");
if (!lm47 || /m³|nein/iu.test(lm47.question)) failures.push("lm47 still contains abandoned prompt text");
const wf48 = exercises.get("2/german/wortfamilien/wf48");
if (!wf48 || wf48.answer !== "Gang" || /gegehe/iu.test(`${wf48.question} ${wf48.answer} ${wf48.hints.join(" ")}`)) {
  failures.push("wf48 is not the corrected word-family exercise");
}
const r25k = exercises.get("3/math/rechnen-bis-1000/r25k");
if (!r25k || r25k.answer !== "452" || /nein/iu.test(r25k.hints.join(" "))) failures.push("r25k still has a malformed subtraction hint");
const ma530 = exercises.get("5/science/mittelalter-5/ma5-30");
if (!ma530 || ma530.type !== "multiple-choice" || !(ma530.options ?? []).includes(ma530.answer) || /prager|nein/iu.test(ma530.question)) {
  failures.push("ma5-30 is not the corrected objective multiple-choice exercise");
}

for (const key of malformedKeys) {
  if (!exercises.has(key)) failures.push(`${key}: missing malformed-source repair target`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "passed",
  totalExercises: total,
  punctuationExercises: punctuationRows.length,
  selfReviewRepairs: selfReviewKeys.size,
  constrainedRepairs: constrainedKeys.size,
  malformedRepairs: malformedKeys.size,
}, null, 2));
