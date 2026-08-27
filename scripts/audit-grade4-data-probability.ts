import { getTopics } from "../src/data";
import { Exercise } from "../src/types/exercise";

const topic = getTopics(4, "math").find(candidate => candidate.id === "daten-diagramme-zufall-4");
const failures: string[] = [];

if (!topic) throw new Error("Grade 4 data/probability topic is missing");

const expectedAnswers: Record<string, string> = {
  g4dz1: "9", g4dz2: "16", g4dz3: "Dienstag", g4dz4: "Amir", g4dz5: "8",
  g4dz6: "7", g4dz7: "sicher", g4dz8: "unmöglich", g4dz9: "Kopf oder Zahl", g4dz10: "4",
  g4dz11: "Velo", g4dz12: "15", g4dz13: "blau", g4dz14: "8 mm", g4dz15: "Temperaturen der Woche",
  g4dz16: "7", g4dz17: "18", g4dz18: "Rot und Blau sind gleich wahrscheinlich.", g4dz19: "16", g4dz20: "all",
  g4dz21: "rot", g4dz22: "7", g4dz23: "12,5", g4dz24: "Säulendiagramm", g4dz25: "7 cm",
  g4dz26: "In diesem Versuch kam Kopf häufiger vor.", g4dz27: "15 m", g4dz28: "4 m", g4dz29: "alle gleich wahrscheinlich", g4dz30: "30",
  g4dz31: "15", g4dz32: "20", g4dz33: "eine beschriftete Skala", g4dz34: "17", g4dz35: "8 kg",
  g4dz36: "15", g4dz37: "8 kg", g4dz38: "in beiden", g4dz39: "3", g4dz40: "6",
  g4dz41: "all", g4dz42: "22", g4dz43: "Fussball hat doppelt so viele Stimmen wie Tanzen.", g4dz44: "2 cm", g4dz45: "28",
  g4dz46: "Blau – Rot – Grün", g4dz47: "445", g4dz48: "8", g4dz49: "9", g4dz50: "Mia hatte in diesem Versuch mehr Sechsen.",
};

const languageFields = [
  ["de", "question", "answer", "options", "hints"],
  ["en", "questionEN", "answerEN", "optionsEN", "hintsEN"],
  ["fr", "questionFR", "answerFR", "optionsFR", "hintsFR"],
  ["it", "questionIT", "answerIT", "optionsIT", "hintsIT"],
] as const;

const normalize = (value: string) => value.toLocaleLowerCase("de-CH").replace(/[^\p{L}\p{N}]+/gu, " ").trim();

if (topic.exercises.length !== 50) failures.push(`Expected 50 exercises, found ${topic.exercises.length}`);

const expectedDifficulties = { 1: 15, 2: 20, 3: 15 };
for (const difficulty of [1, 2, 3] as const) {
  const count = topic.exercises.filter(exercise => exercise.difficulty === difficulty).length;
  if (count !== expectedDifficulties[difficulty]) failures.push(`Difficulty ${difficulty}: expected ${expectedDifficulties[difficulty]}, found ${count}`);
}

const expectedTypes = ["fill-in-blank", "multiple-choice", "number-line", "matching", "drag-drop"];
for (const type of expectedTypes) {
  if (!topic.exercises.some(exercise => exercise.type === type)) failures.push(`Missing exercise type ${type}`);
}

