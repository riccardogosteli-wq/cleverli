import { writeFileSync } from "node:fs";
import { getTopics } from "../src/data";
import { CONSOLIDATED_NMG_TOPIC_KEYS } from "../src/data/nmgConsolidation";

type ReviewRow = {
  family: "guided-writing" | "listening" | "nmg";
  grade: number;
  topicId: string;
  topicTitle: string;
  id: string;
  difficulty: number;
  type: string;
  question: string;
  answer: string;
  options: string;
  hints: string;
  listeningText: string;
  visuals: string;
};

const rows: ReviewRow[] = [];

function addTopic(family: ReviewRow["family"], grade: number, topicId: string) {
  const topic = getTopics(grade, family === "nmg" ? "science" : "german")
    .find(candidate => candidate.id === topicId);
  if (!topic) throw new Error(`Missing ${family} topic ${grade}/${topicId}`);
  for (const exercise of topic.exercises) {
    rows.push({
      family,
      grade,
      topicId,
      topicTitle: topic.title,
      id: exercise.id,
      difficulty: exercise.difficulty,
      type: exercise.type,
      question: exercise.question,
      answer: exercise.answer,
      options: (exercise.options ?? []).join(" | "),
      hints: (exercise.hints ?? []).join(" | "),
      listeningText: exercise.listeningText ?? "",
      visuals: (exercise.optionImages ?? exercise.optionEmojis ?? []).join(" | "),
    });
  }
}

for (const grade of [1, 2]) addTopic("guided-writing", grade, `gefuehrtes-schreiben-${grade}`);
for (const grade of [1, 2, 3, 4, 5, 6]) addTopic("listening", grade, `hoerverstehen-${grade}`);
for (const key of CONSOLIDATED_NMG_TOPIC_KEYS) {
  const [grade, topicId] = key.split("/");
  addTopic("nmg", Number(grade), topicId);
}

const columns = Object.keys(rows[0]) as (keyof ReviewRow)[];
const escape = (value: unknown) => `"${String(value).replaceAll('"', '""').replaceAll("\n", " ")}"`;
const csv = [columns.join(","), ...rows.map(row => columns.map(column => escape(row[column])).join(","))].join("\n");
const output = process.argv[2] ?? "/tmp/cleverli-recent-exercises-review.csv";
writeFileSync(output, csv);
console.log(JSON.stringify({ output, rows: rows.length, families: Object.fromEntries(["guided-writing", "listening", "nmg"].map(family => [family, rows.filter(row => row.family === family).length])) }, null, 2));
