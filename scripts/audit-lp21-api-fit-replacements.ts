import { getSubjects, getTopics } from "../src/data";
import {
  LP21_API_FIT_EXPANDED_TARGET_COUNT,
  LP21_API_FIT_ORIGINAL_TARGET_COUNT,
  LP21_API_FIT_TOPIC_TITLES,
  isLp21ApiFitTarget,
} from "../src/data/lp21ApiFitReplacements";
import targets from "../src/data/lp21ApiFitTargets.json";
import { TOPIC_TITLES, getTopicTitle } from "../src/data/topicTitles";
import type { Exercise } from "../src/types/exercise";
import { CONSOLIDATED_NMG_TOPIC_KEYS } from "../src/data/nmgConsolidation";

const EXPECTED_TYPES = { "multiple-choice": 582, "fill-in-blank": 544, "self-review": 10 } as const;
const EXPECTED_DIFFICULTIES = { 1: 335, 2: 452, 3: 349 } as const;
const FORBIDDEN_ADVANCED = /\b(?:passive voice|reported speech|third conditional|second conditional|conditionnel|imparfait|passé composé|COD|COI|plus-que-parfait|Gerundivum|Diathese|Metonymie|Pythagoras|Hypotenuse|Eukaryoten|Phagozytose|Mitose|Meiose|Ribosom|Chromosom|DNA|CRISPR|Epigenetik|Perowskit|Syllogismus|Prämisse|Konklusion|Diglossie|Lautverschiebung|Pidgin|Soziolekt|Idiolekt|Dysphemismus|Kreolsprache|Epiphora|Antiklimax|Oxymoron|Chiasmus|Litotes|Allegorie|Apostrophe|Synekdoche|Assonanz|Paronomasie|Polyptoton|Aposiopese|Quantitative Easing|Bruttoinlandprodukt|Fiskalpolitik|Geldpolitik|NATO|Faschismus|Kommunismus)\b/i;

type Failure = { key: string; reason: string };
const failures: Failure[] = [];
const found = new Map<string, Exercise>();
const signatures = new Map<string, string>();
const targetDuplicates: Array<[string, string]> = [];
const typeCounts: Record<string, number> = {};
const difficultyCounts: Record<string, number> = {};
const originalTargetKeys = new Set(targets.map((target) => `${target.grade}/${target.subject}/${target.topic}/${target.id}`));
const consolidatedTopics = new Set(CONSOLIDATED_NMG_TOPIC_KEYS);

function normalized(text: string): string {
  return text.toLocaleLowerCase("de-CH").replace(/[^a-z0-9äöüàâçéèêëîïôùûüÿœæ]+/giu, " ").trim();
}

