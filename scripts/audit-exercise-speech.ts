import { getSubjects, getTopics } from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import { getExerciseSpeechText } from "../src/hooks/useVoice";
import type { Exercise } from "../src/types/exercise";
import type { Lang } from "../src/lib/i18n";

const failures: string[] = [];
let checked = 0;
let mathChecked = 0;

function getExercise(grade: number, subject: string, topicId: string, exerciseId: string): Exercise {
  const exercise = getTopics(grade, subject)
    .find((topic) => topic.id === topicId)
    ?.exercises.find((candidate) => candidate.id === exerciseId);
  if (!exercise) throw new Error(`Missing fixture ${grade}/${subject}/${topicId}/${exerciseId}`);
  return exercise;
}

function expectSpeech(key: string, actual: string, expected: string) {
  if (actual !== expected) failures.push(`${key}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

const germanFixtures: Array<[string, Exercise, string]> = [
  ["double", getExercise(1, "math", "verdoppeln-halbieren", "v29"), "Was ist das Doppelte von zwei?"],
  ["next-number", getExercise(1, "math", "zahlen-1-10", "z6"), "Welche Zahl kommt nach sieben?"],
  ["missing-addend", getExercise(1, "math", "addition-bis-10", "a10"), "Welche Zahl plus drei ist gleich acht?"],
  ["worded-missing-addend", getExercise(1, "math", "addition-bis-10", "a27"), "Welche Zahl plus sieben ist gleich neun?"],
  ["first-letter", getExercise(1, "german", "buchstaben", "b8"), "Mit welchem Buchstaben beginnt das Wort Löwe?"],
  ["word-pair", getExercise(1, "german", "einfache-woerter", "ew19"), "Welches Wort passt zu Tisch?"],
  ["rhyme", getExercise(1, "german", "reime", "r9"), "Finde ein Reimwort zu Regen."],
  ["sentence-word", getExercise(2, "german", "adjektive-gr2", "ag2"), "Welches Wort ergänzt den Satz?"],
  ["sentence-marker", getExercise(2, "german", "satzzeichen", "sz40"), "Welches Zeichen oder Wort passt in die Lücke?"],
  ["two-pronouns", getExercise(2, "german", "pronomen", "pr43"), "Welche Wörter ergänzen die beiden Lücken?"],
  ["verb-form", getExercise(3, "german", "verben-konjugieren", "g3-german-verben-konjugieren-vk9"), "Welche Form von laufen passt zu Er?"],
  ["conjunction", getExercise(3, "german", "saetze", "g3-german-saetze-sb30"), "Welche Konjunktion ergänzt den Satz?"],
  ["dative-object", getExercise(5, "german", "satzarten-5", "sa5-6"), "Welches Dativobjekt ergänzt den Satz: Ich helfe …?"],
  ["canton-language", getExercise(4, "science", "kantone-schweiz-4", "kan4_20"), "Welche Sprachen spricht man im Kanton Freiburg?"],
];

for (const [key, exercise, expected] of germanFixtures) {
  const subject = key === "canton-language" ? "science" : key === "double" || key === "next-number" || key.includes("addend") ? "math" : "german";
  expectSpeech(key, getExerciseSpeechText(exercise, exercise, subject, "de"), expected);
}

const override: Exercise = {
  id: "speech-override",
  type: "fill-in-blank",
  question: "2 : ___",
  spokenPrompt: "Welche Zahl fehlt nach zwei geteilt durch?",
  answer: "1",
  hints: ["Hinweis eins", "Hinweis zwei"],
  difficulty: 1,
};
expectSpeech("explicit-override", getExerciseSpeechText(override, override, "math", "de"), "Welche Zahl fehlt nach zwei geteilt durch?");

const listening: Exercise = { ...override, listeningText: "Hör gut zu.", listeningLanguage: "de" };
expectSpeech("listening-priority", getExerciseSpeechText(listening, listening, "math", "de"), "Hör gut zu.");

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        for (const locale of ["de", "en", "fr", "it"] as Lang[]) {
          const localized = localizeExercise(exercise, locale);
          const learningLanguage: Lang | null = subject.id === "german" || subject.id === "mi"
            ? "de"
            : subject.id === "english"
              ? "en"
              : subject.id === "french"
                ? "fr"
                : null;
          const language: Lang = exercise.listeningText ? (exercise.listeningLanguage ?? "de") : learningLanguage ?? locale;
          const speech = getExerciseSpeechText(exercise, localized, subject.id, language);
          const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}/${locale}`;
          checked += 1;
          if (!speech) failures.push(`${key}: empty speech`);
          if (speech.includes("___")) failures.push(`${key}: raw blank`);
          if (/[\u{1F000}-\u{1FFFF}]/u.test(speech)) failures.push(`${key}: emoji remains`);
          if (subject.id === "math" && language === "de") {
            mathChecked += 1;
            if (/\bwas\?/.test(speech)) failures.push(`${key}: generic "was?" placeholder`);
            if (/^Lernrunde\s+\d+/i.test(speech)) failures.push(`${key}: spoken round label`);
          }
          if (language === "de" && /\bwas\?/.test(speech)) failures.push(`${key}: generic "was?" placeholder`);
        }
      }
    }
  }
}

console.log(JSON.stringify({ checked, mathChecked, fixtures: germanFixtures.length + 2, failures: failures.length, sampleFailures: failures.slice(0, 20) }, null, 2));
if (failures.length) process.exitCode = 1;
