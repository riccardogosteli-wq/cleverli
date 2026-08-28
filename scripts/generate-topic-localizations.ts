import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { TOPIC_CATALOG } from "../src/data/topicCatalog.generated";

type Lang = "de" | "en" | "fr" | "it";
type TopicTranslations = Record<string, Record<Lang, string>>;

const languages: Lang[] = ["de", "en", "fr", "it"];
const outputPath = resolve("src/data/generatedTopicLocalizations.json");
const titles = [...new Set(Object.values(TOPIC_CATALOG).flat().map((topic) => topic.title))].sort();

function chunks(values: string[]): string[][] {
  const result: string[][] = [];
  for (let index = 0; index < values.length; index += 60) result.push(values.slice(index, index + 60));
  return result;
}

async function translateBatch(language: Lang, values: string[], attempt = 1): Promise<string[]> {
  const body = new URLSearchParams();
  values.forEach((value) => body.append("q", value));
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/t?client=gtx&sl=auto&tl=${language}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = await response.json() as Array<string | [string, string]>;
    const translated = raw.map((value) => Array.isArray(value) ? value[0] : value);
    if (!Array.isArray(raw) || translated.length !== values.length || translated.some((value) => typeof value !== "string" || !value.trim())) {
      throw new Error(`invalid topic translation response (${translated.length}/${values.length})`);
    }
    return translated;
  } catch (error) {
    if (attempt >= 5) throw error;
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 400 * 2 ** attempt));
    return translateBatch(language, values, attempt + 1);
  }
}

async function main() {
  const output: TopicTranslations = Object.fromEntries(titles.map((title) => [title, {}])) as TopicTranslations;
  for (const language of languages) {
    for (const batch of chunks(titles)) {
      const translated = await translateBatch(language, batch);
      batch.forEach((title, index) => { output[title][language] = translated[index]; });
    }
  }

  writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify({ titles: titles.length, localeValues: titles.length * languages.length, outputPath }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
