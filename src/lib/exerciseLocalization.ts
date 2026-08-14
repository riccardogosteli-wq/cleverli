import type { Exercise } from "@/types/exercise";
import type { Lang } from "@/lib/i18n";

function resolveLocalizedAnswer(exercise: Exercise, localizedOptions?: string[], localizedAnswer?: string) {
  if (localizedAnswer) return localizedAnswer;
  if (!exercise.options || !localizedOptions || exercise.options === localizedOptions) return exercise.answer;

  const answerIndex = exercise.options.findIndex((option) => option === exercise.answer);
  return answerIndex >= 0 ? (localizedOptions[answerIndex] ?? exercise.answer) : exercise.answer;
}

export function localizeExercise(exercise: Exercise, lang: Lang): Exercise {
  if (lang === "en") return {
    ...exercise,
    question: exercise.questionEN ?? exercise.question,
    hints: exercise.hintsEN ?? exercise.hints,
    options: exercise.optionsEN ?? exercise.options,
    answer: resolveLocalizedAnswer(exercise, exercise.optionsEN, exercise.answerEN),
  };
  if (lang === "fr") return {
    ...exercise,
    question: exercise.questionFR ?? exercise.question,
    hints: exercise.hintsFR ?? exercise.hints,
    options: exercise.optionsFR ?? exercise.options,
    answer: resolveLocalizedAnswer(exercise, exercise.optionsFR, exercise.answerFR),
  };
  if (lang === "it") return {
    ...exercise,
    question: exercise.questionIT ?? exercise.question,
    hints: exercise.hintsIT ?? exercise.hints,
    options: exercise.optionsIT ?? exercise.options,
    answer: resolveLocalizedAnswer(exercise, exercise.optionsIT, exercise.answerIT),
  };
  return exercise;
}
