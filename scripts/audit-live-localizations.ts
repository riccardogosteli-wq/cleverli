import { writeFileSync } from "node:fs";

import { getSubjects, getTopics } from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import type { Lang } from "../src/lib/i18n";
import type { Exercise } from "../src/types/exercise";
import { MATH_TRANSLATION_GLOSSARY } from "./math-translation-glossary";

const languages: Exclude<Lang, "de">[] = ["en", "fr", "it"];
const hardGerman = new Set(["ergänze", "ordne", "berechne", "rechne", "schreibe", "wähle", "verbinde", "setze", "fehlenden", "begleitsatz", "anführungszeichen", "zahlenstrahl", "satzzeichen", "wortart", "doppelkonsonant", "grosskreis", "grundform", "mehrzahl", "einzahl", "lösung", "aufgabe", "antwort", "begründung", "kontrolliere", "überprüfe", "nenne", "erkläre", "kreuze", "sortiere", "vergleiche"]);
const commonGerman = new Set(["der", "das", "den", "dem", "ein", "eine", "einen", "einem", "einer", "und", "oder", "ist", "sind", "wird", "werden", "welche", "welcher", "welches", "warum", "richtig", "falsch", "satz", "wort", "zahl", "heisst", "kommt", "steht", "nach", "vor", "mit", "ohne", "für", "aus", "von", "zur", "zum"]);
const instructionSignals: Record<"de" | "en" | "fr", RegExp> = {
  de: /\b(?:ergänze|ordne|berechne|rechne|schreibe|wähle|verbinde|setze|welche|welcher|welches|was|wie|warum|finde|lies|bestimme|nenne|erkläre|sortiere|vergleiche)\b/iu,
  en: /\b(?:complete|order|calculate|write|choose|connect|which|what|how|why|find|read|determine|name|explain|sort|compare)\b/iu,
  fr: /\b(?:complète|ordonne|calcule|écris|choisis|relie|quel|quelle|quels|quelles|comment|pourquoi|trouve|lis|détermine|nomme|explique|trie|compare)\b/iu,
};

type Issue = { key: string; language: string; reason: string; value?: unknown };
const issues: Issue[] = [];
const counts = { exercises: 0, localeChecks: 0, mathScienceChecks: 0, languageSubjectChecks: 0 };

