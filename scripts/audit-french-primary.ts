import { getTopics } from "../src/data";
import type { Exercise, Topic } from "../src/types/exercise";

const failures: string[] = [];
const requiredCodes: Record<3 | 4, string[]> = {
  3: [
    "FS1F.1.A.1.a", "FS1F.1.B.1.a", "FS1F.2.A.1.a", "FS1F.2.B.1.a",
    "FS1F.3.A.1.a", "FS1F.3.B.1.a", "FS1F.3.C.1.a", "FS1F.4.A.1.a",
    "FS1F.4.B.1.a", "FS1F.5.B.1.a", "FS1F.5.C.1.a", "FS1F.5.D.1.a",
    "FS1F.5.E.1.a", "FS1F.6.A.1.a",
  ],
  4: [
    "FS1F.1.A.1.b", "FS1F.1.B.1.b", "FS1F.2.A.1.b", "FS1F.2.B.1.b",
    "FS1F.3.A.1.b", "FS1F.3.B.1.b", "FS1F.3.C.1.b", "FS1F.4.A.1.b",
    "FS1F.4.B.1.b", "FS1F.5.B.1.a", "FS1F.5.C.1.a", "FS1F.5.D.1.a",
    "FS1F.5.E.1.a", "FS1F.6.A.1.b",
  ],
};

function path(grade: number, topic: Topic, exercise?: Exercise): string {
  return `${grade}/french/${topic.id}${exercise ? `/${exercise.id}` : ""}`;
}

function payloadFingerprint(exercise: Exercise): string {
  return JSON.stringify({
    question: exercise.question,
    listeningText: exercise.listeningText,
    answer: exercise.answer,
    options: exercise.options,
    pairs: exercise.pairs?.map(({ label }) => label),
    dragItems: exercise.dragItems?.map(({ label }) => label),
    dropZones: exercise.dropZones?.map(({ label }) => label),
    dropAnswers: exercise.dropAnswers,
    wordList: exercise.wordList,
  });
}

const fingerprints = new Map<string, string>();
const summary: Record<number, Record<string, number>> = {};
let totalExercises = 0;
let totalListening = 0;
let totalInteractive = 0;

