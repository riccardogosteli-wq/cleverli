#!/usr/bin/env npx tsx

import { getSubjects, getTopics } from "../src/data";
import type { Exercise } from "../src/types/exercise";

const optionTypes = new Set(["multiple-choice", "counting"]);
const languages = {
  en: { label: "English", suffix: "EN" },
  fr: { label: "French", suffix: "FR" },
  it: { label: "Italian", suffix: "IT" },
} as const;

type Language = keyof typeof languages;
type LocalisedExercise = Exercise & Record<string, unknown>;

const lang = (process.argv[2] ?? "en") as Language;
const config = languages[lang];

if (!config) {
  console.error(`Unsupported language "${lang}". Use one of: ${Object.keys(languages).join(", ")}`);
  process.exit(1);
}

function resolveLocalisedAnswer(
  exercise: Exercise,
  localisedOptions: string[] | undefined,
  localisedAnswer: string | undefined,
) {
  if (localisedAnswer) return localisedAnswer;
  if (!exercise.options || !localisedOptions || exercise.options === localisedOptions) return exercise.answer;
  const answerIndex = exercise.options.findIndex(option => option === exercise.answer);
  return answerIndex >= 0 ? (localisedOptions[answerIndex] ?? exercise.answer) : exercise.answer;
}

function isNumericish(answer: string) {
  return /^[\d\s.,:;+\-−–—*/×÷=%()[\]|_]+$/.test(answer.trim());
}

const stats = {
  topics: 0,
  exercises: 0,
  language: lang,
  label: config.label,
  localisedQuestions: 0,
  optionExercisesWithLocalisedQuestion: 0,
  localisedOptionExercises: 0,
  optionExercisesMissingLocalisedOptions: 0,
  optionFailuresBeforeFallback: 0,
  optionFailuresAfterFallback: 0,
  fillLocalisedQuestions: 0,
  fillNumericAnswers: 0,
  fillTextAnswersWithoutLocalisedAnswer: 0,
};

const optionFailures: Array<Record<string, unknown>> = [];
const fillTextSamples: Array<Record<string, unknown>> = [];

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    const topics = getTopics(grade, subject.id);
    stats.topics += topics.length;

    for (const topic of topics) {
      for (const rawExercise of topic.exercises) {
        const exercise = rawExercise as LocalisedExercise;
        const question = exercise[`question${config.suffix}`] as string | undefined;
        const options = exercise[`options${config.suffix}`] as string[] | undefined;
        const answer = exercise[`answer${config.suffix}`] as string | undefined;

        stats.exercises += 1;
        if (question) stats.localisedQuestions += 1;

        if (optionTypes.has(exercise.type) && question) {
          stats.optionExercisesWithLocalisedQuestion += 1;
          if (!options) stats.optionExercisesMissingLocalisedOptions += 1;
        }

        if (optionTypes.has(exercise.type) && options) {
          stats.localisedOptionExercises += 1;
          if (!options.includes(String(exercise.answer))) stats.optionFailuresBeforeFallback += 1;

          const resolvedAnswer = resolveLocalisedAnswer(rawExercise, options, answer);
          if (!options.includes(String(resolvedAnswer))) {
            stats.optionFailuresAfterFallback += 1;
            optionFailures.push({
              grade,
              subject: subject.id,
              topic: topic.id,
              id: exercise.id,
              answer: exercise.answer,
              resolvedAnswer,
              [`options${config.suffix}`]: options,
            });
          }
        }

        if (exercise.type === "fill-in-blank" && question) {
          stats.fillLocalisedQuestions += 1;
          if (isNumericish(String(exercise.answer))) {
            stats.fillNumericAnswers += 1;
          } else if (!answer) {
            stats.fillTextAnswersWithoutLocalisedAnswer += 1;
            if (fillTextSamples.length < 20) {
              fillTextSamples.push({
                grade,
                subject: subject.id,
                topic: topic.id,
                id: exercise.id,
                [`question${config.suffix}`]: question,
                answer: exercise.answer,
              });
            }
          }
        }
      }
    }
  }
}

console.log(JSON.stringify(stats, null, 2));

if (optionFailures.length > 0) {
  console.error(`\n${config.label} option-answer failures after fallback:`);
  console.error(JSON.stringify(optionFailures.slice(0, 20), null, 2));
}

if (fillTextSamples.length > 0) {
  console.log(`\nText fill-in-blank ${config.label} samples still needing content review:`);
  console.log(JSON.stringify(fillTextSamples, null, 2));
}

if (stats.optionFailuresAfterFallback > 0) process.exit(1);