function isNeutral(text: string): boolean {
  return /^[\d\s.,:;!?+\-−–—*/×÷=%()[\]{}|_€$£'’"«»…°²³<>≤≥≠]+$/u.test(text.trim());
}

function blankCount(text: string): number {
  return text.match(/_{2,}/g)?.length ?? 0;
}

function germanSignal(text: string): string[] {
  const words = (text.replace(/von der Leyen/giu, "").match(/\p{L}+/gu) ?? []).map((word) => word.toLocaleLowerCase("de"));
  const hard = words.filter((word) => hardGerman.has(word));
  const common = words.filter((word) => commonGerman.has(word));
  return [...hard, ...(common.length >= 2 ? common : [])];
}

function quotedSegments(text: string): string[] {
  return [...text.matchAll(/«([^»]+)»|“([^”]+)”|"([^"\n]+)"/g)].map((match) => match[1] ?? match[2] ?? match[3]);
}

function sameIds<T extends { id: string }>(source: T[] | undefined, localized: T[] | undefined): boolean {
  return JSON.stringify(source?.map((item) => item.id) ?? []) === JSON.stringify(localized?.map((item) => item.id) ?? []);
}

function rawField<T>(exercise: Exercise, base: string, language: Exclude<Lang, "de">): T | undefined {
  const suffix = language.toUpperCase();
  return (exercise as unknown as Record<string, unknown>)[`${base}${suffix}`] as T | undefined;
}

function sourceLanguage(subject: string): "de" | "en" | "fr" {
  if (subject === "english") return "en";
  if (subject === "french") return "fr";
  return "de";
}

function alignedVisibleText(source: Exercise, localized: Exercise): Array<[string, string]> {
  const pairs: Array<[string, string]> = [[source.question, localized.question], [source.answer, localized.answer]];
  const align = (left: string[] | undefined, right: string[] | undefined) => {
    (left ?? []).forEach((value, index) => pairs.push([value, right?.[index] ?? ""]));
  };
  align(source.options, localized.options);
  align(source.wordList, localized.wordList);
  align(source.pairs?.map((item) => item.label), localized.pairs?.map((item) => item.label));
  align(source.dragItems?.map((item) => item.label), localized.dragItems?.map((item) => item.label));
  align(source.dropZones?.map((item) => item.label), localized.dropZones?.map((item) => item.label));
  return pairs;
}

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    const source = sourceLanguage(subject.id);
    const fullTranslation = subject.id === "math" || subject.id === "science";
    for (const topic of getTopics(grade, subject.id)) {
      topic.exercises.forEach((exercise, index) => {
        counts.exercises += 1;
        const key = `${grade}/${subject.id}/${topic.id}/${index}/${exercise.id}`;
        for (const language of languages) {
          counts.localeChecks += 1;
          if (fullTranslation) counts.mathScienceChecks += 1;
          else counts.languageSubjectChecks += 1;
          const localized = localizeExercise(exercise, language);
          const rawQuestion = rawField<string>(exercise, "question", language);
          const rawHints = rawField<string[]>(exercise, "hints", language);
          const rawOptions = rawField<string[]>(exercise, "options", language);
          const rawAnswer = rawField<string>(exercise, "answer", language);

          if (!exercise.completeLocalization) issues.push({ key, language, reason: "completeLocalization marker missing" });
          if (!rawQuestion?.trim()) issues.push({ key, language, reason: "localized question missing" });
          if (!rawHints || rawHints.length !== exercise.hints.length || rawHints.some((hint) => !hint.trim())) {
            issues.push({ key, language, reason: "localized hints missing or structurally different" });
          }
          if (/⟦\d+⟧|ZXQTOKEN\d+QXZ|<x id="\d+"\/>|⟬TARGET\d+⟭|\[TOKEN\d+\]|<span[^>]*>BLANK\d+<\/span>/.test(localized.question) || localized.question.includes("undefined")) {
            issues.push({ key, language, reason: "translation placeholder leaked", value: localized.question });
          }
          if (blankCount(localized.question) !== blankCount(exercise.question)) {
            issues.push({ key, language, reason: "blank count changed", value: localized.question });
          }
          if (exercise.type === "fill-in-blank" && !localized.answer.trim()) {
            issues.push({ key, language, reason: "fill-in answer missing" });
          }
          if (exercise.options) {
            if (!rawOptions || rawOptions.length !== exercise.options.length) {
              issues.push({ key, language, reason: "localized options missing or count changed" });
            }
            if (!localized.options?.includes(localized.answer)) {
              issues.push({ key, language, reason: "localized answer is not among options", value: { answer: localized.answer, options: localized.options } });
            }
            if (!rawAnswer?.trim()) issues.push({ key, language, reason: "localized answer missing" });
          }
          if (!sameIds(exercise.pairs, localized.pairs)) issues.push({ key, language, reason: "matching IDs changed" });
          if (!sameIds(exercise.dragItems, localized.dragItems)) issues.push({ key, language, reason: "drag item IDs changed" });
          if (!sameIds(exercise.dropZones, localized.dropZones)) issues.push({ key, language, reason: "drop-zone IDs changed" });
          if ((exercise.wordList?.length ?? 0) !== (localized.wordList?.length ?? 0)) issues.push({ key, language, reason: "word-list count changed" });

          if (fullTranslation) {
            if (!isNeutral(exercise.question) && localized.question === exercise.question && germanSignal(exercise.question).length) {
              issues.push({ key, language, reason: "German question fallback remains", value: localized.question });
            }
            const visibleText = [localized.question, localized.answer, ...(localized.options ?? []), ...localized.hints].join(" | ");
            const signal = germanSignal(visibleText);
            if (signal.length) issues.push({ key, language, reason: "German fragments remain in full translation", value: signal });
            if (subject.id === "math") {
              for (const [sourceText, localizedText] of alignedVisibleText(exercise, localized)) {
                let remainingSource = sourceText;
                for (const entry of [...MATH_TRANSLATION_GLOSSARY].sort((a, b) => b.de.length - a.de.length)) {
                  const escaped = entry.de.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "u");
                  if (pattern.test(remainingSource) && !localizedText.toLocaleLowerCase(language).includes(entry[language].toLocaleLowerCase(language))) {
                    issues.push({ key, language, reason: `math glossary term missing: ${entry.de}`, value: localizedText });
                  }
                  remainingSource = remainingSource.replace(pattern, " ");
                }
              }
            }
            if (/^[A-Za-z]$/.test(exercise.answer.trim()) && localized.answer !== exercise.answer) {
              issues.push({ key, language, reason: "single-letter symbolic answer changed", value: localized.answer });
            }
          } else {
            if (localized.answer !== exercise.answer || JSON.stringify(localized.options) !== JSON.stringify(exercise.options)) {
              issues.push({ key, language, reason: "target-language answer content changed" });
            }
            for (const segment of quotedSegments(exercise.question)) {
              if (!localized.question.includes(segment)) issues.push({ key, language, reason: "quoted learning target changed", value: segment });
            }
            if (language !== source && instructionSignals[source].test(exercise.question) && localized.question === exercise.question) {
              issues.push({ key, language, reason: "language-subject instruction was not localized", value: exercise.question });
            }
          }
        }
      });
    }
  }
}

const report = { counts, issueCount: issues.length, issues };
writeFileSync("/tmp/cleverli-live-localization-audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ counts, issueCount: issues.length, sample: issues.slice(0, 20) }, null, 2));
if (issues.length) process.exitCode = 1;
