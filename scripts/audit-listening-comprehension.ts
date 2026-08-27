import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { getTopics } from "../src/data";
import { localizeExercise } from "../src/lib/exerciseLocalization";
import type { Exercise } from "../src/types/exercise";

const API_SNAPSHOT = process.env.LP21_API_SNAPSHOT ?? "/tmp/cleverli-lp21-live.json";
const failures: string[] = [];
const allAudio = new Map<string, string>();

function normalize(value: string) {
  return value.toLocaleLowerCase("de-CH").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function checkExercise(grade: 1 | 2, exercise: Exercise, index: number) {
  const key = `Grade ${grade}/${exercise.id}`;
  const expectedId = `g${grade}hoer${index + 1}`;
  const expectedDifficulty = index < 15 ? 1 : index < 35 ? 2 : 3;
  if (exercise.id !== expectedId) failures.push(`${key}: expected ID ${expectedId}`);
  if (exercise.difficulty !== expectedDifficulty) failures.push(`${key}: expected difficulty ${expectedDifficulty}`);
  if (Boolean(exercise.free) !== (index < 3)) failures.push(`${key}: only the first three exercises may be free`);
  if (!exercise.preserveGermanContent) failures.push(`${key}: German learning choices are not protected`);
  if (!exercise.listeningText?.trim()) failures.push(`${key}: hidden listening text is missing`);
  if (exercise.listeningText && exercise.question.includes(exercise.listeningText)) failures.push(`${key}: listening transcript is visible in the question`);
  if (!exercise.hints || exercise.hints.length !== 2) failures.push(`${key}: expected two hints`);
  for (const field of ["questionEN", "questionFR", "questionIT", "hintsEN", "hintsFR", "hintsIT"] as const) {
    const value = exercise[field];
    if (!value || (Array.isArray(value) ? value.some(item => !item.trim()) : !value.trim())) failures.push(`${key}: missing ${field}`);
  }

  if (exercise.listeningText) {
    const audioKey = normalize(exercise.listeningText);
    const previous = allAudio.get(audioKey);
    if (previous) failures.push(`${key}: duplicate listening text also used by ${previous}`);
    allAudio.set(audioKey, key);
    if (exercise.listeningText.length < 20) failures.push(`${key}: listening text is too short to assess comprehension`);
  }

  if (exercise.type === "multiple-choice") {
    const options = exercise.options ?? [];
    if (options.length !== 4 || new Set(options).size !== 4) failures.push(`${key}: expected four unique choices`);
    if (!options.includes(exercise.answer)) failures.push(`${key}: answer is absent from choices`);
  } else if (exercise.type === "drag-drop") {
    const items = exercise.dragItems ?? [];
    const zones = exercise.dropZones ?? [];
    if (items.length !== 3 || zones.length !== 3) failures.push(`${key}: ordering task must have three items and zones`);
    items.forEach((item, itemIndex) => {
      if (exercise.dropAnswers?.[item.id] !== zones[itemIndex]?.id) failures.push(`${key}: wrong ordered mapping for ${item.id}`);
    });
  } else {
    failures.push(`${key}: unsupported listening interaction ${exercise.type}`);
  }

  for (const language of ["en", "fr", "it"] as const) {
    const localized = localizeExercise(exercise, language);
    if (localized.listeningText !== exercise.listeningText) failures.push(`${key}/${language}: German listening stimulus changed`);
    if (localized.answer !== exercise.answer) failures.push(`${key}/${language}: German answer changed`);
    if (exercise.type === "multiple-choice" && JSON.stringify(localized.options) !== JSON.stringify(exercise.options)) failures.push(`${key}/${language}: German choices changed`);
  }
}

const summary = [];
for (const grade of [1, 2] as const) {
  const topic = getTopics(grade, "german").find(candidate => candidate.id === `hoerverstehen-${grade}`);
  if (!topic) {
    failures.push(`Grade ${grade}: listening topic missing`);
    continue;
  }
  if (topic.exercises.length !== 50) failures.push(`Grade ${grade}: expected 50 exercises, found ${topic.exercises.length}`);
  topic.exercises.forEach((exercise, index) => checkExercise(grade, exercise, index));
  const difficulties = Object.fromEntries([1, 2, 3].map(difficulty => [difficulty, topic.exercises.filter(exercise => exercise.difficulty === difficulty).length]));
  if (difficulties[1] !== 15 || difficulties[2] !== 20 || difficulties[3] !== 15) failures.push(`Grade ${grade}: wrong difficulty distribution ${JSON.stringify(difficulties)}`);
  const positions = Object.fromEntries([0, 1, 2, 3].map(position => [position, topic.exercises.filter(exercise => exercise.type === "multiple-choice" && exercise.options?.indexOf(exercise.answer) === position).length]));
  if (Object.values(positions).some(count => count < 10)) failures.push(`Grade ${grade}: correct-choice positions are not balanced ${JSON.stringify(positions)}`);
  summary.push({
    grade,
    id: topic.id,
    exercises: topic.exercises.length,
    difficulties,
    types: Object.fromEntries(["multiple-choice", "drag-drop"].map(type => [type, topic.exercises.filter(exercise => exercise.type === type).length])),
    answerPositions: positions,
    digest: createHash("sha256").update(JSON.stringify(topic.exercises)).digest("hex").slice(0, 16),
  });
}

type Snapshot = { source: string; fetchedAt: string; nodes: Record<string, { code?: string; strukturtyp?: string; zyklus?: string }> };
const snapshot = JSON.parse(readFileSync(API_SNAPSHOT, "utf8")) as Snapshot;
const ageMs = Date.now() - new Date(snapshot.fetchedAt).getTime();
if (!snapshot.source.includes("api.lehrplan.ch") || !Number.isFinite(ageMs) || ageMs > 24 * 60 * 60 * 1000) failures.push("Authenticated LP21 snapshot is missing or older than 24 hours");
const nodes = Object.values(snapshot.nodes);
for (const code of ["D.1.A.1", "D.1.B.1", "D.1.C.1", "D.1.D.1"]) {
  if (!nodes.some(node => node.code === code)) failures.push(`LP21 API competency ${code} is missing`);
  if (!nodes.some(node => node.strukturtyp === "Kompetenzstufe" && node.code?.startsWith(`${code}.`) && String(node.zyklus).includes("1"))) failures.push(`LP21 API competency ${code} has no Cycle 1 stage`);
}

console.log(JSON.stringify({ summary, lp21Competencies: ["D.1.A.1", "D.1.B.1", "D.1.C.1", "D.1.D.1"], failures }, null, 2));
if (failures.length) process.exit(1);
