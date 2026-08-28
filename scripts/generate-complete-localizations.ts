import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { getSubjects, getTopics } from "../src/data";
import type { Exercise } from "../src/types/exercise";
import { MATH_TRANSLATION_GLOSSARY } from "./math-translation-glossary";

type Locale = "en" | "fr" | "it";
type LocalizedExercise = Partial<Exercise>;
type SourceLanguage = "de" | "en" | "fr";
type TranslationCache = Record<string, Record<string, string>>;
type PreparedText = { text: string; tokens: string[] };

const locales: Locale[] = ["en", "fr", "it"];
const outputPath = resolve("src/data/generatedExerciseLocalizations.json");
const cachePath = resolve(".qa/localization-translation-cache.json");

function loadCache(): TranslationCache {
  try {
    const parsed = JSON.parse(readFileSync(cachePath, "utf8")) as TranslationCache & Partial<Record<Locale, Record<string, string>>>;
    if (parsed.en || parsed.fr || parsed.it) {
      return {
        "de-en": parsed.en ?? {},
        "de-fr": parsed.fr ?? {},
        "de-it": parsed.it ?? {},
      };
    }
    return parsed;
  } catch {
    return {};
  }
}

function isNeutral(value: string): boolean {
  const trimmed = value.trim();
  return /^[\d\s.,:;!?+\-−–—*/×÷=%()[\]{}|_€$£'’"«»…°²³<>≤≥≠]+$/u.test(trimmed) || /^[A-Za-z]$/.test(trimmed);
}

function protect(value: string, replacements: Array<[string, string]> = []): PreparedText {
  const tokens: string[] = [];
  const insertToken = (content: string) => {
    const index = tokens.push(content) - 1;
    return `<span translate="no">BLANK${index}</span>`;
  };
  let text = value;
  for (const [source, target] of [...replacements].sort(([a], [b]) => b.length - a.length)) {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "gu");
    if (pattern.test(text)) {
      pattern.lastIndex = 0;
      text = text.replace(pattern, () => insertToken(target));
    }
  }
  text = text.replace(/[\p{L}\p{N}-]+_{2,}[\p{L}\p{N}-]*|[\p{L}\p{N}-]*_{2,}[\p{L}\p{N}-]+/gu, "___");
  text = text.replace(/_{2,}/g, insertToken);
  return { text, tokens };
}

function replacementsFor(subject: string, locale: Locale): Array<[string, string]> {
  if (subject !== "math") return [];
  const axisPattern: Record<Locale, string> = { en: "___ axis", fr: "axe des ___", it: "asse ___" };
  return [["___-Achse", axisPattern[locale]], ...MATH_TRANSLATION_GLOSSARY.map((entry) => [entry.de, entry[locale]] as [string, string])];
}

