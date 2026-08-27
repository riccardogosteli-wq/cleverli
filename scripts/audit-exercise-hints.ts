import {
  getSubjects,
  getTopics,
  grade1Math, grade1German, grade1Science,
  grade2Math, grade2German, grade2Science,
  grade3Math, grade3German, grade3Science, grade3English,
  grade4Math, grade4German, grade4NT, grade4RZG, grade4English,
  grade5Math, grade5German, grade5NT, grade5RZG, grade5French, grade5English,
  grade6Math, grade6German, grade6NT, grade6RZG, grade6French, grade6English,
} from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import { isApprovedSafeHint } from "../src/lib/exerciseHints";
import { OPEN_WRITING_CHANGED_KEYS } from "../src/data/openWritingExercises";
import type { Exercise, Topic } from "../src/types/exercise";
import type { Lang } from "../src/lib/i18n";

const rawTopics: Record<string, Topic[]> = {
  "1-math": grade1Math, "1-german": grade1German, "1-science": grade1Science,
  "2-math": grade2Math, "2-german": grade2German, "2-science": grade2Science,
  "3-math": grade3Math, "3-german": grade3German, "3-science": grade3Science, "3-english": grade3English,
  "4-math": grade4Math, "4-german": grade4German, "4-science": [...grade4NT, ...grade4RZG], "4-english": grade4English,
  "5-math": grade5Math, "5-german": grade5German, "5-science": [...grade5NT, ...grade5RZG], "5-french": grade5French, "5-english": grade5English,
  "6-math": grade6Math, "6-german": grade6German, "6-science": [...grade6NT, ...grade6RZG], "6-french": grade6French, "6-english": grade6English,
};

