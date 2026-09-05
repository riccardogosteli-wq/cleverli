import { getSubjects, getTopics } from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import { getQuestionForDisplay, questionNeedsVisualEmoji } from "../src/lib/exerciseQuestionVisuals";
import type { Lang } from "../src/lib/i18n";

const emojiPattern = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator})/u;
const failures: string[] = [];
let checked = 0;
let rawQuestionEmojis = 0;
let removedDecorativeEmojis = 0;
let preservedVisualPrompts = 0;

const fixtures = [
  ["Was ist die Hälfte von 8? ✂️", "multiple-choice", "Was ist die Hälfte von 8?"],
  ["Das Doppelte von 5 ist ___. 🖐🖐", "fill-in-blank", "Das Doppelte von 5 ist ___."],
  ["Was kommt als nächstes? 🔴 🟢 🔴 🟢 🔴 ___", "fill-in-blank", "Was kommt als nächstes? 🔴 🟢 🔴 🟢 🔴 ___"],
  ["Welches Wort passt zu 🐶?", "multiple-choice", "Welches Wort passt zu 🐶?"],
] as const;

for (const [question, type, expected] of fixtures) {
  const actual = getQuestionForDisplay(question, type);
  if (actual !== expected) failures.push(`fixture ${JSON.stringify(question)}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const exercise of topic.exercises) {
        for (const locale of ["de", "en", "fr", "it"] as Lang[]) {
          const rawQuestion = locale === "en"
            ? exercise.questionEN ?? exercise.question
            : locale === "fr"
              ? exercise.questionFR ?? exercise.question
              : locale === "it"
                ? exercise.questionIT ?? exercise.question
                : exercise.question;
          const localized = localizeExercise(exercise, locale);
          const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}/${locale}`;
          const needsVisual = questionNeedsVisualEmoji(rawQuestion, exercise.type);
          const hasRawEmoji = emojiPattern.test(rawQuestion);
          const hasDisplayEmoji = emojiPattern.test(localized.question);

          checked += 1;
          if (hasRawEmoji) rawQuestionEmojis += 1;
          if (hasRawEmoji && !hasDisplayEmoji) removedDecorativeEmojis += 1;
          if (hasDisplayEmoji) preservedVisualPrompts += 1;
          if (!localized.question) failures.push(`${key}: empty display question`);
          if (hasDisplayEmoji && !needsVisual) failures.push(`${key}: decorative emoji remained in display question`);
          if (needsVisual && !hasDisplayEmoji) failures.push(`${key}: required visual prompt was removed`);
          if (exercise.type === "counting" && hasDisplayEmoji) failures.push(`${key}: counting prompt repeats its interactive visual`);
        }
      }
    }
  }
}

console.log(JSON.stringify({ checked, rawQuestionEmojis, removedDecorativeEmojis, preservedVisualPrompts, fixtures: fixtures.length, failures: failures.length, sampleFailures: failures.slice(0, 20) }, null, 2));
if (failures.length) process.exitCode = 1;