function repairMathGrammar(value: string, locale: Locale): string {
  if (locale === "fr") {
    return value
      .replace(/\b([Uu])n droite\b/g, (_, initial: string) => initial === "U" ? "Une droite" : "une droite")
      .replace(/\b([Uu])n demi-droite\b/g, (_, initial: string) => initial === "U" ? "Une demi-droite" : "une demi-droite")
      .replace(/\bd'un droite\b/g, "d'une droite")
      .replace(/\bd'un demi-droite\b/g, "d'une demi-droite")
      .replace(/\ble axe\b/g, "l'axe")
      .replace(/s'appelle axe\b/g, "s'appelle l'axe");
  }
  if (locale === "it") {
    return value
      .replace(/\b([Uu])n retta\b/g, (_, initial: string) => initial === "U" ? "Una retta" : "una retta")
      .replace(/\b([Uu])n semiretta\b/g, (_, initial: string) => initial === "U" ? "Una semiretta" : "una semiretta")
      .replace(/\bdi un retta\b/g, "di una retta")
      .replace(/\bdi un semiretta\b/g, "di una semiretta")
      .replace(/\bsu asse\b/g, "sull'asse");
  }
  return value;
}

function restore(value: string, tokens: string[]): string {
  return tokens.reduce(
    (result, token, index) => result.replaceAll(`<span translate="no">BLANK${index}</span>`, token),
    value,
  );
}

function chunks(values: string[]): string[][] {
  const result: string[][] = [];
  let current: string[] = [];
  let characters = 0;
  for (const value of values) {
    if (current.length >= 60 || characters + value.length > 10_000) {
      result.push(current);
      current = [];
      characters = 0;
    }
    current.push(value);
    characters += value.length;
  }
  if (current.length) result.push(current);
  return result;
}

async function translateBatch(source: SourceLanguage, locale: Locale, values: string[], attempt = 1): Promise<string[]> {
  const body = new URLSearchParams();
  values.forEach((text) => body.append("q", text));
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/t?client=gtx&sl=${source}&tl=${locale}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rawTranslated = await response.json() as string[];
    if (!Array.isArray(rawTranslated) || rawTranslated.length !== values.length) {
      throw new Error(`expected ${values.length} translations, received ${rawTranslated.length}`);
    }
    const translated = rawTranslated.map((value) => value
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
      .replace(/<span\s+[^>]*>[^<]*?(\d+)<\/span>/gi, '<span translate="no">BLANK$1</span>'));
    translated.forEach((value, index) => {
      if (!value.trim()) throw new Error(`empty translation at batch index ${index}`);
      const expectedTokens = values[index].match(/<span translate="no">BLANK\d+<\/span>/g) ?? [];
      const actualTokens = value.match(/<span translate="no">BLANK\d+<\/span>/g) ?? [];
      if (JSON.stringify([...expectedTokens].sort()) !== JSON.stringify([...actualTokens].sort())) {
        throw new Error(`translation tokens changed at batch index ${index}: ${JSON.stringify({ source: values[index], translated: value, expectedTokens, actualTokens })}`);
      }
    });
    return translated;
  } catch (error) {
    if (attempt >= 5) throw error;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 400 * 2 ** attempt));
    return translateBatch(source, locale, values, attempt + 1);
  }
}

function fullTranslationStrings(exercise: Exercise): string[] {
  return [
    exercise.question,
    exercise.answer,
    ...(exercise.altAnswers ?? []),
    ...(exercise.options ?? []),
    ...exercise.hints,
    ...(exercise.reviewCriteria ?? []),
    ...(exercise.pairs ?? []).map((item) => item.label),
    ...(exercise.dragItems ?? []).map((item) => item.label),
    ...(exercise.dropZones ?? []).map((item) => item.label),
    ...(exercise.wordList ?? []),
  ].filter((value) => value.trim().length > 0);
}

function sourceLanguage(subject: string): SourceLanguage {
  if (subject === "english") return "en";
  if (subject === "french") return "fr";
  return "de";
}

function localizeItems<T extends { label: string }>(items: T[] | undefined, translate: (value: string) => string): T[] | undefined {
  return items?.map((item) => ({ ...item, label: translate(item.label) }));
}

function localizedExercise(exercise: Exercise, subject: string, locale: Locale, cache: TranslationCache): LocalizedExercise {
  const source = sourceLanguage(subject);
  const cacheBucket = cache[`${source}-${locale}`] ?? {};
  const translateFull = (value: string) => {
    if (!value.trim() || isNeutral(value)) return value;
    const prepared = protect(value, replacementsFor(subject, locale));
    const translated = restore(cacheBucket[prepared.text], prepared.tokens);
    return subject === "math" ? repairMathGrammar(translated, locale) : translated;
  };
  if (subject !== "math" && subject !== "science") {
    const instruction: Record<Locale, Partial<Record<Exercise["type"], string>>> = {
      en: {
        "multiple-choice": "Choose the correct answer.", "fill-in-blank": "Complete the gap.", "self-review": "Review your answer.", counting: "Count and answer.", matching: "Match the pairs.", memory: "Find the matching pairs.", "drag-drop": "Sort the items.", "number-line": "Mark the correct number.", "word-search": "Find the words.",
      },
      fr: {
        "multiple-choice": "Choisis la bonne réponse.", "fill-in-blank": "Complète le blanc.", "self-review": "Vérifie ta réponse.", counting: "Compte et réponds.", matching: "Relie les paires.", memory: "Trouve les paires.", "drag-drop": "Classe les éléments.", "number-line": "Marque le bon nombre.", "word-search": "Trouve les mots.",
      },
      it: {
        "multiple-choice": "Scegli la risposta corretta.", "fill-in-blank": "Completa lo spazio.", "self-review": "Controlla la tua risposta.", counting: "Conta e rispondi.", matching: "Abbina le coppie.", memory: "Trova le coppie.", "drag-drop": "Ordina gli elementi.", "number-line": "Segna il numero corretto.", "word-search": "Trova le parole.",
      },
    };
    const question = locale === source
      ? exercise.question
      : `${instruction[locale][exercise.type] ?? instruction[locale]["multiple-choice"]} ${exercise.question}`;
    return {
      question,
      answer: exercise.answer,
      altAnswers: exercise.altAnswers,
      options: exercise.options,
      hints: exercise.hints,
      reviewCriteria: exercise.reviewCriteria,
      pairs: exercise.pairs,
      dragItems: exercise.dragItems,
      dropZones: exercise.dropZones,
      wordList: exercise.wordList,
    };
  }

  const translate = translateFull;
  const options = exercise.options?.map(translate);
  const correctIndex = exercise.options?.findIndex((option) => option === exercise.answer) ?? -1;
  const answer = correctIndex >= 0 && options ? options[correctIndex] : translate(exercise.answer);
  return {
    question: translate(exercise.question),
    answer,
    altAnswers: exercise.altAnswers?.map(translate),
    options,
    hints: exercise.hints.map(translate),
    reviewCriteria: exercise.reviewCriteria?.map(translate),
    pairs: localizeItems(exercise.pairs, translate),
    dragItems: localizeItems(exercise.dragItems, translate),
    dropZones: localizeItems(exercise.dropZones, translate),
    wordList: exercise.wordList?.map(translate),
  };
}

