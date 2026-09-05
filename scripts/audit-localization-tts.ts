import { getSubjects, getTopics } from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import { cleanSpeechForLanguage, getExerciseSpeechText } from "../src/hooks/useVoice";
import type { Lang } from "../src/lib/i18n";

const locales: Exclude<Lang, "de">[] = ["en", "fr", "it"];
const failures: string[] = [];
let checks = 0;

function subjectLanguage(subject: string): Lang | null {
  if (subject === "german") return "de";
  if (subject === "english") return "en";
  if (subject === "french") return "fr";
  return null;
}

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        for (const locale of locales) {
          const localized = localizeExercise(exercise, locale);
          const learningLanguage = subjectLanguage(subject.id);
          const speechLanguage: Lang = exercise.listeningText ? "de" : learningLanguage ?? locale;
          const clean = getExerciseSpeechText(exercise, localized, subject.id, speechLanguage);
          const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}/${locale}`;
          checks += 1;
          if (!clean) failures.push(`${key}: empty speech text`);
          if (clean.includes("___")) failures.push(`${key}: raw blank remains in speech text`);
          if (/[\u{1F000}-\u{1FFFF}]/u.test(clean)) failures.push(`${key}: emoji remains in speech text`);
        }
      }
    }
  }
}

const samples: Array<[Lang, string, string[]]> = [
  ["en", "___ + 3 = 8", ["blank", "plus", "equals"]],
  ["fr", "___ + 3 = 8", ["blanc", "plus", "égale"]],
  ["it", "___ + 3 = 8", ["spazio vuoto", "più", "uguale"]],
];
for (const [language, input, expected] of samples) {
  const clean = cleanSpeechForLanguage(input, language);
  expected.forEach((term) => { if (!clean.includes(term)) failures.push(`${language} sample missing ${term}: ${clean}`); });
}

console.log(JSON.stringify({ checks, sampleChecks: samples.length, failures: failures.length, sampleFailures: failures.slice(0, 20) }, null, 2));
if (failures.length) process.exitCode = 1;