const languages: Lang[] = ["de", "en", "fr", "it"];
const commonShortAnswers = new Set(["die", "der", "das", "den", "dem", "ein", "eine", "und", "was", "wer", "er", "es", "in", "an", "zu"]);
const unsafePattern = /\b(?:die antwort|die lösung|gesucht ist|richtig ist|the answer|the solution|correct is|la réponse|la solution|la bonne réponse|la risposta|la soluzione|la risposta corretta|(?:das wort|die antwort|die lösung)\s+beginnt mit|erst(?:e|en|er) (?:silbe|buchstabe)|schlüsselbegriff|(?:word|answer|solution)\s+starts with|first (?:letter|syllable)|(?:mot|réponse|solution)\s+commence par|première (?:lettre|syllabe)|(?:parola|risposta|soluzione)\s+inizia con|prima (?:lettera|sillaba)|sind falsch|ist falsch|are (?:wrong|incorrect)|is (?:wrong|incorrect)|sont (?:fausses|incorrectes)|est (?:fausse|incorrecte)|sono (?:sbagliate|errate)|è (?:sbagliata|errata))\b/i;
const unsafeLeadingPattern = /^(?:beginnt mit|starts with|commence par [«'\"]|inizia con)\b/i;

function normalise(value: string): string {
  return value.toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function containsAnswer(hint: string, answer: string): boolean {
  const normalisedHint = normalise(hint);
  const normalisedAnswer = normalise(answer);
  const candidates = [normalisedAnswer, ...normalisedAnswer.split(/\s*(?:\/|;|—)\s*/)]
    .filter((candidate, index, values) => candidate && values.indexOf(candidate) === index);

  return candidates.some((candidate) => {
    const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (/^-?\d+(?:[.,]\d+)?$/.test(candidate)) return new RegExp(`(^|[^\\d])${escaped}([^\\d]|$)`).test(normalisedHint);
    if (commonShortAnswers.has(candidate)) return false;
    return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, "u").test(normalisedHint);
  });
}

function validateHints(exercise: Exercise, language: Lang): string[] {
  const issues: string[] = [];
  const hints = exercise.hints;
  if (hints.length !== 2 || hints.some((hint) => !hint.trim())) issues.push("not exactly two populated hints");
  if (hints.some((hint) => !isApprovedSafeHint(hint) && containsAnswer(hint, exercise.answer))) issues.push("answer appears in hint");
  if (["all", "done"].includes(normalise(exercise.answer)) && hints.some((hint) => normalise(hint).includes(normalise(exercise.answer)))) issues.push("internal sentinel appears in hint");
  if (hints.some((hint) => !isApprovedSafeHint(hint) && (unsafePattern.test(hint) || unsafeLeadingPattern.test(hint.trim())))) issues.push("unsafe mechanical hint pattern");
  if (hints.some((hint) => /\.\.|!!|\?\?|,,/.test(hint))) issues.push("double punctuation in hint");
  return issues.map((issue) => `${language}: ${issue}`);
}

function withoutHints(exercise: Exercise): Omit<Exercise, "hints" | "hintsEN" | "hintsFR" | "hintsIT"> {
  const hintKeys = new Set(["hints", "hintsEN", "hintsFR", "hintsIT"]);
  return Object.fromEntries(Object.entries(exercise).filter(([key]) => !hintKeys.has(key))) as Omit<Exercise, "hints" | "hintsEN" | "hintsFR" | "hintsIT">;
}

const changedGermanRows: Record<number, number> = {};
const changedAnyLanguageRows: Record<number, number> = {};
const failures: Array<Record<string, unknown>> = [];
let exercises = 0;
let repairedDirectOneCharacterLeaks = 0;
const repairedDirectOneCharacterLeaksByGrade: Record<number, number> = {};

for (let grade = 1; grade <= 6; grade += 1) {
  let changedGerman = 0;
  let changedAnyLanguage = 0;
  for (const subject of getSubjects(grade)) {
    const source = new Map(
      (rawTopics[`${grade}-${subject.id}`] ?? []).flatMap((topic) =>
        topic.exercises.map((exercise) => [`${topic.id}/${exercise.id}`, exercise] as const),
      ),
    );

    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        exercises += 1;
        const original = source.get(`${topic.id}/${exercise.id}`);
        if (!original) throw new Error(`Missing raw source for ${grade}/${subject.id}/${topic.id}/${exercise.id}`);
        if (
          normalise(original.answer).length === 1
          && original.hints.some((hint) => /^Der gesuchte Buchstabe ist\b/i.test(hint.trim()))
        ) {
          repairedDirectOneCharacterLeaks += 1;
          repairedDirectOneCharacterLeaksByGrade[grade] = (repairedDirectOneCharacterLeaksByGrade[grade] ?? 0) + 1;
        }
        const exerciseKey = `${grade}/${subject.id}/${topic.id}/${exercise.id}`;
        if (
          !OPEN_WRITING_CHANGED_KEYS.has(exerciseKey)
          && JSON.stringify(withoutHints(original)) !== JSON.stringify(withoutHints(exercise))
        ) {
          failures.push({ grade, subject: subject.id, topic: topic.id, id: exercise.id, issues: ["non-hint exercise data changed"] });
        }
        if (JSON.stringify(original.hints) !== JSON.stringify(exercise.hints)) changedGerman += 1;
        if (
          JSON.stringify(original.hints) !== JSON.stringify(exercise.hints)
          || JSON.stringify(original.hintsEN) !== JSON.stringify(exercise.hintsEN)
          || JSON.stringify(original.hintsFR) !== JSON.stringify(exercise.hintsFR)
          || JSON.stringify(original.hintsIT) !== JSON.stringify(exercise.hintsIT)
        ) changedAnyLanguage += 1;

        for (const language of languages) {
          const localised = localizeExercise(exercise, language);
          const issues = validateHints(localised, language);
          if (issues.length) failures.push({ grade, subject: subject.id, topic: topic.id, id: exercise.id, issues });
        }
      }
    }
  }
  changedGermanRows[grade] = changedGerman;
  changedAnyLanguageRows[grade] = changedAnyLanguage;
}

if (repairedDirectOneCharacterLeaks !== 66) {
  failures.push({ issue: `expected 66 repaired direct one-character leaks, found ${repairedDirectOneCharacterLeaks}` });
}
const expectedDirectLeaksByGrade = { 1: 49, 2: 1, 5: 11, 6: 5 };
if (JSON.stringify(repairedDirectOneCharacterLeaksByGrade) !== JSON.stringify(expectedDirectLeaksByGrade)) {
  failures.push({ issue: "direct one-character leak grade distribution changed", expectedDirectLeaksByGrade, repairedDirectOneCharacterLeaksByGrade });
}

console.log(JSON.stringify({ exercises, languageChecks: exercises * languages.length, changedGermanRows, changedAnyLanguageRows, repairedDirectOneCharacterLeaks, repairedDirectOneCharacterLeaksByGrade, failures: failures.length }, null, 2));
if (failures.length) {
  console.error(JSON.stringify(failures.slice(0, 100), null, 2));
  process.exitCode = 1;
}
