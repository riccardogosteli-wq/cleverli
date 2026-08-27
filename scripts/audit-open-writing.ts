import { writeFileSync } from "node:fs";

import { getSubjects, getTopics } from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import {
  OPEN_WRITING_CONSTRAINED_COUNT,
  OPEN_WRITING_CHANGED_KEYS,
  OPEN_WRITING_SELF_REVIEW_COUNT,
} from "../src/data/openWritingExercises";
import type { Exercise } from "../src/types/exercise";

const expectedGradeCounts: Record<number, number> = {
  1: 1863,
  2: 1752,
  3: 2002,
  4: 2501,
  5: 2900,
  6: 2900,
};

const reviewedDeterministicPrompts = new Set([
  "2/science/wasser/w20",
  "3/german/saetze/sb51",
  "3/english/greetings-3/gr3-36",
  "3/english/colours-shapes-3/cs3-36",
  "3/english/colours-shapes-3/cs3-44",
  "3/english/school-objects-3/so3-38",
  "3/english/family-friends-3/ff3-40",
  "3/english/food-drink-3/fd3-14",
  "4/english/my-daily-routine-4/dr4-50",
  "4/english/sports-hobbies-4/sh4-34",
  "4/english/sports-hobbies-4/sh4-38",
  "4/english/weather-seasons-4/ws4-46",
  "4/english/past-simple-4/ps4-40",
  "5/german/wortarten-5/wa5-4",
  "5/german/wortarten-5/wa5-14",
  "5/french/bonjour-5/bj5-48",
  "5/french/chiffres-5/ch5-40",
  "5/french/chiffres-5/ch5-44",
  "5/french/chiffres-5/ch5-48",
  "5/french/chiffres-5/ch5-50",
  "5/english/present-continuous-5/pc5-38",
  "5/english/present-continuous-5/pc5-48",
  "5/english/present-continuous-5/pc5-50",
  "5/english/future-plans-5/fp5-40",
  "5/english/past-experiences-5/pe5-44",
  "5/english/environment-5/env5-36",
  "6/french/passe-compose-6/pc6-44",
  "6/french/passe-compose-6/pc6-50",
  "6/french/futur-simple-6/fs6-44",
  "6/french/ville-directions-6/vd6-38",
  "6/french/sante-corps-6/sc6-38",
  "6/english/reported-speech-6/rs6-50",
  "6/english/exam-skills-6/ex6-24",
]);

const openPromptPattern = /\b(?:write (?:a |one |two |three |3 |about |your |an |full |complete |a short |a formal |a sentence|a paragraph)|describe |explain .*own words|evaluate |name \d|my favourite .*___|your favourite|écris |écrivez |rédigez |rédige |décris |décrivez |présentez |donne les directions|raconte |nommez |nenne (?:ein|zwei|drei|3)|beschreibe|begründe|erfinde|formuliere|deine meinung|eigenen worten)\b/i;
const placeholderAnswerPattern = /\b(?:open|any)\b|\[(?:name|place|prénom|âge|ville|pays)\]/i;
const tooAdvancedCycle2Pattern = /\b(?:formal essay|PEEL|P-E-E|second conditional|three different cohesive devices|2 phrases complexes|3-sentence environmental argument)\b/i;

const failures: string[] = [];
const selfReviewKeys = new Set<string>();
const countsByGrade = new Map<number, number>();
const countsByGradeSubject = new Map<string, number>();
const allKeys = new Set<string>();
const changedRows: Array<Record<string, unknown>> = [];

const subjectNames: Record<string, string> = {
  math: "Mathematik",
  german: "Deutsch",
  science: "Natur, Mensch, Gesellschaft",
  english: "Englisch",
  french: "Französisch",
};

function fail(message: string) {
  failures.push(message);
}

