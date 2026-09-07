import fs from "node:fs";
import crypto from "node:crypto";
import { getSubjects, getTopics } from "../../src/data";
import { localizeExercise } from "../../src/lib/exerciseLocalization";
import { getExerciseSpeechText } from "../../src/hooks/useVoice";
import type { Lang } from "../../src/lib/i18n";

const out = ".qa/grade1-nmg/";
const rows: unknown[] = [];
const counts: Record<string, number> = {};

for (let grade = 1; grade <= 6; grade += 1) {
  for (const subject of getSubjects(grade)) {
    for (const topic of getTopics(grade, subject.id)) {
      for (const source of topic.exercises) {
        const exercise = localizeExercise(source, "de");
        const language: Lang = source.listeningText
          ? source.listeningLanguage ?? "de"
          : subject.id === "english"
            ? "en"
            : subject.id === "french"
              ? "fr"
              : "de";
        const content = Object.fromEntries(
          Object.entries(exercise).filter(([key]) => !/(EN|FR|IT)$/.test(key)),
        );
        const speech = getExerciseSpeechText(source, exercise, subject.id, language);
        const key = `${grade}/${subject.id}/${topic.id}/${exercise.id}`;
        rows.push({
          key,
          grade,
          subject: subject.id,
          topic: topic.id,
          title: topic.title,
          content,
          speech,
          language,
          hash: crypto
            .createHash("sha256")
            .update(JSON.stringify({ content, speech, language }))
            .digest("hex"),
        });
        counts[`${grade}/${subject.id}`] = (counts[`${grade}/${subject.id}`] ?? 0) + 1;
      }
    }
  }
}

fs.writeFileSync(`${out}current-de.jsonl`, rows.map((row) => JSON.stringify(row)).join("\n") + "\n");
fs.writeFileSync(`${out}current-inventory.json`, JSON.stringify({ at: new Date().toISOString(), total: rows.length, counts }, null, 2));
console.log(JSON.stringify({ total: rows.length, counts }));
