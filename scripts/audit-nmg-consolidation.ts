import { getTopics } from "../src/data";
import { CONSOLIDATED_NMG_TOPIC_KEYS, getBalancedNmgCompetency } from "../src/data/nmgConsolidation";

const expectedTitles: Record<string, string> = {
  "1/sinne": "Bedürfnisse & Wünsche",
  "1/wetter-klima": "Unser Quartier",
  "3/energie-stoffe": "Arbeit & Berufe",
  "3/licht-optik": "Konsum & Geld",
  "4/koerper-sinne-4": "Werte & Zusammenleben",
  "4/energie-stoffe": "Produktion & Konsum",
  "4/raeume-karte": "Religionen & Feste",
  "5/weltall": "Medien & Information",
  "5/strom-elektrizitaet": "Arbeit, Handel & Transport",
  "5/geschichte-zeit": "Werte, Regeln & Konflikte",
  "6/weltall": "Berufswelt & Zukunft",
  "6/geschichte-zeit": "Religionen & Weltanschauungen",
};

const failures: string[] = [];
let exercises = 0;
for (const key of CONSOLIDATED_NMG_TOPIC_KEYS) {
  const [gradeText, topicId] = key.split("/");
  const grade = Number(gradeText);
  const topic = getTopics(grade, "science").find(candidate => candidate.id === topicId);
  if (!topic) {
    failures.push(`${key}: topic missing`);
    continue;
  }
  if (topic.title !== expectedTitles[key]) failures.push(`${key}: wrong title ${topic.title}`);
  if (!getBalancedNmgCompetency(grade, topicId)) failures.push(`${key}: LP21 mapping missing`);
  if (topic.exercises.length !== 50) failures.push(`${key}: expected 50 exercises, found ${topic.exercises.length}`);
  if (new Set(topic.exercises.map(exercise => exercise.id)).size !== topic.exercises.length) failures.push(`${key}: duplicate exercise IDs`);
  if (new Set(topic.exercises.map(exercise => `${exercise.type}|${exercise.question}|${exercise.answer}`)).size !== topic.exercises.length) failures.push(`${key}: duplicate exercise content`);
  for (const exercise of topic.exercises) {
    exercises += 1;
    if (!exercise.hints?.length) failures.push(`${key}/${exercise.id}: missing hint`);
    if (exercise.type === "multiple-choice" && !exercise.options?.includes(exercise.answer)) failures.push(`${key}/${exercise.id}: answer missing from options`);
    if (exercise.type === "fill-in-blank" && !exercise.question.includes("___")) failures.push(`${key}/${exercise.id}: fill-in has no blank`);
    if (exercise.type === "drag-drop" && (!exercise.dragItems?.length || !exercise.dropZones?.length || !exercise.dropAnswers)) failures.push(`${key}/${exercise.id}: incomplete drag-drop`);
    if (exercise.type === "memory" && (!exercise.pairs?.length || exercise.pairs.length % 2 !== 0)) failures.push(`${key}/${exercise.id}: incomplete memory game`);
  }
}

if (exercises !== 600) failures.push(`expected 600 consolidated exercises, found ${exercises}`);
console.log(JSON.stringify({ topics: CONSOLIDATED_NMG_TOPIC_KEYS.length, exercises, failures }, null, 2));
if (failures.length) process.exit(1);
