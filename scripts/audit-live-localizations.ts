import { writeFileSync } from "node:fs";

import { getSubjects, getTopics } from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import type { Lang } from "../src/lib/i18n";

const languages: Exclude<Lang, "de">[] = ["en", "fr", "it"];
const hardGerman = /\b(?:ergänze|ordne|berechne|rechne|schreibe|wähle|verbinde|setze|fehlenden|begleitsatz|anführungszeichen|zahlenstrahl|satzzeichen|wortart|doppelkonsonant|grosskreis|grundform|mehrzahl|einzahl|lösung)\b/giu;
const commonGerman = /\b(?:der|die|das|den|dem|ein|eine|einen|einem|einer|und|oder|ist|sind|war|waren|wird|werden|welche|welcher|welches|was|wie|wo|wann|warum|richtig|falsch|antwort|satz|wort|zahl|aufgabe|frage|heisst|kommt|steht|nach|vor|mit|ohne|für|aus|von|zur|zum)\b/giu;

function germanSignal(text: string): { hard: string[]; common: string[] } {
  return {
    hard: [...text.matchAll(hardGerman)].map((match) => match[0]),
    common: [...text.matchAll(commonGerman)].map((match) => match[0]),
  };
}

function isLanguageNeutral(text: string): boolean {
  return /^[\d\s.,:;!?+\-−–—*/×÷=%()[\]|_€$£'’"«»…]+$/u.test(text.trim());
}

const issues: Record<string, Array<Record<string, unknown>>> = {
  fallbackGermanQuestion: [],
  mixedGermanQuestion: [],
  mixedGermanAnswerOrOption: [],
  invalidLocalizedOptionAnswer: [],
  missingLocalizedQuestion: [],
  missingLocalizedTextAnswer: [],
};
const counts: Record<string, number> = {};

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}`;
        for (const language of languages) {
          const localized = localizeExercise(exercise, language);
          const suffix = language.toUpperCase() as "EN" | "FR" | "IT";
          const rawQuestion = exercise[`question${suffix}`];
          const questionSignal = germanSignal(localized.question);
          const fields = [localized.answer, ...(localized.options ?? [])].join(" | ");
          const fieldSignal = germanSignal(fields);
          counts[language] = (counts[language] ?? 0) + 1;

          if (!rawQuestion && !isLanguageNeutral(exercise.question)) {
            issues.missingLocalizedQuestion.push({ key, language, question: exercise.question });
          }
          const rawAnswer = exercise[`answer${suffix}`];
          if (
            (subject.id === "math" || subject.id === "science")
            && localized.type === "fill-in-blank"
            && rawQuestion
            && !rawAnswer
            && !isLanguageNeutral(exercise.answer)
          ) {
            issues.missingLocalizedTextAnswer.push({ key, language, question: localized.question, answer: localized.answer });
          }
          if (localized.question === exercise.question && (questionSignal.hard.length || questionSignal.common.length >= 2)) {
            issues.fallbackGermanQuestion.push({ key, language, question: localized.question, signal: questionSignal });
          } else if (questionSignal.hard.length || questionSignal.common.length >= 2) {
            issues.mixedGermanQuestion.push({ key, language, question: localized.question, signal: questionSignal });
          }
          if (fieldSignal.hard.length || fieldSignal.common.length >= 3) {
            issues.mixedGermanAnswerOrOption.push({ key, language, answer: localized.answer, options: localized.options, signal: fieldSignal });
          }
          if (localized.type === "multiple-choice" && localized.options && !localized.options.includes(localized.answer)) {
            issues.invalidLocalizedOptionAnswer.push({ key, language, answer: localized.answer, options: localized.options });
          }
        }
      }
    }
  }
}

const output = {
  checks: counts,
  issueCounts: Object.fromEntries(Object.entries(issues).map(([key, rows]) => [key, rows.length])),
  issues,
};
writeFileSync("/tmp/cleverli-live-localization-audit.json", JSON.stringify(output, null, 2));
console.log(JSON.stringify({ checks: counts, issueCounts: output.issueCounts }, null, 2));