async function main() {
  const entries: Array<{ key: string; subject: string; exercise: Exercise }> = [];
  const units = new Map<string, Set<string>>();
  const addUnit = (source: SourceLanguage, locale: Locale, prepared: PreparedText) => {
    if (source === locale || isNeutral(prepared.text)) return;
    const bucket = `${source}-${locale}`;
    if (!units.has(bucket)) units.set(bucket, new Set());
    units.get(bucket)?.add(prepared.text);
  };

  for (let grade = 1; grade <= 6; grade += 1) {
    for (const subject of getSubjects(grade)) {
      if (subject.id !== "math" && subject.id !== "science") continue;
      for (const topic of getTopics(grade, subject.id)) {
        topic.exercises.forEach((exercise, index) => {
          entries.push({ key: `${grade}/${subject.id}/${topic.id}/${index}/${exercise.id}`, subject: subject.id, exercise });
          const source = sourceLanguage(subject.id);
          for (const locale of locales) {
            const preparedValues = subject.id === "math" || subject.id === "science"
              ? fullTranslationStrings(exercise).map((value) => protect(value, replacementsFor(subject.id, locale)))
              : [];
            preparedValues.forEach((prepared) => addUnit(source, locale, prepared));
          }
        });
      }
    }
  }

  const cache = loadCache();
  mkdirSync(dirname(cachePath), { recursive: true });
  for (const [bucket, values] of units) {
    const [source, locale] = bucket.split("-") as [SourceLanguage, Locale];
    cache[bucket] ??= {};
    const missing = [...values].filter((value) => !cache[bucket][value]);
    const batches = chunks(missing);
    console.log(`${bucket}: ${missing.length} strings in ${batches.length} batches`);
    const concurrency = 6;
    for (let index = 0; index < batches.length; index += concurrency) {
      const window = batches.slice(index, index + concurrency);
      const results = await Promise.all(window.map((batch) => translateBatch(source, locale, batch)));
      window.forEach((batch, windowIndex) => {
        batch.forEach((value, valueIndex) => { cache[bucket][value] = results[windowIndex][valueIndex]; });
      });
      writeFileSync(cachePath, JSON.stringify(cache));
      console.log(`${bucket}: ${Math.min(index + concurrency, batches.length)}/${batches.length}`);
    }
  }

  const records = Object.fromEntries(entries.map(({ key, subject, exercise }) => [key, {
    sourceQuestion: exercise.question,
    en: localizedExercise(exercise, subject, "en", cache),
    fr: localizedExercise(exercise, subject, "fr", cache),
    it: localizedExercise(exercise, subject, "it", cache),
  }]));
  writeFileSync(outputPath, `${JSON.stringify({ version: 1, records }, null, 2)}\n`);
  console.log(JSON.stringify({ exercises: entries.length, translationBuckets: Object.fromEntries([...units].map(([key, values]) => [key, values.size])), outputPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