function validateLocalizedChoice(key: string, exercise: Exercise, suffix: "" | "EN" | "FR" | "IT") {
  const answer = suffix ? exercise[`answer${suffix}`] : exercise.answer;
  const options = suffix ? exercise[`options${suffix}`] : exercise.options;
  if (!answer || !options || options.length !== 4 || new Set(options).size !== 4 || !options.includes(answer)) {
    failures.push({ key, reason: `invalid ${suffix || "DE"} multiple-choice answer/options` });
  }
}

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      const isConsolidatedTopic = subject.id === "science" && consolidatedTopics.has(`${grade}/${topic.id}`);
      const expectedTitle = LP21_API_FIT_TOPIC_TITLES[`${grade}/${subject.id}/${topic.id}`];
      if (expectedTitle && !isConsolidatedTopic && topic.title !== expectedTitle) failures.push({ key: `${grade}/${subject.id}/${topic.id}`, reason: "replacement topic title mismatch" });
      if (expectedTitle && !isConsolidatedTopic) {
        const expectedPublicTitle = topic.id === "weltall" ? "Weltall entdecken" : expectedTitle;
        if (getTopicTitle(topic.id, "de", topic.title) !== expectedPublicTitle) {
          failures.push({ key: `${grade}/${subject.id}/${topic.id}`, reason: "public German topic title mismatch" });
        }
        for (const language of ["de", "en", "fr", "it"] as const) {
          if (!TOPIC_TITLES[topic.id]?.[language]?.trim()) failures.push({ key: `${grade}/${subject.id}/${topic.id}`, reason: `missing public ${language} topic title` });
        }
      }
      for (const exercise of topic.exercises) {
        const key = `${grade}/${subject.id}/${topic.id}/${exercise.legacyId ?? exercise.id}`;
        const signature = `${grade}|${subject.id}|${normalized(exercise.question)}|${normalized(exercise.answer)}`;
        const previous = signatures.get(signature);
        if (previous && (isLp21ApiFitTarget(key) || isLp21ApiFitTarget(previous))) targetDuplicates.push([previous, key]);
        else if (!previous) signatures.set(signature, key);
        if (!isLp21ApiFitTarget(key)) continue;

        if (found.has(key)) failures.push({ key, reason: "target resolved more than once" });
        found.set(key, exercise);
        typeCounts[exercise.type] = (typeCounts[exercise.type] ?? 0) + 1;
        difficultyCounts[exercise.difficulty] = (difficultyCounts[exercise.difficulty] ?? 0) + 1;
        const allText = [exercise.question, exercise.answer, ...(exercise.options ?? [])].join(" ");
        if (FORBIDDEN_ADVANCED.test(allText)) failures.push({ key, reason: "advanced Cycle-3 concept remains" });
        if (!exercise.question.trim() || !exercise.answer.trim()) failures.push({ key, reason: "missing question or answer" });
        if ((exercise.hints ?? []).length !== 2) failures.push({ key, reason: "replacement must have exactly two hints" });

        if (exercise.type === "multiple-choice") {
          validateLocalizedChoice(key, exercise, "");
          if (!isConsolidatedTopic) {
            validateLocalizedChoice(key, exercise, "EN");
            validateLocalizedChoice(key, exercise, "FR");
            validateLocalizedChoice(key, exercise, "IT");
          }
        } else if (exercise.type === "fill-in-blank") {
          const questions = isConsolidatedTopic
            ? [["DE", exercise.question]] as const
            : [["DE", exercise.question], ["EN", exercise.questionEN], ["FR", exercise.questionFR], ["IT", exercise.questionIT]] as const;
          for (const [language, question] of questions) {
            if (!question || (question.match(/___/g) ?? []).length !== 1) failures.push({ key, reason: `${language} fill-in must contain exactly one blank` });
          }
        } else if (exercise.type === "self-review") {
          if (exercise.question.includes("___")) failures.push({ key, reason: "self-review contains a literal blank" });
          if ((exercise.reviewCriteria ?? []).length !== 3) failures.push({ key, reason: "self-review needs three criteria" });
        } else if (exercise.type === "drag-drop") {
          if ((exercise.dragItems ?? []).length !== 4 || (exercise.dropZones ?? []).length !== 2 || Object.keys(exercise.dropAnswers ?? {}).length !== 4) {
            failures.push({ key, reason: "drag-drop replacement must preserve a complete four-item interaction" });
          }
        } else {
          failures.push({ key, reason: `unexpected replacement type ${exercise.type}` });
        }

        if ((subject.id === "science" || subject.id === "german") && !isConsolidatedTopic) {
          for (const suffix of ["EN", "FR", "IT"] as const) {
            if (!exercise[`question${suffix}`] || !exercise[`answer${suffix}`] || (exercise[`hints${suffix}`] ?? []).length !== 2) {
              failures.push({ key, reason: `missing ${suffix} localisation` });
            }
          }
        }
      }
    }
  }
}

if (targets.length !== 743 || LP21_API_FIT_ORIGINAL_TARGET_COUNT !== 743 || originalTargetKeys.size !== 743) {
  failures.push({ key: "catalogue", reason: `expected 743 original API targets, found ${targets.length}/${LP21_API_FIT_ORIGINAL_TARGET_COUNT}/${originalTargetKeys.size}` });
}
if (found.size !== LP21_API_FIT_EXPANDED_TARGET_COUNT) failures.push({ key: "catalogue", reason: `resolved ${found.size} of ${LP21_API_FIT_EXPANDED_TARGET_COUNT} expanded targets` });
for (const key of originalTargetKeys) if (!found.has(key)) failures.push({ key, reason: "original API target missing from live catalogue" });
for (const [type, count] of Object.entries(EXPECTED_TYPES)) if (typeCounts[type] !== count) failures.push({ key: "types", reason: `${type}: expected ${count}, found ${typeCounts[type] ?? 0}` });
for (const [difficulty, count] of Object.entries(EXPECTED_DIFFICULTIES)) if (difficultyCounts[difficulty] !== count) failures.push({ key: "difficulties", reason: `${difficulty}: expected ${count}, found ${difficultyCounts[difficulty] ?? 0}` });
for (const [first, second] of targetDuplicates) failures.push({ key: second, reason: `duplicates ${first}` });

const previousScores = targets.reduce<Record<string, number>>((counts, target) => {
  counts[target.previousScore] = (counts[target.previousScore] ?? 0) + 1;
  return counts;
}, {});

console.log(JSON.stringify({
  originalApiTargets: targets.length,
  expandedFalseNegativeTargets: LP21_API_FIT_EXPANDED_TARGET_COUNT - targets.length,
  resolvedTargets: found.size,
  previousScores,
  types: typeCounts,
  difficulties: difficultyCounts,
  renamedTopics: Object.keys(LP21_API_FIT_TOPIC_TITLES).length,
  targetInvolvedDuplicates: targetDuplicates.length,
  failures: failures.length,
}, null, 2));

if (failures.length) {
  console.error(JSON.stringify(failures.slice(0, 100), null, 2));
  process.exit(1);
}