for (const grade of [3, 4] as const) {
  const topics = getTopics(grade, "french");
  if (topics.length !== 9) failures.push(`${grade}/french: expected 9 topics, found ${topics.length}`);
  const gradeCodes = new Set(topics.flatMap((topic) => topic.curriculumCodes ?? []));
  for (const code of requiredCodes[grade]) {
    if (!gradeCodes.has(code)) failures.push(`${grade}/french: missing LP21 code ${code}`);
  }

  summary[grade] = {};
  for (const topic of topics) {
    if (topic.exercises.length !== 50) failures.push(`${path(grade, topic)}: expected 50 exercises`);
    const tierCounts = [1, 2, 3].map((difficulty) => topic.exercises.filter((exercise) => exercise.difficulty === difficulty).length);
    if (tierCounts.join(",") !== "15,20,15") failures.push(`${path(grade, topic)}: expected tiers 15/20/15, found ${tierCounts.join("/")}`);

    const typeCounts = new Map<string, number>();
    for (const exercise of topic.exercises) {
      totalExercises += 1;
      typeCounts.set(exercise.type, (typeCounts.get(exercise.type) ?? 0) + 1);
      summary[grade][exercise.type] = (summary[grade][exercise.type] ?? 0) + 1;
      if (!["multiple-choice", "fill-in-blank"].includes(exercise.type)) totalInteractive += 1;

      if (!/^[A-Za-z0-9_-]+$/.test(exercise.id)) failures.push(`${path(grade, topic, exercise)}: unsafe ID`);
      if (!exercise.question.trim() || !exercise.answer.trim()) failures.push(`${path(grade, topic, exercise)}: empty question or answer`);
      if (exercise.hints.length < 2 || exercise.hints.some((hint) => !hint.trim())) failures.push(`${path(grade, topic, exercise)}: requires two useful hints`);
      if (/\(open|any name|etc\.|Traduisez:/i.test(`${exercise.answer} ${exercise.question}`)) failures.push(`${path(grade, topic, exercise)}: ambiguous/open legacy wording`);

      if (exercise.type === "multiple-choice") {
        if (!exercise.options || exercise.options.length !== 4) failures.push(`${path(grade, topic, exercise)}: MC needs four options`);
        else {
          if (!exercise.options.includes(exercise.answer)) failures.push(`${path(grade, topic, exercise)}: answer missing from options`);
          if (new Set(exercise.options.map((option) => option.trim().toLocaleLowerCase("fr-CH"))).size !== 4) failures.push(`${path(grade, topic, exercise)}: duplicate options`);
        }
      }
      if (exercise.type === "fill-in-blank" && !exercise.question.includes("___")) failures.push(`${path(grade, topic, exercise)}: fill task has no blank`);
      if (exercise.type === "self-review" && (exercise.reviewCriteria?.length ?? 0) < 3) failures.push(`${path(grade, topic, exercise)}: self-review needs three criteria`);
      if (exercise.type === "matching" || exercise.type === "memory") {
        if (!exercise.pairs || exercise.pairs.length !== 8 || exercise.pairs.length % 2 !== 0) failures.push(`${path(grade, topic, exercise)}: invalid pair set`);
        if (exercise.pairs && new Set(exercise.pairs.map((pair) => pair.id)).size !== exercise.pairs.length) failures.push(`${path(grade, topic, exercise)}: duplicate pair IDs`);
      }
      if (exercise.type === "drag-drop") {
        const itemIds = new Set(exercise.dragItems?.map((item) => item.id) ?? []);
        const zoneIds = new Set(exercise.dropZones?.map((zone) => zone.id) ?? []);
        if (!itemIds.size || zoneIds.size < 2) failures.push(`${path(grade, topic, exercise)}: incomplete drag/drop data`);
        for (const [itemId, zoneId] of Object.entries(exercise.dropAnswers ?? {})) {
          if (!itemIds.has(itemId) || !zoneIds.has(zoneId)) failures.push(`${path(grade, topic, exercise)}: invalid drag/drop answer`);
        }
        if (Object.keys(exercise.dropAnswers ?? {}).length !== itemIds.size) failures.push(`${path(grade, topic, exercise)}: not every drag item is scored`);
      }
      if (exercise.type === "word-search") {
        if (!exercise.wordList?.length || new Set(exercise.wordList).size !== exercise.wordList.length) failures.push(`${path(grade, topic, exercise)}: invalid word list`);
        if (exercise.wordList?.some((word) => word.length > (exercise.gridSize ?? 8))) failures.push(`${path(grade, topic, exercise)}: word exceeds grid`);
      }
      if (exercise.listeningText) {
        totalListening += 1;
        if (exercise.listeningLanguage !== "fr") failures.push(`${path(grade, topic, exercise)}: French stimulus has wrong language`);
        if (exercise.question.includes(exercise.listeningText)) failures.push(`${path(grade, topic, exercise)}: listening stimulus is visible`);
      }

      const fingerprint = payloadFingerprint(exercise);
      const duplicate = fingerprints.get(fingerprint);
      if (duplicate) failures.push(`${path(grade, topic, exercise)}: exact duplicate of ${duplicate}`);
      else fingerprints.set(fingerprint, path(grade, topic, exercise));
    }

    const expectedTypes: Record<string, number> = {
      "multiple-choice": 36, "fill-in-blank": 5, "matching": 2, memory: 1,
      "drag-drop": 2, "word-search": 1, "self-review": 3,
    };
    for (const [type, count] of Object.entries(expectedTypes)) {
      if (typeCounts.get(type) !== count) failures.push(`${path(grade, topic)}: expected ${count} ${type}, found ${typeCounts.get(type) ?? 0}`);
    }
    if (topic.exercises.filter((exercise) => exercise.listeningText).length !== 8) failures.push(`${path(grade, topic)}: expected 8 listening tasks`);
  }
}

if (totalExercises !== 900) failures.push(`Expected 900 French primary exercises, found ${totalExercises}`);
if (totalListening !== 144) failures.push(`Expected 144 French listening tasks, found ${totalListening}`);
if (totalInteractive !== 162) failures.push(`Expected 162 non-MC/non-fill interactive tasks, found ${totalInteractive}`);

console.log(JSON.stringify({
  topics: 18,
  exercises: totalExercises,
  listeningTasks: totalListening,
  richerFormatTasks: totalInteractive,
  byGradeAndType: summary,
  failures: failures.length,
  sampleFailures: failures.slice(0, 30),
}, null, 2));

if (failures.length) process.exit(1);