const ids = new Set<string>();
for (const [index, exercise] of topic.exercises.entries()) {
  const expectedId = `g4dz${index + 1}`;
  if (exercise.id !== expectedId) failures.push(`Position ${index + 1}: expected ${expectedId}, found ${exercise.id}`);
  if (ids.has(exercise.id)) failures.push(`Duplicate ID ${exercise.id}`);
  ids.add(exercise.id);

  if (exercise.answer !== expectedAnswers[exercise.id]) failures.push(`${exercise.id}: expected answer ${expectedAnswers[exercise.id]}, found ${exercise.answer}`);
  if (index < 3 && exercise.free !== true) failures.push(`${exercise.id}: first three exercises must be free`);
  if (index >= 3 && exercise.free) failures.push(`${exercise.id}: only first three exercises should be free`);

  for (const [lang, questionField, answerField, optionsField, hintsField] of languageFields) {
    const question = exercise[questionField];
    const answer = exercise[answerField] ?? exercise.answer;
    const hints = exercise[hintsField] ?? exercise.hints;
    if (!question?.trim()) failures.push(`${exercise.id}/${lang}: missing question`);
    if (!answer?.trim()) failures.push(`${exercise.id}/${lang}: missing answer`);
    if (!hints || hints.length !== 2 || hints.some(hint => !hint.trim())) failures.push(`${exercise.id}/${lang}: expected two non-empty hints`);

    if (exercise.type === "multiple-choice") {
      const options = exercise[optionsField] ?? exercise.options;
      if (!options || options.length !== 4 || new Set(options).size !== 4) failures.push(`${exercise.id}/${lang}: invalid options`);
      if (options && !options.includes(answer)) failures.push(`${exercise.id}/${lang}: answer is not in options`);
    }
  }

  if (exercise.type === "fill-in-blank" && (exercise.question.match(/___/g) ?? []).length !== 1) {
    failures.push(`${exercise.id}: fill-in must contain exactly one blank`);
  }
  if (exercise.type === "number-line") {
    const answer = Number(exercise.answer.replace(",", "."));
    if (exercise.numberMin === undefined || exercise.numberMax === undefined || exercise.numberStep === undefined) failures.push(`${exercise.id}: incomplete number-line configuration`);
    else if (answer < exercise.numberMin || answer > exercise.numberMax || (answer - exercise.numberMin) % exercise.numberStep !== 0) failures.push(`${exercise.id}: number-line answer is unreachable`);
  }
  if (exercise.type === "matching" && (!exercise.pairs || exercise.pairs.length < 4 || exercise.pairs.length % 2 !== 0 || new Set(exercise.pairs.map(pair => pair.id)).size !== exercise.pairs.length)) {
    failures.push(`${exercise.id}: invalid matching pairs`);
  }
  if (exercise.type === "drag-drop") {
    const itemIds = exercise.dragItems?.map(item => item.id) ?? [];
    const zoneIds = new Set(exercise.dropZones?.map(zone => zone.id) ?? []);
    if (!itemIds.length || itemIds.some(itemId => !exercise.dropAnswers?.[itemId] || !zoneIds.has(exercise.dropAnswers[itemId]))) failures.push(`${exercise.id}: invalid drag-drop mapping`);
  }
}

const allGrade4Exercises: Exercise[] = getTopics(4, "math").flatMap(candidate => candidate.exercises);
for (const [lang, questionField, answerField] of languageFields.map(([lang, question, answer]) => [lang, question, answer] as const)) {
  const seen = new Map<string, string>();
  for (const exercise of allGrade4Exercises) {
    const question = exercise[questionField] ?? exercise.question;
    const answer = exercise[answerField] ?? exercise.answer;
    const key = `${normalize(question)}::${normalize(answer)}`;
    const previous = seen.get(key);
    if (previous && (previous.startsWith("g4dz") || exercise.id.startsWith("g4dz"))) failures.push(`${lang}: duplicate content ${previous}/${exercise.id}`);
    seen.set(key, exercise.id);
  }
}

console.log(JSON.stringify({
  topic: topic.id,
  exercises: topic.exercises.length,
  difficulties: Object.fromEntries([1, 2, 3].map(difficulty => [difficulty, topic.exercises.filter(exercise => exercise.difficulty === difficulty).length])),
  types: Object.fromEntries(expectedTypes.map(type => [type, topic.exercises.filter(exercise => exercise.type === type).length])),
  localisationsChecked: topic.exercises.length * 4,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
