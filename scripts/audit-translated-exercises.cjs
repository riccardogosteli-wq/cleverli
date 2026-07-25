#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ts = require("typescript");

const repoRoot = path.resolve(__dirname, "..");
const dataRoot = path.join(repoRoot, "src", "data");
const optionTypes = new Set(["multiple-choice", "counting"]);
const languages = {
  en: { label: "English", suffix: "EN" },
  fr: { label: "French", suffix: "FR" },
  it: { label: "Italian", suffix: "IT" },
};

const lang = process.argv[2] ?? "en";
const config = languages[lang];

if (!config) {
  console.error(`Unsupported language "${lang}". Use one of: ${Object.keys(languages).join(", ")}`);
  process.exit(1);
}

function findDataFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return findDataFiles(fullPath);
    if (!entry.isFile() || !entry.name.endsWith(".ts")) return [];
    if (fullPath.endsWith(path.join("src", "data", "index.ts"))) return [];
    if (fullPath.endsWith(path.join("src", "data", "topicTitles.ts"))) return [];
    return [fullPath];
  });
}

function loadDataFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require: () => ({}),
    __dirname: path.dirname(filePath),
    __filename: filePath,
  };

  vm.runInNewContext(outputText, sandbox, { filename: filePath });
  return module.exports.default ?? module.exports;
}

function walkTopics(value) {
  if (Array.isArray(value) && value.every(item => item && Array.isArray(item.exercises))) return value;
  if (Array.isArray(value)) return value.flatMap(walkTopics);
  if (value && typeof value === "object") return Object.values(value).flatMap(walkTopics);
  return [];
}

function resolveLocalisedAnswer(exercise, localisedOptions, localisedAnswer) {
  if (localisedAnswer) return localisedAnswer;
  if (!exercise.options || !localisedOptions || exercise.options === localisedOptions) return exercise.answer;
  const answerIndex = exercise.options.findIndex(option => option === exercise.answer);
  return answerIndex >= 0 ? (localisedOptions[answerIndex] ?? exercise.answer) : exercise.answer;
}

function isNumericish(answer) {
  const compact = String(answer).trim();
  return /^[\d\s.,:;+\-−–—*/×÷=%()[\]|_]+$/.test(compact);
}

const stats = {
  files: 0,
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

const optionFailures = [];
const fillTextSamples = [];

for (const filePath of findDataFiles(dataRoot)) {
  stats.files += 1;
  const relPath = path.relative(repoRoot, filePath);
  const topics = walkTopics(loadDataFile(filePath));
  stats.topics += topics.length;

  for (const topic of topics) {
    for (const exercise of topic.exercises) {
      const question = exercise[`question${config.suffix}`];
      const options = exercise[`options${config.suffix}`];
      const answer = exercise[`answer${config.suffix}`];

      stats.exercises += 1;
      if (question) stats.localisedQuestions += 1;

      if (optionTypes.has(exercise.type) && question) {
        stats.optionExercisesWithLocalisedQuestion += 1;
        if (!options) stats.optionExercisesMissingLocalisedOptions += 1;
      }

      if (optionTypes.has(exercise.type) && options) {
        stats.localisedOptionExercises += 1;
        if (!options.includes(exercise.answer)) stats.optionFailuresBeforeFallback += 1;

        const resolvedAnswer = resolveLocalisedAnswer(exercise, options, answer);
        if (!options.includes(resolvedAnswer)) {
          stats.optionFailuresAfterFallback += 1;
          optionFailures.push({
            file: relPath,
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
        if (isNumericish(exercise.answer)) {
          stats.fillNumericAnswers += 1;
        } else if (!answer) {
          stats.fillTextAnswersWithoutLocalisedAnswer += 1;
          if (fillTextSamples.length < 20) {
            fillTextSamples.push({
              file: relPath,
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