function validateSelfReview(key: string, exercise: Exercise) {
  selfReviewKeys.add(key);
  const gradeSubject = key.split("/").slice(0, 2).join("/");
  countsByGradeSubject.set(gradeSubject, (countsByGradeSubject.get(gradeSubject) ?? 0) + 1);

  if (!exercise.answer.trim() || placeholderAnswerPattern.test(exercise.answer)) {
    fail(`${key}: invalid example answer '${exercise.answer}'`);
  }
  if (tooAdvancedCycle2Pattern.test(`${exercise.question} ${exercise.answer}`)) {
    fail(`${key}: Cycle-3-style writing demand remains`);
  }
  if ((exercise.reviewCriteria ?? []).length !== 3) {
    fail(`${key}: expected three review criteria`);
  }
  if (exercise.hints.length !== 2) {
    fail(`${key}: expected two safe hints`);
  }

  for (const lang of ["de", "en", "fr", "it"] as const) {
    const localized = localizeExercise(exercise, lang);
    if ((localized.reviewCriteria ?? []).length !== 3) {
      fail(`${key}: ${lang} review criteria missing`);
    }
    if (localized.hints.length !== 2 || localized.hints.some((hint) => !hint.trim())) {
      fail(`${key}: ${lang} hints invalid`);
    }
  }
}

for (let grade = 1; grade <= 6; grade += 1) {
  let gradeCount = 0;
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        gradeCount += 1;
        const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}`;
        if (allKeys.has(key)) fail(`${key}: duplicate scoped exercise key`);
        allKeys.add(key);

        if (OPEN_WRITING_CHANGED_KEYS.has(key)) {
          changedRows.push({
            key,
            grade,
            exerciseId: exercise.id,
            subject: subjectNames[subject.id] ?? subject.id,
            topic: topic.title,
            type: exercise.type,
            difficulty: exercise.difficulty,
            question: exercise.question,
            options: exercise.options ?? [],
            answer: exercise.answer,
            hints: exercise.hints,
          });
        }

        if (exercise.type === "self-review") {
          validateSelfReview(key, exercise);
          continue;
        }

        const looksOpen = exercise.type === "fill-in-blank"
          && (openPromptPattern.test(exercise.question) || placeholderAnswerPattern.test(exercise.answer));
        if (looksOpen && !reviewedDeterministicPrompts.has(key)) {
          fail(`${key}: likely open response still exact-scored`);
        }
      }
    }
  }
  countsByGrade.set(grade, gradeCount);
  if (gradeCount !== expectedGradeCounts[grade]) {
    fail(`Grade ${grade}: expected ${expectedGradeCounts[grade]} exercises, found ${gradeCount}`);
  }
}

if (selfReviewKeys.size !== OPEN_WRITING_SELF_REVIEW_COUNT) {
  fail(`Expected ${OPEN_WRITING_SELF_REVIEW_COUNT} self-review exercises, found ${selfReviewKeys.size}`);
}

if (changedRows.length !== OPEN_WRITING_CHANGED_KEYS.size) {
  fail(`Expected ${OPEN_WRITING_CHANGED_KEYS.size} changed rows, found ${changedRows.length}`);
}

const changedQuestionKeys = new Map<string, string[]>();
for (const row of changedRows) {
  const normalized = String(row.question).toLocaleLowerCase().replace(/\s+/g, " ").trim();
  changedQuestionKeys.set(normalized, [...(changedQuestionKeys.get(normalized) ?? []), String(row.key)]);
}
for (const keys of changedQuestionKeys.values()) {
  if (keys.length > 1) fail(`Duplicate changed question: ${keys.join(", ")}`);
}

if (OPEN_WRITING_CONSTRAINED_COUNT !== 8) {
  fail(`Expected 8 constrained fixes, found ${OPEN_WRITING_CONSTRAINED_COUNT}`);
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

writeFileSync("/tmp/cleverli-open-writing-manifest.json", JSON.stringify({ rows: changedRows }, null, 2));

console.log(JSON.stringify({
  ok: true,
  totalExercises: [...countsByGrade.values()].reduce((sum, value) => sum + value, 0),
  selfReviewExercises: selfReviewKeys.size,
  constrainedExercises: OPEN_WRITING_CONSTRAINED_COUNT,
  byGradeSubject: Object.fromEntries([...countsByGradeSubject.entries()].sort()),
  reviewedDeterministicPrompts: reviewedDeterministicPrompts.size,
}, null, 2));
